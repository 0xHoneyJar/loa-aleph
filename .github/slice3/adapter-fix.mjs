import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(path, before, after) {
  const text = readFileSync(path, 'utf8');
  const first = text.indexOf(before);
  if (first < 0) throw new Error(`${path}: replacement anchor not found: ${before.slice(0, 100)}`);
  if (text.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${path}: replacement anchor is not unique: ${before.slice(0, 100)}`);
  }
  writeFileSync(path, text.slice(0, first) + after + text.slice(first + before.length), 'utf8');
}

// K2.15 packet-to-claim closure belongs to completed S3, not merely entered S2.
replaceOnce(
  'scripts/lib/checks-k2-lineage.ts',
  `    const claimedPackets = new Set<string>();\n    for (const claim of model.claims) {\n      for (const packetId of idsIn(claim.values.packets, 'PKT')) claimedPackets.add(packetId);\n    }\n    for (const packet of model.packets) {\n      const packetId = packet.values.packetId;\n      if (!claimedPackets.has(packetId) && !terminalizedBy.has(packetId)) {\n        fail(\`${'${packetId}'} silently disappears: it is cited by no claim and has no lineage closure\`);\n      }\n    }`,
  `    const s3Closed = Boolean(\n      model.runLog?.lines.some((line) => /^##\\s+.+\\s+[—-]\\s+S3\\s+[—-]\\s+exit\\b/iu.test(line))\n      || firstRunLogEntry(model.runLog, 'S4')\n      || firstRunLogEntry(model.runLog, 'S5')\n      || reachedState(model, 'ASSEMBLED')\n      || reachedState(model, 'VERIFIED')\n      || reachedState(model, 'ACCEPTED')\n      || reachedState(model, 'PROJECTING')\n      || reachedState(model, 'PROJECTION-ACCEPTED')\n    );\n    if (s3Closed) {\n      const claimedPackets = new Set<string>();\n      for (const claim of model.claims) {\n        for (const packetId of idsIn(claim.values.packets, 'PKT')) claimedPackets.add(packetId);\n      }\n      for (const packet of model.packets) {\n        const packetId = packet.values.packetId;\n        if (!claimedPackets.has(packetId) && !terminalizedBy.has(packetId)) {\n          fail(\`${'${packetId}'} silently disappears after S3 closure: it is cited by no claim and has no lineage closure\`);\n        }\n      }\n    }`,
);

// New 1.3 S2 integration runs require the lineage surface, but no S3 no-claim decision yet.
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `  writeFileSync(\n    join(ledgers, 'claim-inventory.md'),\n    '# Candidate-Claim Inventory\\n\\n'\n      + '| claim_id | normalized claim | packets | sources | claim_type | disposition | rationale | judged_by | verified | status |\\n'\n      + '|----------|------------------|---------|---------|------------|-------------|-----------|-----------|----------|--------|\\n',\n  );`,
  `  writeFileSync(\n    join(ledgers, 'lineage.md'),\n    '# Unit Lineage\\n\\n'\n      + '- lineage_format: aleph-lineage/v1\\n\\n'\n      + '| lineage_id | owner_stage | type | predecessors | successors | basis | established_by |\\n'\n      + '|------------|-------------|------|--------------|------------|-------|----------------|\\n',\n  );\n  writeFileSync(\n    join(ledgers, 'claim-inventory.md'),\n    '# Candidate-Claim Inventory\\n\\n'\n      + '| claim_id | normalized claim | packets | sources | claim_type | disposition | rationale | judged_by | verified | status |\\n'\n      + '|----------|------------------|---------|---------|------------|-------------|-----------|-----------|----------|--------|\\n',\n  );`,
);

// Coordinated erasure must erase the new 1.3 S2 signal as well, preserving the
// host-neutral ambiguity that the retained host stage floor is designed to catch.
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `  rmSync(join(runDir, 'ledgers', 'source-walk.md'));\n  rmSync(join(runDir, 'ledgers', 'packet-index.md'));`,
  `  rmSync(join(runDir, 'ledgers', 'source-walk.md'));\n  rmSync(join(runDir, 'ledgers', 'lineage.md'));\n  rmSync(join(runDir, 'ledgers', 'packet-index.md'));`,
);

// The live synthetic run is now a retained 1.3 identity. Test the same fail-closed
// authority invariant at the current boundary; legacy 1.2 behavior remains covered
// by the pinned 1.2 Core fixture and is not migrated.
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `    runCase(results, 'retained 1.2 run cannot downgrade its manifest to 1.1', () => {`,
  `    runCase(results, 'retained 1.3 run cannot downgrade its manifest to 1.2', () => {`,
);
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `            '- run_format_version: 1.2.0-provisional',\n            '- run_format_version: 1.1.0-provisional',`,
  `            '- run_format_version: 1.3.0-provisional',\n            '- run_format_version: 1.2.0-provisional',`,
);
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `        expect(downgraded.result === 'FAIL', 'retained 1.2 run accepted a 1.1 manifest downgrade');`,
  `        expect(downgraded.result === 'FAIL', 'retained 1.3 run accepted a 1.2 manifest downgrade');`,
);
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `    runCase(results, 'retained 1.2 run cannot remove its manifest version', () => {`,
  `    runCase(results, 'retained 1.3 run cannot remove its manifest version', () => {`,
);
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `          originalManifest.replace('- run_format_version: 1.2.0-provisional\\n', ''),`,
  `          originalManifest.replace('- run_format_version: 1.3.0-provisional\\n', ''),`,
);
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `        expect(removed.result === 'FAIL', 'retained 1.2 run accepted a missing manifest version');`,
  `        expect(removed.result === 'FAIL', 'retained 1.3 run accepted a missing manifest version');`,
);
replaceOnce(
  'adapters/loa/tests/test-loa-adapter.ts',
  `    runCase(results, 'retained S2 run with valid 1.2 artifacts reaches the pinned checker', () => {`,
  `    runCase(results, 'retained S2 run with valid 1.3 artifacts reaches the pinned checker', () => {`,
);

console.log('Slice 3 adapter/stage integration repair applied.');
