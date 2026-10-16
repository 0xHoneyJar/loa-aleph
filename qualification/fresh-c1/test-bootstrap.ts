import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { capture, digest, publish, type Json } from './common.ts';
import { fixtureEnvironment, supervise, verifyChild, type ChildReceipt } from './supervisor.ts';

// Real compiled CLI and real fixture module. No loader redirects or substitute
// fixture implementation. Only negative controls mutate private package copies.
const compiled = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const scratch = mkdtempSync(join(tmpdir(), 'fresh-c1-bootstrap-test-'));
const driver = 'qualification/fresh-c1/driver.js';
const fixture = 'adapters/loa/tests/test-orchestration-process.js';
const support = 'qualification/fresh-c1/fixture-support.js';
const results: Json[] = [];
const original = capture(compiled);

function mutation(name: string, edit: (root: string) => void): string {
  const root = join(scratch, name, 'tooling');
  cpSync(compiled, root, { recursive: true });
  if (!existsSync(join(root, 'package.json'))) writeFileSync(join(root, 'package.json'), '{"type":"module"}\n');
  edit(root);
  publish(join(scratch, name, 'mutation.json'), { original, mutated: capture(root) });
  return root;
}
function replace(root: string, relative: string, before: string, after: string): void {
  const path = join(root, relative), text = readFileSync(path, 'utf8');
  assert.equal(text.split(before).length, 2, `ONE_MUTATION_SITE ${relative}`);
  writeFileSync(path, text.replace(before, after));
}
function ready(receipt: ChildReceipt, root: string, cwd: string): void {
  assert.equal(receipt.verdict, 'PASS', readFileSync(receipt.stderr, 'utf8'));
  assert.equal(receipt.status, 0); assert.equal(receipt.signal, null);
  assert.equal(readFileSync(receipt.stderr, 'utf8'), '');
  assert.deepEqual(JSON.parse(readFileSync(receipt.stdout, 'utf8')), {
    result: 'BOOTSTRAP_READY', boundary: 'before-fixture-scratch',
    fixture: pathToFileURL(join(root, fixture)).href, node: process.version, qualification: 'NOT_RUN',
  });
  assert.deepEqual(readdirSync(cwd), [], 'BOOTSTRAP_SIDE_EFFECT');
}
async function run(name: string, root: string, options: {
  prefix?: string[]; suffix?: string[]; env?: Record<string, string>; seconds?: number;
} = {}): Promise<{ receipt: ChildReceipt; cwd: string }> {
  const directory = join(scratch, name), cwd = join(directory, 'empty-workspace');
  mkdirSync(cwd, { recursive: true });
  const before = capture(root), seconds = options.seconds ?? 10;
  const receipt = await supervise({
    nonce: 'bootstrap-offline-only', ordinal: results.length + 1,
    command: process.execPath,
    args: [...options.prefix ?? [], join(root, driver), 'bootstrap-check', ...options.suffix ?? []],
    cwd, env: { ...fixtureEnvironment(), HOME: cwd, TMPDIR: cwd, ...options.env },
    expected: 0, deadline: Date.now() + seconds * 1000, max_seconds: seconds,
  }, join(directory, 'child'));
  verifyChild(join(directory, 'child'), receipt.nonce, 0);
  assert.deepEqual(capture(root), before, 'BOOTSTRAP_CHANGED_TOOLING');
  results.push({ name, receipt, workspace_entries: readdirSync(cwd) });
  return { receipt, cwd };
}
function refused(receipt: ChildReceipt, cwd: string, pattern: RegExp): void {
  assert.equal(receipt.verdict, 'FAIL');
  assert.equal(receipt.status, 1); assert.equal(receipt.signal, null);
  assert.equal(readFileSync(receipt.stdout, 'utf8'), '');
  assert.match(readFileSync(receipt.stderr, 'utf8'), pattern);
  assert.deepEqual(readdirSync(cwd), [], 'BOOTSTRAP_SIDE_EFFECT');
}

const positive = await run('actual-cli', compiled);
ready(positive.receipt, compiled, positive.cwd);

// Restore the diagnosed published dependency edge and its driver exports.
// The same driver main/top-level await and actual fixture path remain in use.
const legacy = mutation('original-cycle', root => {
  replace(root, fixture, "from '../../../qualification/fresh-c1/fixture-support.js'",
    "from '../../../qualification/fresh-c1/driver.js'");
  writeFileSync(join(root, driver), readFileSync(join(root, driver), 'utf8')
    + "\nexport * from './fixture-support.js';\n");
  replace(root, driver, 'async function loadFixture() {',
    "async function loadFixture() { console.log('BEFORE_FIXTURE_IMPORT');");
});
// The original guard kept the event loop referenced. A harmless timer preserves
// that liveness condition here; it grants no qualification/service authority.
const hold = join(scratch, 'original-cycle/keepalive.mjs');
writeFileSync(hold, "setInterval(() => {}, 1000);\n");
const stalled = await run('original-cycle', legacy, { prefix: ['--import', hold], seconds: 2 });
assert.equal(stalled.receipt.verdict, 'TIMEOUT');
assert.equal(stalled.receipt.status, null);
assert(['SIGTERM', 'SIGKILL'].includes(stalled.receipt.signal!));
assert.equal(readFileSync(stalled.receipt.stdout, 'utf8'), 'BEFORE_FIXTURE_IMPORT\n');
assert.equal(readFileSync(stalled.receipt.stderr, 'utf8'), '');
assert.deepEqual(readdirSync(stalled.cwd), []);

const missing = mutation('missing-import', root => rmSync(join(root, fixture)));
const missingResult = await run('missing-import', missing);
refused(missingResult.receipt, missingResult.cwd, /ERR_MODULE_NOT_FOUND/);

const wrongError = mutation('unexpected-error', root => replace(root, support,
  'throw new FixtureBootstrapBoundary();', "throw new Error('UNEXPECTED_BOOTSTRAP_ERROR');"));
const wrongResult = await run('unexpected-error', wrongError);
refused(wrongResult.receipt, wrongResult.cwd, /UNEXPECTED_BOOTSTRAP_ERROR/);

const noBoundary = mutation('missing-boundary', root => replace(root, fixture,
  "if (process.argv[2] === '--fixture-worker') {",
  "if (process.argv[2] === 'bootstrap-check') { /* Negative control: no boundary receipt. */ }\n"
  + "else if (process.argv[2] === '--fixture-worker') {"));
const noBoundaryResult = await run('missing-boundary', noBoundary);
refused(noBoundaryResult.receipt, noBoundaryResult.cwd, /BOOTSTRAP_BOUNDARY_NOT_REACHED/);

const writes = mutation('unexpected-write', root => replace(root, support,
  'throw new FixtureBootstrapBoundary();',
  "writeFileSync(join(process.cwd(), 'unexpected-write'), 'negative-control'); throw new FixtureBootstrapBoundary();"));
const writesResult = await run('unexpected-write', writes);
assert.throws(() => ready(writesResult.receipt, writes, writesResult.cwd), /BOOTSTRAP_SIDE_EFFECT/);
assert.deepEqual(readdirSync(writesResult.cwd), ['unexpected-write']);
results.at(-1)!.bootstrap_admitted = false;

const environment = await run('inherited-profile-refused', compiled, { env: { F03_PACKET: '1' } });
refused(environment.receipt, environment.cwd, /BOOTSTRAP_ENVIRONMENT/);
const argumentsResult = await run('extra-argument-refused', compiled, { suffix: ['--execute-c1'] });
refused(argumentsResult.receipt, argumentsResult.cwd, /BOOTSTRAP_ARGUMENTS/);

assert.deepEqual(capture(compiled), original, 'ORIGINAL_COMPILED_PACKAGE_PRESERVED');
publish(join(scratch, 'result.json'), {
  result: 'PASS', controls: results.length, node: process.version,
  executable: process.execPath, executable_digest: digest(readFileSync(process.execPath)),
  original_tooling: original, results,
  scope: 'Actual CLI bootstrap only; no fixture installation, controller start/resume or C1 qualification.',
});
console.log(JSON.stringify({ result: 'PASS', controls: results.length, node: process.version,
  evidence: scratch, qualification: 'NOT_RUN' }));
