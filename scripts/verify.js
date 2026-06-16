import { pollInverter } from '../backend/utils/modbus.js';

const host = process.argv[2];
if (!host) {
  console.error('Error: Please provide the inverter IP address.');
  console.error('Usage: node scripts/verify.js <inverter_ip> [port] [slave_id]');
  process.exit(1);
}

const port = parseInt(process.argv[3]) || 502;
const slaveId = parseInt(process.argv[4]) || 1;

console.log(`Connecting to Solarmax Onyx PV 9000 Inverter at ${host}:${port} (Slave: ${slaveId})...`);

try {
  const data = await pollInverter(host, { port, slaveId });

  console.log('\n--- SUCCESS! Decoded Inverter Data ---');
  console.table(
    Object.values(data).map(({ name, value, unit }) => ({
      Sensor: name,
      Value: unit ? `${value} ${unit}` : String(value),
    }))
  );
} catch (error) {
  console.error('Modbus Polling Failed:', error.message);
  process.exit(1);
}

console.log('Modbus connection closed.');
