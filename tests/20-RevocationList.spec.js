/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import RevocationList from '../RevocationList.js';

describe('RevocationList', () => {
  it('should create a RevocationList', async () => {
    const list = new RevocationList({length: 8});
    list.length.should.equal(8);
  });

  it('should fail to create a RevocationList if no length', async () => {
    let err;
    try {
      new RevocationList();
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('TypeError');
  });

  it('should encode a RevocationList', async () => {
    const list = new RevocationList({length: 100000});
    const encodedList = await list.encode();
    encodedList.should.equal(
      'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA');
  });

  it('should decode a RevocationList', async () => {
    const encodedList =
      'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA';
    const list = await RevocationList.decode({encodedList});
    list.length.should.equal(100000);
  });
});
