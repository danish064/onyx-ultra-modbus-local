const net = require('net');
const Modbus = require('jsmodbus');

// Parse IP from command line arguments
const host = process.argv[2];
if (!host) {
  console.error('Error: Please provide the inverter IP address.');
  console.error('Usage: node verify.js <inverter_ip> [port] [slave_id]');
  process.exit(1);
}

const port = parseInt(process.argv[3]) || 502;
const slaveId = parseInt(process.argv[4]) || 1;

console.log(`Connecting to Solarmax Onyx PV 9000 Inverter at ${host}:${port} (Slave: ${slaveId})...`);

const socket = new net.Socket();
const client = new Modbus.client.TCP(socket, slaveId);

const SENSORS = [
  // Fast Sensors
  { name: "Live PV Total Power", register: 4168, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { name: "PV1 Voltage", register: 4112, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { name: "PV1 Current", register: 4113, type: "uint16", scale: 0.01, unit: "A", swap: false },
  { name: "PV1 Power", register: 4114, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { name: "PV2 Voltage", register: 4116, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { name: "PV2 Current", register: 4117, type: "uint16", scale: 0.01, unit: "A", swap: false },
  { name: "PV2 Power", register: 4118, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { name: "PV3 Voltage", register: 4120, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { name: "PV3 Current", register: 4121, type: "uint16", scale: 0.01, unit: "A", swap: false },
  { name: "PV3 Power", register: 4122, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { name: "Battery Power", register: 8201, type: "int32", scale: 0.1, unit: "W", swap: false },
  { name: "Battery State of Charge", register: 8192, type: "uint16", scale: 1, unit: "%", swap: false },
  { name: "Load Power", register: 4875, type: "int32", scale: 0.1, unit: "W", swap: true },
  { name: "Grid Power", register: 4865, type: "int32", scale: 0.1, unit: "W", swap: true },
  { name: "Inverter CT Clamp Power", register: 4864, type: "int32", scale: 0.1, unit: "W", swap: false },
  { name: "Light Load Power", register: 4947, type: "int32", scale: 0.1, unit: "W", swap: false },
  
  // Slow Sensors
  { name: "Battery Temperature", register: 8220, type: "int16", scale: 1, unit: "°C", swap: false },
  { name: "Battery Voltage", register: 8198, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { name: "Battery Current", register: 8200, type: "int32", scale: 0.01, unit: "A", swap: true },
  { name: "Today Battery Energy Charge", register: 8203, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { name: "Battery Charge Lifetime Energy", register: 8205, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { name: "Battery Discharge Energy Today", register: 8207, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { name: "Battery Discharge Lifetime Energy", register: 8209, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { name: "Discharge End SOC (on battery)", register: 8475, type: "uint16", scale: 1, unit: "%", swap: false },
  { name: "Discharge End SOC (on grid)", register: 8522, type: "uint16", scale: 1, unit: "%", swap: false },
  { name: "Off-Grid Mode", register: 8476, type: "uint16", scale: 1, unit: "", swap: false },
  { name: "Max Grid Charging Power", register: 8470, type: "uint16", scale: 1, unit: "W", swap: false },
  { name: "Max Grid Export Power", register: 12473, type: "uint32", scale: 1, unit: "W", swap: false },
  { name: "Stop Grid Charging Battery SOC", register: 8471, type: "uint16", scale: 1, unit: "%", swap: false },
  { name: "Battery Charging Max Power", register: 8472, type: "uint16", scale: 1, unit: "W", swap: false },
  { name: "Battery Stop Charging Maximum SOC", register: 8473, type: "uint16", scale: 1, unit: "%", swap: false },
  { name: "Grid Frequency", register: 4920, type: "uint16", scale: 0.01, unit: "Hz", swap: false },
  { name: "Smart Load Power", register: 4974, type: "int16", scale: 0.1, unit: "W", swap: false },
  { name: "Smart Load Turn ON Battery SOC", register: 8492, type: "uint16", scale: 1, unit: "%", swap: false },
  { name: "Smart Load Turn OFF Battery SOC", register: 8493, type: "uint16", scale: 1, unit: "%", swap: false },
  { name: "Inverter Internal Temperature", register: 4124, type: "int16", scale: 1, unit: "°C", swap: false },
  { name: "Energy Produced Today", register: 4135, type: "uint32", scale: 0.001, unit: "kWh", swap: false },
  { name: "Energy Produced Lifetime", register: 4130, type: "uint32", scale: 1, unit: "kWh", swap: true },
  { name: "Inverter Operating Hours", register: 4132, type: "uint32", scale: 1, unit: "h", swap: true },
  { name: "Peak Production Power Today", register: 4155, type: "int32", scale: 0.1, unit: "W", swap: false },
  { name: "Energy Import Lifetime", register: 4870, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { name: "Energy Import Today", register: 4915, type: "uint32", scale: 0.01, unit: "kWh", swap: true },
  { name: "Energy Export Lifetime", register: 4872, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { name: "Energy Export Today", register: 4917, type: "uint32", scale: 0.01, unit: "kWh", swap: true },
  { name: "Load Voltage", register: 4900, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { name: "Load Current", register: 4904, type: "int32", scale: 0.01, unit: "A", swap: true },
  { name: "Light Load Lifetime Energy", register: 4962, type: "int32", scale: 0.01, unit: "kWh", swap: false },
  { name: "Grid Export Power", register: 4099, type: "int32", scale: 0.1, unit: "W", swap: false },
  { name: "Inverter Solar Conversion Power", register: 4151, type: "int32", scale: 0.1, unit: "W", swap: false },
  { name: "Inverter Operation Mode Raw", register: 8448, type: "uint16", scale: 1, unit: "", swap: false }
];

// Helper to decode registers
function decode(values, startAddress, targetAddress, type, swap, scale) {
  const offset = targetAddress - startAddress;
  
  if (type === 'uint16' || type === 'int16') {
    const val = values[offset];
    const signedVal = type === 'int16' ? (val >= 0x8000 ? val - 0x10000 : val) : val;
    return Number((signedVal * scale).toFixed(2));
  } else if (type === 'uint32' || type === 'int32') {
    const word1 = values[offset];
    const word2 = values[offset + 1];
    
    let high = swap ? word2 : word1;
    let low = swap ? word1 : word2;
    
    // Combine 16-bit words into 32-bit
    const combined = ((high & 0xffff) << 16) | (low & 0xffff);
    let val = type === 'int32' ? combined : (combined >>> 0);
    return Number((val * scale).toFixed(2));
  }
}

// Define the blocks to read to optimize TCP requests
const BLOCKS = [
  { start: 4099, end: 4175 }, // Block 1 (PV & Grid export)
  { start: 4864, end: 4978 }, // Block 2 (CT, Grid, Load power)
  { start: 8192, end: 8227 }, // Block 3 (Battery info)
  { start: 8448, end: 8528 }, // Block 4 (Settings and limits)
  { start: 12473, end: 12475 } // Block 5 (Grid export settings)
];

const results = {};

async function run() {
  socket.on('error', (err) => {
    console.error('Socket Error:', err.message);
  });

  // Perform connection
  await new Promise((resolve, reject) => {
    socket.connect({ host, port }, () => {
      console.log('Connected via TCP. Initializing Modbus read session...');
      resolve();
    });
    socket.on('error', reject);
  });

  try {
    for (const block of BLOCKS) {
      const count = block.end - block.start;
      console.log(`Reading registers ${block.start} to ${block.end} (count: ${count})...`);
      
      const response = await client.readHoldingRegisters(block.start, count);
      const values = response.response.body.values;
      
      // Map and decode values
      SENSORS.forEach(sensor => {
        if (sensor.register >= block.start && sensor.register < block.end) {
          try {
            const decodedValue = decode(values, block.start, sensor.register, sensor.type, sensor.swap, sensor.scale);
            results[sensor.name] = decodedValue;
          } catch (e) {
            // Ignore if out of bounds or error parsing
          }
        }
      });
    }

    console.log('\n--- SUCCESS! Decoded Inverter Data ---');
    console.table(
      Object.keys(results).map(key => ({
        Sensor: key,
        Value: results[key] + ' ' + (SENSORS.find(s => s.name === key).unit || '')
      }))
    );

  } catch (error) {
    console.error('Modbus Polling Failed:', error);
  } finally {
    socket.end();
    console.log('Modbus connection closed.');
  }
}

run().catch(console.error);
