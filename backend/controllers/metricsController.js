import { config } from '../config.js';
import { pollInverter } from '../utils/modbus.js';
import { acquireLock, releaseLock } from '../utils/mutex.js';

export async function getMetrics(req, res) {
  const ip = req.query.ip || config.inverterIp;

  if (!acquireLock()) {
    return res.status(503).json({ error: 'Modbus connection busy. Try again shortly.' });
  }

  try {
    const data = await pollInverter(ip);
    res.json({
      timestamp: new Date().toISOString(),
      inverter_ip: ip,
      metrics: data,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to poll inverter: ' + error.message });
  } finally {
    releaseLock();
  }
}
