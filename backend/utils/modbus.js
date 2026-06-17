import net from 'net';
import Modbus from 'jsmodbus';
import { config } from '../config.js';
import { SENSORS, BLOCKS } from '../data/registers.js';
import { decodeRegister } from './decode.js';

function connectSocket(socket, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    let completed = false;

    const timer = setTimeout(() => {
      if (completed) return;
      completed = true;
      socket.destroy();
      reject(new Error('Connection timeout'));
    }, timeoutMs);

    socket.connect(port, host, () => {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      resolve();
    });

    socket.once('error', (err) => {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      socket.destroy();
      reject(err);
    });
  });
}

export async function pollInverter(ip, options = {}) {
  const port = options.port ?? config.inverterPort;
  const slaveId = options.slaveId ?? config.slaveId;
  const timeoutMs = options.timeoutMs ?? config.connectionTimeoutMs;

  const socket = new net.Socket();
  const client = new Modbus.client.TCP(socket, slaveId);
  const data = {};

  socket.on('error', (err) => {
    console.error('Socket error caught:', err.message);
    socket.destroy();
  });

  socket.setTimeout(timeoutMs);
  socket.on('timeout', () => {
    console.error(`Socket read idle timeout of ${timeoutMs}ms exceeded`);
    socket.destroy();
  });

  try {
    await connectSocket(socket, ip, port, timeoutMs);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < BLOCKS.length; i++) {
      const block = BLOCKS[i];
      if (i > 0) {
        await sleep(100); // 100ms pause between block requests to prevent inverter buffer overflow
      }
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
  } catch (error) {
    console.error(`Poll error for inverter at ${ip}:`, error.message);
    throw error;
  } finally {
    socket.destroy();
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
    socket.destroy();
  }
}
