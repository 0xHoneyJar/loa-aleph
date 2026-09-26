#!/usr/bin/env node
/** Run unchanged C08 conflict evidence against exact pre-clarification files.
 * The disposable fixture repository has its own synthetic provenance only.
 * No retained repository ref, registration or history is reconstructed. */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const stop = '5bfbe50209d240f8fe07af587484e842c034e691';
const tree = 'a2e44dbcbbc5cb311da638ff9fc2263504388659';
const runtime = process.argv.includes('--runtime');
const argument = process.argv.indexOf('--installed-run');
const installed = argument < 0 ? [] : ['--installed-run', resolve(process.argv[argument + 1])];
const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { maxBuffer: 128 * 1024 * 1024 });
assert.equal(git('rev-parse', `${stop}^{tree}`).toString().trim(), tree);
const beforeHead = git('rev-parse', 'HEAD'), beforeRefs = git('show-ref'), beforeWorktrees = git('worktree', 'list', '--porcelain');
const projection = mkdtempSync(join(tmpdir(), 'f03-c08-retained-projection-'));
// Administration history and stopped run archives are not fixture payload.
const tops = git('ls-tree', '--name-only', stop).toString().trim().split('\n').filter((p) => p !== 'calibration');
const archive = git('archive', stop, '--', ...tops);
execFileSync('tar', ['-x', '-C', projection], { input: archive });
const inventory = git('ls-tree', '-rz', stop).toString().split('\0').filter(Boolean).flatMap((line) => {
  const [meta, path] = line.split('\t'), [mode, kind, blob] = meta.split(' ');
  return kind === 'blob' && !path.startsWith('calibration/') ? [{ mode, path, blob }] : [];
});
for (const entry of inventory) {
  const bytes = readFileSync(join(projection, entry.path));
  const blob = createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
  assert.equal(blob, entry.blob, entry.path);
}
for (const args of [['init', '-q'], ['add', '--all'],
  ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Synthetic exact C08 pre-clarification file projection']]) {
  execFileSync('git', args, { cwd: projection });
}
const script = 'adapters/loa/tests/test-f03-c08-source-reference-discriminator.ts';
const original = readFileSync(join(root, script));
assert(original.equals(readFileSync(join(projection, script))));
const result = spawnSync(process.execPath, [join(projection, script), ...runtime ? ['--runtime'] : [], ...installed],
  { cwd: projection, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
writeFileSync(join(projection, 'historical-discriminator.log'), result.stdout + result.stderr);
assert.equal(result.status, 0, result.stderr);
assert(readFileSync(join(root, script)).equals(original));
assert(git('rev-parse', 'HEAD').equals(beforeHead)); assert(git('show-ref').equals(beforeRefs));
assert(git('worktree', 'list', '--porcelain').equals(beforeWorktrees));
execFileSync('git', ['diff', '--exit-code', 'HEAD'], { cwd: projection });
const output = JSON.parse(result.stdout.trim().split('\n').at(-1)!);
const evidence = { result: 'PASS', runtime, stop, tree, projected_files: inventory.length, projection,
  historical_assertions: output.cases, adversarial_mutations: 0, discriminator: output,
  scope: 'Unchanged historical discriminator on exact pre-clarification source/runtime file projection. No C08 implementation success or installed C2 progression is inferred.' };
writeFileSync(join(projection, 'retained-projection-evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence));
