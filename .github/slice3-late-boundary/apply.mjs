import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(path, before, after) {
  const text = readFileSync(path, 'utf8');
  const at = text.indexOf(before);
  if (at < 0) throw new Error(`${path}: anchor not found: ${before.slice(0, 120)}`);
  if (text.indexOf(before, at + before.length) >= 0) {
    throw new Error(`${path}: anchor is not unique: ${before.slice(0, 120)}`);
  }
  writeFileSync(path, text.slice(0, at) + after + text.slice(at + before.length), 'utf8');
}

// Core contract: make the adopted late-correction boundary explicit on the
// current implementation surface without introducing descendant invalidation.
replaceOnce(
  'docs/architecture/03-artifact-contracts.md',
  `- **Boundary:** K2 checks structure and provenance conservation only. Semantic\n  correctness of a split/merge/duplicate/replacement remains model/human\n  judgment. Generic STALE/INVALIDATED propagation, artifact revision, rewind,\n  cross-run reuse, and accepted-run correction remain outside this format.`,
  `- **Late-correction boundary:** canonical lineage appends are owned by S2-S4.\n  If the retained run has already reached S5 or later and a newly discovered\n  unit correction would require another lineage event, the orchestrator must\n  set the run BLOCKED before any canonical lineage append. Existing historical\n  lineage remains readable; Slice 3 does not infer or persist descendant\n  STALE/INVALIDATED state, rewind checkpoints, or resume an earlier stage.\n- **Boundary:** K2 checks structure and provenance conservation only. Semantic\n  correctness of a split/merge/duplicate/replacement remains model/human\n  judgment. Generic STALE/INVALIDATED propagation, artifact revision, rewind,\n  cross-run reuse, and accepted-run correction remain outside this format.`,
);

replaceOnce(
  'docs/architecture/prompts/orchestrator.md',
  `- You are the single writer of every ledger. Workers return objects; you\n  validate them against the role's output contract, then append — with\n  status columns, supersessions, and recomputed accounting.`,
  `- You are the single writer of every ledger. Workers return objects; you\n  validate them against the role's output contract, then append — with\n  status columns, supersessions, and recomputed accounting.\n- Before appending ledgers/lineage.md, verify the retained run stage is S2, S3,\n  or S4. If the run has already reached S5 or later and a newly discovered\n  correction would require lineage, set BLOCKED and do not append it. Preserve\n  the worker return and report the boundary; do not invent descendant\n  invalidation, rewind, rollback, or an earlier-stage resume.`,
);

// Host-mechanical enforcement of the Core-owned lineage write window.
replaceOnce(
  'adapters/loa/src/ledger-writer.ts',
  `  LOA_LEDGER_RECEIPT_FORMAT,\n  type Clock,\n  type JsonValue,\n  type LedgerReceipt,`,
  `  CORE_STAGES,\n  LOA_LEDGER_RECEIPT_FORMAT,\n  type Clock,\n  type JsonValue,\n  type LedgerReceipt,\n  type LoaRunState,`,
);

replaceOnce(
  'adapters/loa/src/ledger-writer.ts',
  `function canonicalRunPath(path: string): boolean {\n  return CANONICAL_FILES.has(path)\n    || CANONICAL_PREFIXES.some((prefix) => path.startsWith(prefix));\n}\n`,
  `function canonicalRunPath(path: string): boolean {\n  return CANONICAL_FILES.has(path)\n    || CANONICAL_PREFIXES.some((prefix) => path.startsWith(prefix));\n}\n\nconst LINEAGE_LEDGER_PATH = 'ledgers/lineage.md';\nconst LATE_LINEAGE_HALT_CODE = 'LATE_UNIT_LINEAGE_CORRECTION';\n\nfunction lineageStageIndex(stage: LoaRunState['execution']['stage']): number {\n  return CORE_STAGES.indexOf(stage);\n}\n`,
);

replaceOnce(
  'adapters/loa/src/ledger-writer.ts',
  `      const state = readRunState(this.runDir);\n      if (state.ledger.writer_id !== 'loa-orchestrator') {`,
  `      let state = readRunState(this.runDir);\n      if (relativePath === LINEAGE_LEDGER_PATH) {\n        const stage = state.execution.stage;\n        const stageIndex = lineageStageIndex(stage);\n        const s2Index = lineageStageIndex('S2');\n        const s4Index = lineageStageIndex('S4');\n        if (stageIndex < s2Index) {\n          throw new Error(\`Core lineage write window has not opened at stage \${stage}; expected S2-S4\`);\n        }\n        if (stageIndex > s4Index) {\n          const blockedAt = this.clock.now();\n          if (state.execution.core_state !== 'BLOCKED'\n            || state.execution.halt?.code !== LATE_LINEAGE_HALT_CODE) {\n            state = updateRunState(this.runDir, blockedAt, (draft) => {\n              draft.execution.core_state = 'BLOCKED';\n              draft.execution.halt = {\n                code: LATE_LINEAGE_HALT_CODE,\n                reason: \`new unit lineage is forbidden after S4; retained stage is \${stage}\`,\n                at: blockedAt,\n                blocking: true,\n              };\n            });\n          }\n          throw new Error(\n            \`Core late-correction boundary BLOCKED new lineage append at retained stage \${stage}\`,\n          );\n        }\n        if (state.execution.halt !== null) {\n          throw new Error(\`blocked run cannot append lineage at stage \${stage}\`);\n        }\n      }\n      if (state.ledger.writer_id !== 'loa-orchestrator') {`,
);

// Regression: a validated return cannot append new unit lineage once retained
// execution has crossed S4, and the run is durably BLOCKED without ledger bytes.
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `    runCase(results, 'committed ledger retries return the original receipt without appending', () => {`,
  `    runCase(results, 'late S5+ unit correction blocks before canonical lineage append', () => {\n      const fixture = context.ledgerRecovery;\n      expect(fixture !== null, 'validated ledger fixture is unavailable');\n      const originalState = structuredClone(readRunState(fixture.runDir));\n      const lineagePath = join(fixture.runDir, 'ledgers', 'lineage.md');\n      const lineageBefore = existsSync(lineagePath) ? readFileSync(lineagePath) : null;\n      const chainPath = join(fixture.runDir, 'control', 'ledger-chain.jsonl');\n      const chainBefore = existsSync(chainPath) ? readFileSync(chainPath) : null;\n      try {\n        updateRunState(fixture.runDir, '2040-01-02T03:09:30.000Z', (draft) => {\n          draft.execution.core_state = 'DISTILLING';\n          draft.execution.stage = 'S5';\n          draft.execution.stage_status = 'running';\n          draft.execution.gate = null;\n          draft.execution.halt = null;\n        });\n        const beforeAttempt = readRunState(fixture.runDir);\n        expectThrows(\n          () => new LedgerWriter(fixture.runDir, CLOCK).append(\n            'ledgers/lineage.md',\n            fixture.validated,\n            () => '| LIN-9999 | S4 | replace | CC-9998 | CC-9999 | late correction | fixture |',\n          ),\n          /late-correction boundary BLOCKED.*S5/iu,\n          'late lineage append after S5',\n        );\n        const blocked = readRunState(fixture.runDir);\n        expect(blocked.execution.core_state === 'BLOCKED', 'late lineage attempt did not set BLOCKED');\n        expect(blocked.execution.stage === 'S5', 'late lineage block changed the retained stage');\n        expect(\n          blocked.execution.halt?.code === 'LATE_UNIT_LINEAGE_CORRECTION',\n          'late lineage block omitted its durable halt code',\n        );\n        expect(\n          blocked.ledger.sequence === beforeAttempt.ledger.sequence\n            && blocked.ledger.chain_head === beforeAttempt.ledger.chain_head,\n          'late lineage block advanced the canonical ledger chain',\n        );\n        expect(\n          lineageBefore === null\n            ? !existsSync(lineagePath)\n            : readFileSync(lineagePath).equals(lineageBefore),\n          'late lineage block changed lineage bytes',\n        );\n        expect(\n          chainBefore === null\n            ? !existsSync(chainPath)\n            : readFileSync(chainPath).equals(chainBefore),\n          'late lineage block changed ledger-chain bytes',\n        );\n      } finally {\n        writeRunState(fixture.runDir, originalState);\n        if (lineageBefore === null) rmSync(lineagePath, { force: true });\n        else writeFileSync(lineagePath, lineageBefore);\n        if (chainBefore === null) rmSync(chainPath, { force: true });\n        else writeFileSync(chainPath, chainBefore);\n      }\n    });\n\n    runCase(results, 'committed ledger retries return the original receipt without appending', () => {`,
);

console.log('Applied bounded Slice 3 late-correction BLOCK repair.');
