import net from 'net';
import Modbus from 'jsmodbus';
import { config } from '../config.js';
import { SENSORS, BLOCKS } from '../data/registers.js';
import { decodeRegister } from './decode.js';

function connectSocket(socket, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    socket.connect({ host, port }, resolve);
    socket.on('error', reject);
    setTimeout(() => reject(new Error('Connection timeout')), timeoutMs);
  });
}

export async function pollInverter(ip, options = {}) {
  const port = options.port ?? config.inverterPort;
  const slaveId = options.slaveId ?? config.slaveId;
  const timeoutMs = options.timeoutMs ?? config.connectionTimeoutMs;

  const socket = new net.Socket();
  const client = new Modbus.client.TCP(socket, slaveId);
  const data = {};

  socket.on('error', () => {});

  await connectSocket(socket, ip, port, timeoutMs);

  try {
    for (const block of BLOCKS) {
      const count = block.end - block.start;
      const response = await client.readHoldingRegisters(block.start, count);
      const values = response.response.body.values;

      SENSORS.forEach((sensor) => {
        if (sensor.register >= block.start && sensor.register < block.end) {
          try {
            const val = decodeRegister(
              values,
              block.start,
              sensor.register,
              sensor.type,
              sensor.swap,
              sensor.scale
            );
            data[sensor.key] = {
              name: sensor.name,
              value: val,
              unit: sensor.unit,
            };
          } catch {
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

export async function writeRegister(ip, register, value, options = {}) {
  const port = options.port ?? config.inverterPort;
  const slaveId = options.slaveId ?? config.slaveId;

  const socket = new net.Socket();
  const client = new Modbus.client.TCP(socket, slaveId);

  socket.on('error', () => {});

  try {
    await connectSocket(socket, ip, port, config.connectionTimeoutMs);
    await client.writeSingleRegister(parseInt(register), parseInt(value));
  } finally {
    socket.end();
  }
}
