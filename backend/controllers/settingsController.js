import { config } from '../config.js';
import { writeRegister } from '../utils/modbus.js';
import { acquireLock, releaseLock } from '../utils/mutex.js';

export async function updateSetting(req, res) {
  const { register, value, ip } = req.body;
  const targetIp = ip || config.inverterIp;

  if (register === undefined || value === undefined) {
    return res.status(400).json({ error: "Missing 'register' or 'value' parameter." });
  }

  if (!acquireLock()) {
    return res.status(503).json({ error: 'Modbus connection busy. Try again shortly.' });
  }

  try {
    console.log(`Writing register ${register} value ${value}...`);
    await writeRegister(targetIp, register, value);
    res.json({ success: true, register, value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write register: ' + error.message });
  } finally {
    releaseLock();
  }
}
