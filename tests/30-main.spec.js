/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {createList, decodeList, createCredential, checkStatus} from '..';
import {extendContextLoader} from 'jsonld-signatures';
import vc from 'vc-js';

const {defaultDocumentLoader} = vc;

const VC_RL_CONTEXT = 'https://w3id.org/vc-revocation-list-2020/v1';

const encodedList100k =
  'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA';
const encodedList100KWith50KthRevoked =
  'H4sIAAAAAAAAA-3OMQ0AAAgDsOHfNB72EJJWQRMAAAAAAIDWXAcAAAAAAIDHFrc4zDz' +
  'UMAAA';

const documents = new Map();
documents.set(VC_RL_CONTEXT, {
  '@context': {
    '@protected': true,
    RevocationList2020: {
      '@id': 'https://w3id.org/vc-revocation-list-2020#RevocationList2020',
      '@type': '@id',
      '@context': {
        '@protected': true,
        encodedList: 'https://w3id.org/vc-revocation-list-2020#encodedList'
      }
    },
    RevocationList2020Status: {
      '@id':
      'https://w3id.org/vc-revocation-list-2020#RevocationList2020Status',
      '@type': '@id',
      '@context': {
        '@protected': true,
        revocationListIndex: {
          '@id': 'https://w3id.org/vc-revocation-list-2020#revocationListIndex',
          '@type': 'http://www.w3.org/2001/XMLSchema#integer'
        },
        revocationListCredential: {
          '@id': 'https://w3id.org/vc-revocation-list-2020#revocationListIndex',
          '@type': '@id'
        }
      }
    },
    RevocationList2020Credential: {
      '@id':
      'https://w3id.org/vc-revocation-list-2020#RevocationList2020Credential',
      '@type': '@id'
    }
  }
});

const RLC = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    VC_RL_CONTEXT
  ],
  id: 'https://example.com/status/1',
  type: ['VerifiableCredential', 'RevocationList2020Credential'],
  credentialSubject: {
    id: `https://example.com/status/1#list`,
    type: 'RevocationList2020',
    encodedList: encodedList100KWith50KthRevoked
  }
};
documents.set(RLC.id, RLC);

const documentLoader = extendContextLoader(async url => {
  const doc = documents.get(url);
  if(doc) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: doc
    };
  }
  return defaultDocumentLoader(url);
});

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

  it('should create a RevocationList2020Credential credential', async () => {
    const id = 'https://example.com/status/1';
    const list = await createList({length: 100000});
    const credential = await createCredential({id, list});
    credential.should.be.an('object');
    credential.should.deep.equal({
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        VC_RL_CONTEXT
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

  it('should verify the status of a credential', async () => {
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        VC_RL_CONTEXT
      ],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo'
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListIndex: '67342',
        revocationListCredential: RLC.id
      }
    };
    const result = await checkStatus({
      credential, documentLoader, verifyRevocationListCredential: false});
    result.verified.should.equal(true);
  });

  it('should fail to verify status with incorrect status type', async () => {
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        VC_RL_CONTEXT
      ],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo'
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'ex:NonmatchingStatusType',
        revocationListIndex: '67342',
        revocationListCredential: RLC.id
      }
    };
    const result = await checkStatus({
      credential, documentLoader, verifyRevocationListCredential: false});
    result.verified.should.equal(false);
  });

  it('should fail to verify status with missing index', async () => {
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        VC_RL_CONTEXT
      ],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo'
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListCredential: RLC.id
      }
    };
    const result = await checkStatus({
      credential, documentLoader, verifyRevocationListCredential: false});
    result.verified.should.equal(false);
  });

  it('should fail to verify status with missing list credential', async () => {
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        VC_RL_CONTEXT
      ],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo'
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListIndex: '67342'
      }
    };
    const result = await checkStatus({
      credential, documentLoader, verifyRevocationListCredential: false});
    result.verified.should.equal(false);
  });

  it('should fail to verify status for revoked credential', async () => {
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        VC_RL_CONTEXT
      ],
      id: 'urn:uuid:e74fb1d6-7926-11ea-8e11-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:011e064e-7927-11ea-8975-10bf48838a41',
        'example:test': 'bar'
      },
      credentialStatus: {
        id: 'https://example.com/status/1#50000',
        type: 'RevocationList2020Status',
        revocationListIndex: '50000',
        revocationListCredential: RLC.id
      }
    };
    const result = await checkStatus({
      credential, documentLoader, verifyRevocationListCredential: false});
    result.verified.should.equal(false);
  });
});
