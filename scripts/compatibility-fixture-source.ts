import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
const expect: (condition: unknown, message: string) => asserts condition = assert;

/** Exercise predecessor format mechanics using a separate immutable 1.5 bundle. */
export function predecessorSource(repository: string, root: string): string {
  const target = join(root, 'source-1.5'); mkdirSync(target);
  const inventory = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: repository, encoding: 'utf8' });
  expect(inventory.status === 0, 'cannot inventory compatibility source');
  for (const path of new Set(inventory.stdout.split('\0').filter(Boolean))) {
    mkdirSync(dirname(join(target, path)), { recursive: true });
    copyFileSync(join(repository, path), join(target, path));
  }
  for (const path of ['core.manifest.json', 'adapters/loa/adapter.manifest.json', 'adapters/hermes/adapter.manifest.json', 'adapter-protocol/adapter.schema.json']) {
    writeFileSync(join(target, path), readFileSync(join(target, path), 'utf8').replaceAll('1.6.0-provisional', '1.5.0-provisional'));
  }
  const prompts = join(target, 'docs/architecture/prompts/workers-intake-extraction.md');
  const strip = (value: unknown): unknown => Array.isArray(value) ? value.map(strip)
    : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([k]) => !['material_use', 'material_findings'].includes(k)).map(([k,v]) => [k,strip(v)])) : value;
  writeFileSync(prompts, readFileSync(prompts, 'utf8').replace(/```json\n([\s\S]*?)\n```/gu, (_all, json: string) => '```json\n' + JSON.stringify(strip(JSON.parse(json)), null, 2) + '\n```'));
  for (const args of [['init', '-q'], ['add', '--all'], ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Synthetic predecessor compatibility source']]) {
    const result = spawnSync('git', args, { cwd: target, encoding: 'utf8' });
    expect(result.status === 0, `compatibility repository preparation failed: ${result.stderr}`);
  }
  return target;
}
