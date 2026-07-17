#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(SCRIPT_PATH), '..');
const PACKAGE_BYTES = Buffer.from('{\n  "type": "module"\n}\n', 'utf8');

export interface RuntimeProjectionReport {
  result: 'PASS' | 'FAIL';
  files: number;
  errors: string[];
}

function utf8Compare(left: string, right: string): number {
  return Buffer.compare(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}

function runtimeFiles(root: string): string[] {
  const files: string[] = [];
  function visit(directory: string, prefix: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = join(directory, entry.name);
      const stat = lstatSync(absolute);
      if (stat.isSymbolicLink()) throw new Error(`runtime projection contains symlink: ${path}`);
      if (stat.isDirectory()) visit(absolute, path);
      else if (stat.isFile()) files.push(path);
      else throw new Error(`runtime projection contains non-file entry: ${path}`);
    }
  }
  if (!existsSync(root) || !lstatSync(root).isDirectory()) {
    throw new Error(`runtime projection directory is missing: ${root}`);
  }
  visit(root, '');
  return files.sort(utf8Compare);
}

export function generateRuntimeProjection(root: string, output: string): void {
  const repository = resolve(root);
  const destination = resolve(output);
  if (existsSync(destination)) throw new Error(`runtime output already exists: ${destination}`);
  execFileSync(process.execPath, [
    join(repository, 'node_modules', 'typescript', 'bin', 'tsc'),
    '-p',
    join(repository, 'tsconfig.runtime.json'),
    '--outDir',
    destination,
  ], {
    cwd: repository,
    stdio: 'pipe',
    maxBuffer: 64 * 1024 * 1024,
  });
  writeFileSync(join(destination, 'package.json'), PACKAGE_BYTES, { flag: 'wx' });
}

export function compareRuntimeProjections(
  expectedRoot: string,
  actualRoot: string,
): RuntimeProjectionReport {
  try {
    const expected = runtimeFiles(resolve(expectedRoot));
    const actual = runtimeFiles(resolve(actualRoot));
    const errors: string[] = [];
    const expectedSet = new Set(expected);
    const actualSet = new Set(actual);
    for (const path of expected) {
      if (!actualSet.has(path)) errors.push(`generated projection is missing ${path}`);
      else if (!readFileSync(join(expectedRoot, path)).equals(readFileSync(join(actualRoot, path)))) {
        errors.push(`generated projection differs at ${path}`);
      }
    }
    for (const path of actual) {
      if (!expectedSet.has(path)) errors.push(`generated projection has extra ${path}`);
    }
    return {
      result: errors.length === 0 ? 'PASS' : 'FAIL',
      files: expected.length,
      errors,
    };
  } catch (error) {
    return {
      result: 'FAIL',
      files: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

export function checkRuntimeProjection(root = REPO_ROOT): RuntimeProjectionReport {
  const tempRoot = mkdtempSync(join(tmpdir(), 'aleph-runtime-js-check-'));
  const generated = join(tempRoot, 'runtime-js');
  try {
    generateRuntimeProjection(root, generated);
    return compareRuntimeProjections(join(root, 'runtime-js'), generated);
  } catch (error) {
    return {
      result: 'FAIL',
      files: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

export function buildRuntimeProjection(root = REPO_ROOT): RuntimeProjectionReport {
  const repository = resolve(root);
  const destination = join(repository, 'runtime-js');
  const stageParent = mkdtempSync(join(repository, '.runtime-js-stage-'));
  const stage = join(stageParent, 'runtime-js');
  const backup = join(repository, `.runtime-js-backup-${process.pid}`);
  let movedPrior = false;
  try {
    generateRuntimeProjection(repository, stage);
    if (existsSync(backup)) throw new Error(`runtime backup already exists: ${backup}`);
    if (existsSync(destination)) {
      renameSync(destination, backup);
      movedPrior = true;
    }
    renameSync(stage, destination);
    const report = compareRuntimeProjections(destination, destination);
    if (report.result !== 'PASS') throw new Error(report.errors.join('; '));
    if (movedPrior) rmSync(backup, { recursive: true, force: true });
    return report;
  } catch (error) {
    if (!existsSync(destination) && movedPrior && existsSync(backup)) {
      renameSync(backup, destination);
    }
    return {
      result: 'FAIL',
      files: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  } finally {
    rmSync(stageParent, { recursive: true, force: true });
  }
}

function main(): void {
  const [command = 'check', ...rest] = process.argv.slice(2);
  const json = rest.includes('--json');
  const unknown = rest.filter((arg) => arg !== '--json');
  if (!['build', 'check'].includes(command) || unknown.length > 0) {
    console.error('Usage: node packaging/build-runtime-js.ts <build|check> [--json]');
    process.exitCode = 2;
    return;
  }
  const report = command === 'build'
    ? buildRuntimeProjection()
    : checkRuntimeProjection();
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    for (const error of report.errors) console.error(`FAIL ${error}`);
    console.log(`RUNTIME-JS ${report.result} (${report.files} files)`);
  }
  process.exitCode = report.result === 'PASS' ? 0 : 1;
}

if (resolve(process.argv[1] || '') === SCRIPT_PATH) main();
