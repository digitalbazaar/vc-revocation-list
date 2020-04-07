/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import Bitstring from '../Bitstring.js';

describe('Bitstring', () => {
  it('should create a Bitstring', async () => {
    const bitstring = new Bitstring({length: 8});
    bitstring.length.should.equal(8);
    bitstring.bits.should.be.a('Uint8Array');
    bitstring.bits.length.should.equal(1);
  });

  it('should fail to create a Bitstring if no length', async () => {
    let err;
    try {
      new Bitstring();
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('TypeError');
  });

  it('should set a bit', async () => {
    const bitstring = new Bitstring({length: 8});
    bitstring.get(0).should.equal(false);
    bitstring.get(1).should.equal(false);
    bitstring.get(2).should.equal(false);
    bitstring.get(3).should.equal(false);
    bitstring.get(4).should.equal(false);
    bitstring.get(5).should.equal(false);
    bitstring.get(6).should.equal(false);
    bitstring.get(7).should.equal(false);
    bitstring.set(4, true);
    bitstring.get(0).should.equal(false);
    bitstring.get(1).should.equal(false);
    bitstring.get(2).should.equal(false);
    bitstring.get(3).should.equal(false);
    bitstring.get(4).should.equal(true);
    bitstring.get(5).should.equal(false);
    bitstring.get(6).should.equal(false);
    bitstring.get(7).should.equal(false);
  });
});
