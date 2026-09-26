#!/usr/bin/env node
/** Historical C09 evidence on exact stopped bytes, never a corrected AFTER. */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const stop = '1ffb8d5d264b5857936895194ee042816feafcbe', tree = '5bf556b48a364a650762ad32d18c08731668f243';
const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { maxBuffer: 128 * 1024 * 1024 });
assert.equal(git('rev-parse', `${stop}^{tree}`).toString().trim(), tree);
const refs = git('show-ref'), registrations = git('worktree', 'list', '--porcelain');
const projection = mkdtempSync(join(tmpdir(), 'f03-c09-retained-projection-'));
const tops = git('ls-tree', '--name-only', stop).toString().trim().split('\n').filter((p) => p !== 'calibration');
execFileSync('tar', ['-x', '-C', projection], { input: git('archive', stop, '--', ...tops) });
const inventory = git('ls-tree', '-rz', stop).toString().split('\0').filter(Boolean)
  .map((line) => line.split('\t')).filter(([, path]) => !path.startsWith('calibration/'));
for (const [meta, path] of inventory) {
  const bytes = readFileSync(join(projection, path));
  assert.equal(createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'), meta.split(' ')[2], path);
}
const script = 'adapters/loa/tests/test-f03-c09-s4-entry-discriminator.ts';
assert(readFileSync(join(root, script)).equals(readFileSync(join(projection, script))));
const runtime = process.argv.includes('--runtime'), arg = process.argv.indexOf('--installed-run');
const installed = arg < 0 ? [] : ['--installed-run', resolve(process.argv[arg + 1])];
// The unchanged discriminator's Git operations are read-only historical blob
// reads. This projection creates no Git ref, index, worktree or synthetic history.
const result = spawnSync(process.execPath, [join(projection, script), ...runtime ? ['--runtime'] : [], ...installed], {
  cwd: projection, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, GIT_DIR: git('rev-parse', '--absolute-git-dir').toString().trim(), GIT_WORK_TREE: projection },
});
writeFileSync(join(projection, 'historical-discriminator.log'), result.stdout + result.stderr);
assert.equal(result.status, 0, result.stdout + result.stderr);
assert(git('show-ref').equals(refs)); assert(git('worktree', 'list', '--porcelain').equals(registrations));
const discriminator = JSON.parse(result.stdout.trim().split('\n').at(-1)!);
console.log(JSON.stringify({ result: 'PASS', stop, tree, runtime, projection, projected_files: inventory.length, discriminator,
  scope: 'Exact stopped C09 discriminator and historical DUP_FORMAT refusal; no positive bootstrap or producer-completion claim.' }));
