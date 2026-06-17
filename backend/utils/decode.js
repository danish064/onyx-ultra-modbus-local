export function decodeRegister(values, startAddress, targetAddress, type, swap, scale) {
  const offset = targetAddress - startAddress;
  if (!values || offset < 0 || offset >= values.length) {
    throw new Error('Offset out of bounds');
  }

  if (type === 'uint16' || type === 'int16') {
    const val = values[offset];
    if (val === undefined) throw new Error('Value undefined');
    const signedVal = type === 'int16' ? (val >= 0x8000 ? val - 0x10000 : val) : val;
    return Number((signedVal * scale).toFixed(2));
  }

  if (type === 'uint32' || type === 'int32') {
    if (offset + 1 >= values.length) throw new Error('Offset out of bounds for 32-bit val');
    const word1 = values[offset];
    const word2 = values[offset + 1];
    if (word1 === undefined || word2 === undefined) throw new Error('Values undefined');

    const high = swap ? word2 : word1;
    const low = swap ? word1 : word2;

    const combined = ((high & 0xffff) << 16) | (low & 0xffff);
    const val = type === 'int32' ? combined : (combined >>> 0);
    return Number((val * scale).toFixed(2));
  }
}
