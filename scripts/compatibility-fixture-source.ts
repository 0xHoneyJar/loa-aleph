import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { hasRunCapability } from './lib/run-model.ts';
const expect: (condition: unknown, message: string) => asserts condition = assert;

/** Calibration administration, including closed references, is never input
 * to a synthetic source checkout. Keep tooling administration such as ignore
 * rules and generated-file attributes, without opening calibration bytes. */
export function fixtureSourcePaths(paths: string[]): string[] {
  return paths.filter((path) => !path.startsWith('calibration/'));
}
export function stripFixtureCalibrationInventory(root: string): void {
  const path = join(root, 'core.manifest.json'), manifest = JSON.parse(readFileSync(path, 'utf8'));
  manifest.files.repository_administration = fixtureSourcePaths(manifest.files.repository_administration);
  writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n');
}

/** Exercise predecessor mechanics using a separate synthetic compatibility bundle. */
export function predecessorSource(repository: string, root: string, version = '1.5.0-provisional'): string {
  const target = join(root, `source-${version}`); mkdirSync(target);
  const inventory = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: repository, encoding: 'utf8' });
  expect(inventory.status === 0, 'cannot inventory compatibility source');
  for (const path of new Set(fixtureSourcePaths(inventory.stdout.split('\0').filter(Boolean)))) {
    mkdirSync(dirname(join(target, path)), { recursive: true });
    copyFileSync(join(repository, path), join(target, path));
  }
  stripFixtureCalibrationInventory(target);
  for (const path of ['core.manifest.json', 'adapters/loa/adapter.manifest.json', 'adapters/hermes/adapter.manifest.json', 'adapter-protocol/adapter.schema.json']) {
    const value = JSON.parse(readFileSync(join(target, path), 'utf8'));
    if (path === 'core.manifest.json') value.core.run_format_version = version;
    else if (path === 'adapter-protocol/adapter.schema.json') value.properties.adapter.properties.run_format_version.const = version;
    else value.adapter.run_format_version = version;
    writeFileSync(join(target, path), JSON.stringify(value, null, 2) + '\n');
  }
  const prompts = join(target, 'docs/architecture/prompts/workers-intake-extraction.md');
  const strip = (value: unknown): unknown => Array.isArray(value) ? value.map(strip)
    : value && typeof value === 'object' && 'contract_format' in value && 'shape' in value ? strip(value.shape)
    : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([k]) => !(version === '1.5.0-provisional'
      ? ['material_use', 'material_findings', 'semantic_units'] : ['semantic_units']).includes(k)).map(([k,v]) => [k,strip(v)])) : value;
  if (!hasRunCapability(version, 'semantic-unit-review')) writeFileSync(prompts, readFileSync(prompts, 'utf8').replace(/```json\n([\s\S]*?)\n```/gu, (_all, json: string) => '```json\n' + JSON.stringify(strip(JSON.parse(json)), null, 2) + '\n```'));
  for (const args of [['init', '-q'], ['add', '--all'], ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Synthetic predecessor compatibility source']]) {
    const result = spawnSync('git', args, { cwd: target, encoding: 'utf8' });
    expect(result.status === 0, `compatibility repository preparation failed: ${result.stderr}`);
  }
  return target;
}
