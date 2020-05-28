/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import Bitstring from '../Bitstring.js';

describe('Bitstring', () => {
  it('should create an instance', async () => {
    const bitstring = new Bitstring({length: 8});
    bitstring.length.should.equal(8);
    bitstring.bits.should.be.a('Uint8Array');
    bitstring.bits.length.should.equal(1);
  });

  it('should fail to create an instance if no length', async () => {
    let err;
    try {
      new Bitstring();
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('TypeError');
  });

  it('should fail to create an instance if buffer and length', async () => {
    let err;
    try {
      new Bitstring({length: 'foo', buffer: 'bar'});
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.should.be.instanceof(Error);
    err.message.should.contain('one of "length" or "buffer"');
  });

  it('fails to create instance if length is not positive integer', async () => {
    let err;
    try {
      new Bitstring({length: -2.2});
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.should.be.instanceof(TypeError);
    err.message.should.contain('positive integer');
  });
  
  it('should set a bit to true', async () => {
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

  it('should set a bit to false', async () => {
    const buffer = Uint8Array.from([255]);
    const bitstring = new Bitstring({buffer});
    bitstring.get(0).should.equal(true);
    bitstring.get(1).should.equal(true);
    bitstring.get(2).should.equal(true);
    bitstring.get(3).should.equal(true);
    bitstring.get(4).should.equal(true);
    bitstring.get(5).should.equal(true);
    bitstring.get(6).should.equal(true);
    bitstring.get(7).should.equal(true);
    bitstring.set(4, false);
    bitstring.get(0).should.equal(true);
    bitstring.get(1).should.equal(true);
    bitstring.get(2).should.equal(true);
    bitstring.get(3).should.equal(true);
    bitstring.get(4).should.equal(false);
    bitstring.get(5).should.equal(true);
    bitstring.get(6).should.equal(true);
    bitstring.get(7).should.equal(true);
    bitstring.bits.should.have.length(1);
    bitstring.length.should.equal(8);
    bitstring.bits[0].should.equal(239);
  });

  it('should fail to set a bit', async () => {
    const list = new Bitstring({length: 8});
    let err;
    try {
      list.set(0);
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('TypeError');
  });

  it('should fail to get a bit out of range', async () => {
    const list = new Bitstring({length: 8});
    let err;
    try {
      list.get(8);
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('Error');
  });
});
