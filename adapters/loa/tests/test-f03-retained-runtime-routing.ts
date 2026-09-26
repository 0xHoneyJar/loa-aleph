#!/usr/bin/env node
/** Fresh fixtures built from exact historical executable bytes. No old run is migrated. */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripFixtureCalibrationInventory } from '../../../scripts/compatibility-fixture-source.ts';
import { assembleBundles } from '../../../scripts/assemble-bundles.ts';
import { installLoaBundle } from '../src/installer.ts';
import { sha256Digest, walkRegularFiles } from '../src/fs.ts';
import { parseLoaProfile } from '../src/runtime-snapshot.ts';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const versions = [
  ['1.0.0-provisional', '41979fd7c4e044aead9631a864c33b7d2736b958'],
  ['1.1.0-provisional', 'cecef33991f306c13ccdce0c93cb6ac47b7ffccd'],
  ['1.2.0-provisional', '03387aff079b02a685dda846ed115cea5d794ea7'],
  ['1.3.0-provisional', 'be064f53eb347269512a7f3462fc4171ed3aae5d'],
  ['1.4.0-provisional', '066924d3c6f0d5dd0212ca2439cae4f57cc13730'],
  ['1.5.0-provisional', '1a8fcdecb4e554e116828166dc5e806851d9e499'],
  ['1.6.0-provisional', 'ddc2a3e7caaf9298780ef2795c534a4332357cf8'],
  ['1.7.0-provisional', 'c913fb2667539e34baa616ada2e50415f0c36291'],
  ['1.8.0-provisional', '1ffb8d5d264b5857936895194ee042816feafcbe'],
] as const;
const selected = versions.find(([version]) => version === process.argv[2]);
assert(selected, 'supply one exact retained run-format version');
const [version, commit] = selected;
for (const modern of ['1.5.0-provisional', '1.9.0-provisional']) {
  const profile = JSON.parse(readFileSync(join(repo, 'adapters/loa/profiles/loa-default.json'), 'utf8'));
  delete profile.role_mappings['ambiguity-reviewer'];
  assert.throws(() => parseLoaProfile(profile, modern), /Loa profile does not map every Core role exactly once/u);
}
const root = mkdtempSync(join(tmpdir(), 'f03-retained-routing-')), source = join(root, 'historical-source');
mkdirSync(source);
const git = (...args: string[]) => execFileSync('git', ['-C', repo, ...args], { maxBuffer: 128 * 1024 * 1024 });
const tops = git('ls-tree', '--name-only', commit).toString().trim().split('\n').filter((p) => p !== 'calibration');
execFileSync('tar', ['-x', '-C', source], { input: git('archive', commit, '--', ...tops) });
assert(!existsSync(join(source, 'calibration')));
const inventory = git('ls-tree', '-rz', commit).toString().split('\0').filter(Boolean)
  .map((line) => line.split('\t')).filter(([, path]) => !path.startsWith('calibration/'));
for (const [meta, path] of inventory) {
  const bytes = readFileSync(join(source, path));
  assert.equal(createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'), meta.split(' ')[2], path);
}
// Only omitted administration references change in this construction copy.
// All historical executable, Core, profile and schema bytes remain exact.
stripFixtureCalibrationInventory(source);
for (const args of [['init', '-q'], ['add', '--all'],
  ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Exact historical payload fixture']]) {
  execFileSync('git', args, { cwd: source });
}
const oldAssembler = await import(pathToFileURL(join(source, 'scripts/assemble-bundles.ts')).href) as typeof import('../../../scripts/assemble-bundles.ts');
const oldAssembly = oldAssembler.assembleBundles(source, join(root, 'old-bundles'));
assert.equal(oldAssembly.result, 'PASS', oldAssembly.errors.join('; '));
const oldBundle = join(root, 'old-bundles/aleph-for-loa'), host = join(root, 'host');
const oldInstaller = await import(pathToFileURL(join(source, 'adapters/loa/src/installer.ts')).href) as typeof import('../src/installer.ts');
const installation = oldInstaller.installLoaBundle(oldBundle, host);
assert.equal(installation.result, 'PASS', installation.errors.join('; '));
const capability = join(host, 'grimoires/loa/aleph/host-capabilities.json');
mkdirSync(dirname(capability), { recursive: true });
cpSync(join(source, 'adapters/loa/tests/fixtures/host-capabilities.json'), capability);
const input = join(host, 'input.md'); writeFileSync(input, 'Synthetic retained-runtime routing input.\n');
const launcher = join(host, '.claude/aleph/bin/loa-aleph.mjs');
let call = 0;
let lastExit: number | null = null;
function cli(args: string[], exit: number | null = 0): any {
  const result = spawnSync(process.execPath, [launcher, '--root', host, '--json', '--allow-fixture-simulation', ...args],
    { cwd: host, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  writeFileSync(join(root, `command-${++call}.log`), result.stdout + result.stderr);
  lastExit = result.status;
  if (exit !== null) assert.equal(result.status, exit, result.stdout + result.stderr);
  return JSON.parse(result.stdout);
}
const started = cli(['start', input]);
assert.equal(started.result, 'BLOCKED');
const run = join(host, 'grimoires/loa/aleph/runs', started.run_id);
const snapshot = JSON.parse(readFileSync(join(run, 'control/corpus.snapshot.json'), 'utf8'));
const response = join(root, 'fixture-authority.json');
writeFileSync(response, JSON.stringify({ format: 'aleph-loa-authority-response/v1', gate_id: 'S0', run_id: started.run_id,
  authority: { kind: 'human', identity: 'fixture-simulated-authority' }, decision: 'approve-freeze',
  declared_scope: 'Synthetic retained-runtime routing only.', exclusions: [],
  sensitivity_rulings: snapshot.files.map((f: { source_id: string }) =>
    ({ source_id: f.source_id, labels: ['none'], decision: 'admit-exact-bytes' })),
  freeze: true, recorded_at: new Date().toISOString(), simulation: { kind: 'fixture-simulated' } }));
assert.equal(cli(['--authority-response', response, started.run_id]).result, 'PASS');
const beforeResume = cli(['resume', started.run_id]);
assert.equal(beforeResume.result, 'PASS');
const stateBefore = JSON.parse(readFileSync(join(run, 'control/run-state.json'), 'utf8'));
assert.equal(stateBefore.identity.run_format_version, version);
assert.equal(stateBefore.full_mode, 'fixture-simulated');
function protectedFiles() {
  return walkRegularFiles(run).filter((path) => {
    const rel = relative(run, path);
    return !rel.startsWith('control/') || /^control\/(?:runtime\/|corpus\.snapshot\.json|bundle\.lock\.json)/u.test(rel);
  }).map((path) => ({ path: relative(run, path), digest: sha256Digest(readFileSync(path)), mode: statSync(path).mode & 0o777 }));
}
const exact = protectedFiles();
function markerBehavior(label: string) {
  const manifest = join(run, 'run-manifest.md'), original = readFileSync(manifest), mode = statSync(manifest).mode & 0o777;
  const marker = original.toString().replace(`run_format_version: ${version}`, 'run_format_version: 1.9.0-provisional');
  assert.notEqual(marker, original.toString());
  try {
    chmodSync(manifest, 0o600); writeFileSync(manifest, marker);
    const observed = cli(['resume', started.run_id], null), exit = lastExit;
    assert(exit === 0 || exit === 1);
    assert(!existsSync(join(run, 'control/orchestration')));
    assert.deepEqual(JSON.parse(readFileSync(join(run, 'control/run-state.json'), 'utf8')).identity, stateBefore.identity);
    cpSync(run, join(root, label), { recursive: true });
    return { exit, result: observed.result, stage: observed.stage, state: observed.state };
  } finally { writeFileSync(manifest, original); chmodSync(manifest, mode); }
}
// Some early pinned readers predate manifest/state cross-checking. Preserve
// that behavior too: a marker still cannot select the cumulative controller.
const oldMarkerBehavior = markerBehavior('marker-before-installation-update');
assert.deepEqual(protectedFiles(), exact);
const newBundle = process.argv[3] ? resolve(process.argv[3]) : join(root, 'new-bundles/aleph-for-loa');
if (!process.argv[3]) {
  const currentAssembly = assembleBundles(repo, join(root, 'new-bundles'));
  assert.equal(currentAssembly.result, 'PASS', currentAssembly.errors.join('; '));
}
const newLock = JSON.parse(readFileSync(join(newBundle, 'bundle.lock.json'), 'utf8'));
const update = installLoaBundle(newBundle, host);
assert.equal(update.result, 'PASS', update.errors.join('; '));
assert.deepEqual(protectedFiles(), exact, 'installation update changed retained run files');
const afterResume = cli(['resume', started.run_id]);
assert.equal(afterResume.result, beforeResume.result);
assert.equal(afterResume.stage, beforeResume.stage);
assert.equal(afterResume.state, beforeResume.state);
const status = cli(['status', started.run_id]); assert.equal(status.result, 'PASS');
const stateAfter = JSON.parse(readFileSync(join(run, 'control/run-state.json'), 'utf8'));
assert.deepEqual(stateAfter.identity, stateBefore.identity);
assert.deepEqual(stateAfter.ledger, stateBefore.ledger);
assert.deepEqual(protectedFiles(), exact, 'retained resume changed canonical or pinned bytes');
assert(!existsSync(join(run, 'control/orchestration')), 'old run acquired the new controller');
assert.deepEqual(markerBehavior('marker-after-installation-update'), oldMarkerBehavior);
assert.deepEqual(protectedFiles(), exact);
const result = { result: 'PASS', version, commit, root, run, historical_exact_files: inventory.length,
  new_bundle: { root: newBundle, digest: newLock.bundle.digest },
  execution_class: 'fresh fixture-simulated old-source run, installed update, separate launcher processes',
  retained_identity_exact: true, canonical_and_runtime_bytes_exact: true, new_controller_absent: true,
  marker_cannot_activate_new_controller: true, retained_marker_behavior: oldMarkerBehavior,
  scope: 'Retained frozen-boundary execution routing; broader predecessor contracts are qualified separately.' };
writeFileSync(join(root, 'result.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
