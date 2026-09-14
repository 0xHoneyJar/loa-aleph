import { readFileSync } from 'node:fs';
import { canonicalBytes, parseRecord, recordNames } from './records.ts';
import { verifyProtocolLock } from './protocol.ts';

// This boundary has no export, install, attestation, provider, replay or comparison execution operation.
const [operation, name, path, ...extra] = process.argv.slice(2);
try {
  if (operation === 'schemas' && !name) process.stdout.write(canonicalBytes({ schemas: recordNames }));
  else if(operation === 'verify-protocol' && !name) {
    verifyProtocolLock();
    process.stdout.write(canonicalBytes({result:'PASS',token:'PROTOCOL_LOCK_PASS',proposition:'Exact protocol and imported contract bytes match their lock.'}));
  }
  else if (operation === 'validate-record' && name && path && extra.length === 0) {
    parseRecord(name, readFileSync(path));
    process.stdout.write(canonicalBytes({ result: 'PASS', token: 'CLOSED_RECORD_SCHEMA_PASS', schema: name,
      proposition: 'Canonical encoding and closed record schema only; no execution or semantic warrant.' }));
  } else throw new Error('Only schemas, verify-protocol and validate-record <schema-name> <file> are supported.');
} catch (error) {
  process.stdout.write(canonicalBytes({ result: 'FAIL', token: 'RECORD_REFUSED', reason: String(error) }));
  process.exitCode = 1;
}
