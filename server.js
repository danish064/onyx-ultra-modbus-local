const express = require('express');
const net = require('net');
const Modbus = require('jsmodbus');

const app = express();
app.use(express.json());

// Inverter connection parameters
const INVERTER_IP = process.env.INVERTER_IP || '192.168.1.100'; // Default, override with env var or config
const INVERTER_PORT = parseInt(process.env.INVERTER_PORT) || 502;
const SLAVE_ID = parseInt(process.env.INVERTER_SLAVE) || 1;
const PORT = process.env.PORT || 3000;

// Mutex lock to prevent overlapping connections
let isPolling = false;

const SENSORS = [
  // Fast Sensors
  { key: "live_pv_total_power", name: "Live PV Total Power", register: 4168, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { key: "pv1_voltage", name: "PV1 Voltage", register: 4112, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { key: "pv1_current", name: "PV1 Current", register: 4113, type: "uint16", scale: 0.01, unit: "A", swap: false },
  { key: "pv1_power", name: "PV1 Power", register: 4114, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { key: "pv2_voltage", name: "PV2 Voltage", register: 4116, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { key: "pv2_current", name: "PV2 Current", register: 4117, type: "uint16", scale: 0.01, unit: "A", swap: false },
  { key: "pv2_power", name: "PV2 Power", register: 4118, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { key: "pv3_voltage", name: "PV3 Voltage", register: 4120, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { key: "pv3_current", name: "PV3 Current", register: 4121, type: "uint16", scale: 0.01, unit: "A", swap: false },
  { key: "pv3_power", name: "PV3 Power", register: 4122, type: "uint32", scale: 0.1, unit: "W", swap: false },
  { key: "battery_power", name: "Battery Power", register: 8201, type: "int32", scale: 0.1, unit: "W", swap: false },
  { key: "battery_soc", name: "Battery State of Charge", register: 8192, type: "uint16", scale: 1, unit: "%", swap: false },
  { key: "load_power", name: "Load Power", register: 4875, type: "int32", scale: 0.1, unit: "W", swap: true },
  { key: "grid_power", name: "Grid Power", register: 4865, type: "int32", scale: 0.1, unit: "W", swap: true },
  { key: "inverter_ct_clamp_power", name: "Inverter CT Clamp Power", register: 4864, type: "int32", scale: 0.1, unit: "W", swap: false },
  { key: "light_load_power", name: "Light Load Power", register: 4947, type: "int32", scale: 0.1, unit: "W", swap: false },
  
  // Slow Sensors
  { key: "battery_temperature", name: "Battery Temperature", register: 8220, type: "int16", scale: 1, unit: "°C", swap: false },
  { key: "battery_voltage", name: "Battery Voltage", register: 8198, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { key: "battery_current", name: "Battery Current", register: 8200, type: "int32", scale: 0.01, unit: "A", swap: true },
  { key: "battery_charge_energy_today", name: "Today Battery Energy Charge", register: 8203, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { key: "battery_charge_lifetime_energy", name: "Battery Charge Lifetime Energy", register: 8205, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { key: "battery_discharge_energy_today", name: "Battery Discharge Energy Today", register: 8207, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { key: "battery_discharge_lifetime_energy", name: "Battery Discharge Lifetime Energy", register: 8209, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { key: "discharge_end_soc_on_battery", name: "Discharge End SOC (on battery)", register: 8475, type: "uint16", scale: 1, unit: "%", swap: false },
  { key: "discharge_end_soc_on_grid", name: "Discharge End SOC (on grid)", register: 8522, type: "uint16", scale: 1, unit: "%", swap: false },
  { key: "off_grid_mode", name: "Off-Grid Mode", register: 8476, type: "uint16", scale: 1, unit: "", swap: false },
  { key: "maximum_grid_charging_power", name: "Max Grid Charging Power", register: 8470, type: "uint16", scale: 1, unit: "W", swap: false },
  { key: "max_grid_export_power", name: "Max Grid Export Power", register: 12473, type: "uint32", scale: 1, unit: "W", swap: false },
  { key: "stop_grid_charging_battery_soc", name: "Stop Grid Charging Battery SOC", register: 8471, type: "uint16", scale: 1, unit: "%", swap: false },
  { key: "battery_charging_max_power", name: "Battery Charging Max Power", register: 8472, type: "uint16", scale: 1, unit: "W", swap: false },
  { key: "battery_stop_charging_maximum_soc", name: "Battery Stop Charging Maximum SOC", register: 8473, type: "uint16", scale: 1, unit: "%", swap: false },
  { key: "grid_frequency", name: "Grid Frequency", register: 4920, type: "uint16", scale: 0.01, unit: "Hz", swap: false },
  { key: "smart_load_power", name: "Smart Load Power", register: 4974, type: "int16", scale: 0.1, unit: "W", swap: false },
  { key: "smart_load_turn_on_battery_soc", name: "Smart Load Turn ON Battery SOC", register: 8492, type: "uint16", scale: 1, unit: "%", swap: false },
  { key: "smart_load_turn_off_battery_soc", name: "Smart Load Turn OFF Battery SOC", register: 8493, type: "uint16", scale: 1, unit: "%", swap: false },
  { key: "inverter_internal_temperature", name: "Inverter Internal Temperature", register: 4124, type: "int16", scale: 1, unit: "°C", swap: false },
  { key: "energy_produced_today", name: "Energy Produced Today", register: 4135, type: "uint32", scale: 0.001, unit: "kWh", swap: false },
  { key: "energy_produced_lifetime", name: "Energy Produced Lifetime", register: 4130, type: "uint32", scale: 1, unit: "kWh", swap: true },
  { key: "inverter_operating_hours", name: "Inverter Operating Hours", register: 4132, type: "uint32", scale: 1, unit: "h", swap: true },
  { key: "peak_production_power_today", name: "Peak Production Power Today", register: 4155, type: "int32", scale: 0.1, unit: "W", swap: false },
  { key: "energy_import_lifetime", name: "Energy Import Lifetime", register: 4870, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { key: "energy_import_today", name: "Energy Import Today", register: 4915, type: "uint32", scale: 0.01, unit: "kWh", swap: true },
  { key: "energy_export_lifetime", name: "Energy Export Lifetime", register: 4872, type: "uint32", scale: 0.01, unit: "kWh", swap: false },
  { key: "energy_export_today", name: "Energy Export Today", register: 4917, type: "uint32", scale: 0.01, unit: "kWh", swap: true },
  { key: "load_voltage", name: "Load Voltage", register: 4900, type: "uint16", scale: 0.1, unit: "V", swap: false },
  { key: "load_current", name: "Load Current", register: 4904, type: "int32", scale: 0.01, unit: "A", swap: true },
  { key: "light_load_lifetime_energy", name: "Light Load Lifetime Energy", register: 4962, type: "int32", scale: 0.01, unit: "kWh", swap: false },
  { key: "grid_export_power", name: "Grid Export Power", register: 4099, type: "int32", scale: 0.1, unit: "W", swap: false },
  { key: "inverter_solar_conversion_power", name: "Inverter Solar Conversion Power", register: 4151, type: "int32", scale: 0.1, unit: "W", swap: false },
  { key: "inverter_operation_mode_raw", name: "Inverter Operation Mode Raw", register: 8448, type: "uint16", scale: 1, unit: "", swap: false }
];

const BLOCKS = [
  { start: 4099, end: 4175 },
  { start: 4864, end: 4978 },
  { start: 8192, end: 8227 },
  { start: 8448, end: 8528 },
  { start: 12473, end: 12475 }
];

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
    
    const combined = ((high & 0xffff) << 16) | (low & 0xffff);
    let val = type === 'int32' ? combined : (combined >>> 0);
    return Number((val * scale).toFixed(2));
  }
}

// Polling function
async function pollInverter(ip) {
  const socket = new net.Socket();
  const client = new Modbus.client.TCP(socket, SLAVE_ID);
  const data = {};

  socket.on('error', (err) => {
    // Suppress unhandled socket errors
  });

  await new Promise((resolve, reject) => {
    socket.connect({ host: ip, port: INVERTER_PORT }, resolve);
    socket.on('error', reject);
    // Timeout connection after 5 seconds
    setTimeout(() => reject(new Error('Connection timeout')), 5000);
  });

  try {
    for (const block of BLOCKS) {
      const count = block.end - block.start;
      const response = await client.readHoldingRegisters(block.start, count);
      const values = response.response.body.values;
      
      SENSORS.forEach(sensor => {
        if (sensor.register >= block.start && sensor.register < block.end) {
          try {
            const val = decode(values, block.start, sensor.register, sensor.type, sensor.swap, sensor.scale);
            data[sensor.key] = {
              name: sensor.name,
              value: val,
              unit: sensor.unit
            };
          } catch (e) {
            // Ignore decoding issues for unaligned blocks
          }
        }
      });
    }
    return data;
  } finally {
    socket.end();
  }
}

// Endpoint to get all metrics
app.get('/api/metrics', async (req, res) => {
  const ip = req.query.ip || INVERTER_IP;
  
  if (isPolling) {
    return res.status(503).json({ error: "Modbus connection busy. Try again shortly." });
  }

  isPolling = true;
  try {
    const data = await pollInverter(ip);
    res.json({
      timestamp: new Date().toISOString(),
      inverter_ip: ip,
      metrics: data
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to poll inverter: " + error.message });
  } finally {
    isPolling = false;
  }
});

// Endpoint to write a register
app.post('/api/settings', async (req, res) => {
  const { register, value, type, ip } = req.body;
  const targetIp = ip || INVERTER_IP;

  if (register === undefined || value === undefined) {
    return res.status(400).json({ error: "Missing 'register' or 'value' parameter." });
  }

  if (isPolling) {
    return res.status(503).json({ error: "Modbus connection busy. Try again shortly." });
  }

  isPolling = true;
  const socket = new net.Socket();
  const client = new Modbus.client.TCP(socket, SLAVE_ID);

  socket.on('error', () => {});

  try {
    await new Promise((resolve, reject) => {
      socket.connect({ host: targetIp, port: INVERTER_PORT }, resolve);
      socket.on('error', reject);
    });

    console.log(`Writing register ${register} value ${value}...`);
    // Currently supports single 16-bit register writing
    await client.writeSingleRegister(parseInt(register), parseInt(value));
    
    res.json({ success: true, register, value });
  } catch (error) {
    res.status(500).json({ error: "Failed to write register: " + error.message });
  } finally {
    socket.end();
    isPolling = false;
  }
});

app.listen(PORT, () => {
  console.log(`Solarmax Onyx Modbus API Server running on port ${PORT}`);
  console.log(`Default target Inverter IP: ${INVERTER_IP}`);
});
