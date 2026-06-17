import { config } from '../config.js';
import { pollInverter } from '../utils/modbus.js';
import { acquireLock, releaseLock } from '../utils/mutex.js';

let cachedMetrics = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 3000; // Cache duration in milliseconds

export async function getMetrics(req, res) {
  const ip = req.query.ip || config.inverterIp;
  const now = Date.now();

  // 1. Return fresh cache if within TTL
  if (cachedMetrics && (now - lastFetchTime < CACHE_TTL_MS)) {
    return res.json({
      timestamp: new Date(lastFetchTime).toISOString(),
      inverter_ip: ip,
      metrics: cachedMetrics,
      cached: true
    });
  }

  // 2. Acquire lock for live poll
  if (!acquireLock()) {
    // If lock is busy, serve stale cache as fallback instead of 503 error
    if (cachedMetrics) {
      return res.json({
        timestamp: new Date(lastFetchTime).toISOString(),
        inverter_ip: ip,
        metrics: cachedMetrics,
        cached: true,
        fallback: true
      });
    }
    return res.status(503).json({ error: 'Modbus connection busy. Try again shortly.' });
  }

  try {
    const data = await pollInverter(ip);
    cachedMetrics = data;
    lastFetchTime = Date.now();

    res.json({
      timestamp: new Date(lastFetchTime).toISOString(),
      inverter_ip: ip,
      metrics: data,
    });
  } catch (error) {
    console.error('Error polling inverter metrics:', error);
    
    // If polling fails but cache exists, return stale cache as fallback
    if (cachedMetrics) {
      return res.json({
        timestamp: new Date(lastFetchTime).toISOString(),
        inverter_ip: ip,
        metrics: cachedMetrics,
        cached: true,
        fallback: true,
        error: error.message
      });
    }

    res.status(500).json({ error: 'Failed to poll inverter: ' + error.message });
  } finally {
    releaseLock();
  }
}
