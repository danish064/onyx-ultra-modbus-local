import app from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`Solarmax Onyx Modbus API Server running on port ${config.port}`);
  console.log(`Default target Inverter IP: ${config.inverterIp}`);
});
