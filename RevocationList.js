/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import base64url from 'base64url-universal';
import pako from 'pako';
import Bitstring from './Bitstring.js';

const {gzip, ungzip} = pako;

export default class RevocationList {
  constructor({length, buffer} = {}) {
    this.bitstring = new Bitstring({length, buffer});
    this.length = this.bitstring.length;
  }

  setRevoked(index, revoked) {
    return this.bitstring.set(index, revoked);
  }

  isRevoked(index) {
    return this.bitstring.get(index);
  }

  async encode() {
    return base64url.encode(gzip(this.bitstring.bits));
  }

  static async decode({encodedList}) {
    const buffer = ungzip(base64url.decode(encodedList));
    return new RevocationList({buffer});
  }
}
