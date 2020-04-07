/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
export default class Bitstring {
  constructor({length, buffer} = {}) {
    if(length && buffer) {
      throw new Error('Only one of "length" or "buffer" must be given.');
    }
    if(length !== undefined) {
      if(!(Number.isInteger(length) && length > 0)) {
        throw new TypeError('"length" must be a positive integer.');
      }
    } else if(!(buffer instanceof Uint8Array)) {
      throw new TypeError('"buffer" must be a Uint8Array.');
    }
    if(length) {
      this.bits = new Uint8Array(Math.ceil(length / 8));
      this.length = length;
    } else {
      this.bits = new Uint8Array(buffer.buffer);
      this.length = buffer.length * 8;
    }
  }

  set(position, on) {
    const {index, bit} = parsePosition(position, this.length);
    if(on) {
      this.bits[index] |= bit;
    } else {
      this.bits[index] &= 0xFFFFFFFF ^ bit;
    }
  }

  get(position) {
    const {index, bit} = parsePosition(position, this.length);
    return !!(this.bits[index] & bit);
  }
}

function parsePosition(position, length) {
  if(!(Number.isInteger(position) && position >= 0)) {
    throw new Error(`Position "${position}" must be a non-negative integer.`);
  }
  const index = Math.floor(position / 8);
  const bit = 1 << (position % 8);
  if(index >= length) {
    throw new Error(`Position "${position}" is out of range "0-${length}".`);
  }
  return {index, bit};
}
