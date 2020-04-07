/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {createList, decodeList, createCredential} from '..';

const encodedList100k =
  'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA';

describe('main', () => {
  it('should create a list', async () => {
    const list = await createList({length: 8});
    list.length.should.equal(8);
  });

  it('should fail to create a list if no length', async () => {
    let err;
    try {
      await createList();
    } catch(e) {
      err = e;
    }
    should.exist(err);
    err.name.should.equal('TypeError');
  });

  it('should decode a list', async () => {
    const list = await decodeList({encodedList: encodedList100k});
    list.length.should.equal(100000);
  });

  it('should create a credential', async () => {
    const id = 'https://example.com/status/1';
    const list = await createList({length: 100000});
    const credential = await createCredential({id, list});
    credential.should.be.an('object');
    credential.should.deep.equal({
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/vc-revocation-list/v1'
      ],
      id,
      type: ['VerifiableCredential', 'RevocationList2020Credential'],
      credentialSubject: {
        id: `${id}#list`,
        type: 'RevocationList2020',
        encodedList: encodedList100k
      }
    });
  });
});
