/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import RevocationList from './RevocationList.js';
import vc from 'vc-js';
export {default as Bitstring} from './Bitstring.js';

const CONTEXTS = {
  VC_V1: 'https://www.w3.org/2018/credentials/v1',
  RL_V1: 'https://w3id.org/vc-revocation-list-2020/v1'
};

export async function createList({length}) {
  return new RevocationList({length});
}

export async function decodeList({encodedList}) {
  return RevocationList.decode({encodedList});
}

export async function createCredential({id, list}) {
  const encodedList = await list.encode();
  return {
    '@context': [CONTEXTS.VC_V1, CONTEXTS.RL_V1],
    id,
    type: ['VerifiableCredential', 'RevocationList2020Credential'],
    credentialSubject: {
      id: `${id}#list`,
      type: 'RevocationList2020',
      encodedList
    }
  };
}

export async function checkStatus({
  credential, documentLoader, suite, verifyRevocationListCredential = true
}) {
  let result;
  try {
    result = await _checkStatus({
      credential, documentLoader, suite, verifyRevocationListCredential
    });
  } catch(error) {
    result = {
      verified: false,
      error,
    };
  }
  return result;
}

export function assertRevocationList2020Context({credential} = {}) {
  if(!(credential && typeof credential === 'object')) {
    throw new TypeError('"credential" must be an object.');
  }
  // check for expected contexts
  const {'@context': contexts} = credential;
  if(!Array.isArray(contexts)) {
    throw new TypeError('"@context" must be an array.');
  }
  if(contexts[0] !== CONTEXTS.VC_V1) {
    throw new Error(`The first "@context" value must be "${CONTEXTS.VC_V1}".`);
  }
  if(!contexts.includes(CONTEXTS.RL_V1)) {
    throw new TypeError(`"@context" must include "${CONTEXTS.RL_V1}".`);
  }
}

export function getCredentialStatus({credential} = {}) {
  if(!(credential && typeof credential === 'object')) {
    throw new TypeError('"credential" must be an object.');
  }
  assertRevocationList2020Context({credential});
  // get and validate status
  if(!(credential.credentialStatus &&
    typeof credential.credentialStatus === 'object')) {
    throw new Error('"credentialStatus" is missing or invalid.');
  }
  const {credentialStatus} = credential;
  if(credentialStatus.type !== 'RevocationList2020Status') {
    throw new Error(
      '"credentialStatus" type is not "RevocationList2020Status".');
  }
  if(typeof credentialStatus.revocationListCredential !== 'string') {
    throw new TypeError(
      '"credentialStatus" revocationListCredential must be a string.');
  }

  return credentialStatus;
}

async function _checkStatus({
  credential, documentLoader, suite, verifyRevocationListCredential
}) {
  if(!(credential && typeof credential === 'object')) {
    throw new TypeError('"credential" must be an object.');
  }
  if(typeof documentLoader !== 'function') {
    throw new TypeError('"documentLoader" must be a function.');
  }
  if(verifyRevocationListCredential && !(suite && (
    isArrayOfObjects(suite) ||
    (!Array.isArray(suite) && typeof suite === 'object')))) {
    throw new TypeError('"suite" must be an object or an array of objects.');
  }

  const credentialStatus = getCredentialStatus({credential});

  // get RL position
  // TODO: bikeshed name
  const {revocationListIndex} = credentialStatus;
  const index = parseInt(revocationListIndex, 10);
  if(isNaN(index)) {
    throw new TypeError('"revocationListIndex" must be an integer.');
  }

  // retrieve RL VC
  let rlCredential;
  try {
    ({document: rlCredential} = await documentLoader(
      credentialStatus.revocationListCredential));
  } catch(e) {
    const err = new Error(
      'Could not load "RevocationList2020Credential"; ' +
      `reason: ${e.message}`);
    err.cause = e;
    throw err;
  }

  // verify RL VC
  if(verifyRevocationListCredential) {
    const verifyResult = await vc.verifyCredential({
      credential: rlCredential,
      suite,
      documentLoader
    });
    if(!verifyResult.verified) {
      const {error: e} = verifyResult;
      let msg = '"RevocationList2020Credential" not verified';
      if(e) {
        msg += `; reason: ${e.message}`;
      } else {
        msg += '.';
      }
      const err = new Error(msg);
      if(e) {
        err.cause = verifyResult.error;
      }
      throw err;
    }
  }

  if(!rlCredential.type.includes('RevocationList2020Credential')) {
    throw new Error('"RevocationList2020Credential" type is not valid.');
  }

  // get JSON RevocationList
  const {credentialSubject: rl} = rlCredential;
  if(rl.type !== 'RevocationList2020') {
    throw new Error('"RevocationList2020" type is not valid.');
  }

  // decode list from RL VC
  const {encodedList} = rl;
  let list;
  try {
    list = await decodeList({encodedList});
  } catch(e) {
    const err = new Error(
      `Could not decode encoded revocation list; reason: ${e.message}`);
    err.cause = e;
    throw err;
  }

  // check VC's RL index for revocation status
  const verified = !list.isRevoked(index);

  // TODO: return anything else? returning `rlCredential` may be too unwieldy
  // given its potentially large size
  return {verified};
}

function isArrayOfObjects(x) {
  return Array.isArray(x) && x.length > 0 &&
    x.every(x => x && typeof x === 'object');
}
