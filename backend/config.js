export const config = {
  inverterIp: process.env.INVERTER_IP || '192.168.1.100',
  inverterPort: parseInt(process.env.INVERTER_PORT) || 502,
  slaveId: parseInt(process.env.INVERTER_SLAVE) || 1,
  port: process.env.PORT || 3000,
  connectionTimeoutMs: 5000,
};
