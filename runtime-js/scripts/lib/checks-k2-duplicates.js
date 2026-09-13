import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hasRunCapability, SUPPORTED_RUN_FORMAT_VERSIONS, walkFiles } from './run-model.js';
import { DUPLICATE_PATH, validateDuplicateRun } from './duplicate-review.js';
export function duplicateArtifactsPresent(model) {
    return [DUPLICATE_PATH, 'verification/harness/duplicate-discovery', 'verification/harness/duplicate-subjects',
        'verification/harness/duplicate-assignments', 'verification/harness/duplicate-results', 'verification/harness/duplicate-effects', 'verification/harness/duplicate-process']
        .some((path) => existsSync(join(model.runDir, path)))
        || (existsSync(join(model.runDir, 'control/worker-bundles')) && walkFiles(join(model.runDir, 'control/worker-bundles'))
            .filter((path) => path.endsWith('/contracts/output.json')).some((path) => {
            try {
                return JSON.parse(readFileSync(path, 'utf8')).contract_format === 'aleph-duplicate-output-contract/v1';
            }
            catch {
                return false;
            }
        }))
        || [...model.documents].some(([path, doc]) => doc && (path === 'run-manifest.md' || path === 'run-log.md' || path.startsWith('ledgers/'))
            && /^\s*(?:-\s*)?(?:duplicate_review_format|duplicate_review_closure_hash):/mu.test(doc.text));
}
export function runK2Duplicates(results, model) {
    const version = model.manifest?.runFormatVersion || '', active = hasRunCapability(version, 'duplicate-overlap-review');
    if (!active && !duplicateArtifactsPresent(model) && (!version || SUPPORTED_RUN_FORMAT_VERSIONS.includes(version)))
        return;
    results.run('K2.20', 'duplicate comparison and admission accounting (STRUCTURAL ONLY)', () => {
        if (!active)
            throw new Error(`DUP_COMPATIBILITY ${version}: operative duplicate artifacts require duplicate-overlap-review`);
        const report = validateDuplicateRun(model);
        return `structure only; ${JSON.stringify(report)}; no equivalence, materiality, contradiction, support independence, semantic recall, context adequacy, reviewer quality or cognitive freshness established`;
    });
}
