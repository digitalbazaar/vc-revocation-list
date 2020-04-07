/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import RevocationList from '../RevocationList.js';

describe('RevocationList', () => {
  it('should create an instance', async () => {
    const list = new RevocationList({length: 8});
    list.length.should.equal(8);
  });

  it('should fail to create an instance if no length', async () => {
    let err;
    try {
      new RevocationList();
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('TypeError');
  });

  it('should encode', async () => {
    const list = new RevocationList({length: 100000});
    const encodedList = await list.encode();
    encodedList.should.equal(
      'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA');
  });

  it('should decode', async () => {
    const encodedList =
      'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA';
    const list = await RevocationList.decode({encodedList});
    list.length.should.equal(100000);
  });

  it('should mark a credential revoked', async () => {
    const list = new RevocationList({length: 8});
    list.isRevoked(0).should.equal(false);
    list.isRevoked(1).should.equal(false);
    list.isRevoked(2).should.equal(false);
    list.isRevoked(3).should.equal(false);
    list.isRevoked(4).should.equal(false);
    list.isRevoked(5).should.equal(false);
    list.isRevoked(6).should.equal(false);
    list.isRevoked(7).should.equal(false);
    list.setRevoked(4, true);
    list.isRevoked(0).should.equal(false);
    list.isRevoked(1).should.equal(false);
    list.isRevoked(2).should.equal(false);
    list.isRevoked(3).should.equal(false);
    list.isRevoked(4).should.equal(true);
    list.isRevoked(5).should.equal(false);
    list.isRevoked(6).should.equal(false);
    list.isRevoked(7).should.equal(false);
  });

  it('should fail to mark a credential revoked', async () => {
    const list = new RevocationList({length: 8});
    let err;
    try {
      list.setRevoked(0);
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('TypeError');
  });

  it('should fail to get a credential status out of range', async () => {
    const list = new RevocationList({length: 8});
    let err;
    try {
      list.isRevoked(8);
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('Error');
  });

  it('should mark a credential revoked, encode and decode', async () => {
    const list = new RevocationList({length: 100000});
    list.isRevoked(50000).should.equal(false);
    list.setRevoked(50000, true);
    list.isRevoked(50000).should.equal(true);
    const encodedList = await list.encode();
    encodedList.should.equal(
      'H4sIAAAAAAAAA-3OMQ0AAAgDsOHfNB72EJJWQRMAAAAAAIDWXAcAAAAAAIDHFrc4zDz' +
      'UMAAA');
    const decodedList = await RevocationList.decode({encodedList});
    decodedList.isRevoked(50000).should.equal(true);
  });
});
