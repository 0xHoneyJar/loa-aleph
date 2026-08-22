import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const p = (...parts) => join(ROOT, ...parts);
const read = (path) => readFileSync(p(path), 'utf8');
const write = (path, text) => {
  mkdirSync(p(path).split('/').slice(0, -1).join('/'), { recursive: true });
  writeFileSync(p(path), text, 'utf8');
};

function replaceOnce(path, before, after) {
  const text = read(path);
  const first = text.indexOf(before);
  if (first < 0) throw new Error(`${path}: replacement anchor not found: ${before.slice(0, 100)}`);
  if (text.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${path}: replacement anchor is not unique: ${before.slice(0, 100)}`);
  }
  write(path, text.slice(0, first) + after + text.slice(first + before.length));
}

function appendOnce(path, marker, text) {
  const current = read(path);
  if (current.includes(marker)) return;
  write(path, `${current.trimEnd()}\n\n${text.trim()}\n`);
}

function json(path) {
  return JSON.parse(read(path));
}
function writeJson(path, value) {
  write(path, `${JSON.stringify(value, null, 2)}\n`);
}
function insertAfter(array, anchor, values) {
  const additions = values.filter((value) => !array.includes(value));
  if (!additions.length) return;
  const index = array.indexOf(anchor);
  if (index < 0) throw new Error(`manifest anchor not found: ${anchor}`);
  array.splice(index + 1, 0, ...additions);
}
function walkFiles(root) {
  const out = [];
  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const stat = statSync(full);
      if (stat.isDirectory()) visit(full);
      else if (stat.isFile()) out.push(relative(ROOT, full).replaceAll('\\', '/'));
    }
  };
  visit(root);
  return out.sort();
}

// ---- run-format capability ladder ----
replaceOnce(
  'scripts/lib/run-model.ts',
  `export const LEGACY_RUN_FORMAT_VERSION = '1.0.0-provisional';\nexport const EXACT_EVIDENCE_RUN_FORMAT_VERSION = '1.1.0-provisional';\nexport const CURRENT_RUN_FORMAT_VERSION = '1.2.0-provisional';\nexport const SUPPORTED_RUN_FORMAT_VERSIONS = [\n  LEGACY_RUN_FORMAT_VERSION,\n  EXACT_EVIDENCE_RUN_FORMAT_VERSION,\n  CURRENT_RUN_FORMAT_VERSION,\n] as const;\n\nexport function usesForwardExecutionIdentity(runFormatVersion: string): boolean {\n  return [\n    EXACT_EVIDENCE_RUN_FORMAT_VERSION,\n    CURRENT_RUN_FORMAT_VERSION,\n  ].some((version) => version === runFormatVersion);\n}\n\nexport function usesExactEvidence(runFormatVersion: string): boolean {\n  return usesForwardExecutionIdentity(runFormatVersion);\n}`,
  `export const LEGACY_RUN_FORMAT_VERSION = '1.0.0-provisional';\nexport const EXACT_EVIDENCE_RUN_FORMAT_VERSION = '1.1.0-provisional';\nexport const SOURCE_WALK_RUN_FORMAT_VERSION = '1.2.0-provisional';\nexport const CURRENT_RUN_FORMAT_VERSION = '1.3.0-provisional';\nexport const SUPPORTED_RUN_FORMAT_VERSIONS = [\n  LEGACY_RUN_FORMAT_VERSION,\n  EXACT_EVIDENCE_RUN_FORMAT_VERSION,\n  SOURCE_WALK_RUN_FORMAT_VERSION,\n  CURRENT_RUN_FORMAT_VERSION,\n] as const;\n\nexport function usesForwardExecutionIdentity(runFormatVersion: string): boolean {\n  return [\n    EXACT_EVIDENCE_RUN_FORMAT_VERSION,\n    SOURCE_WALK_RUN_FORMAT_VERSION,\n    CURRENT_RUN_FORMAT_VERSION,\n  ].some((version) => version === runFormatVersion);\n}\n\nexport function usesExactEvidence(runFormatVersion: string): boolean {\n  return usesForwardExecutionIdentity(runFormatVersion);\n}\n\nexport function usesSourceWalk(runFormatVersion: string): boolean {\n  return [\n    SOURCE_WALK_RUN_FORMAT_VERSION,\n    CURRENT_RUN_FORMAT_VERSION,\n  ].some((version) => version === runFormatVersion);\n}\n\nexport function usesLineage(runFormatVersion: string): boolean {\n  return runFormatVersion === CURRENT_RUN_FORMAT_VERSION;\n}`,
);

// ---- lineage-current becomes the current-view selector for 1.3 ----
replaceOnce(
  'scripts/lib/check-helpers.ts',
  `import type { RouteCard, RunDocument, RunModel } from './run-model.ts';`,
  `import { usesLineage } from './run-model.ts';\nimport type { RouteCard, RunDocument, RunModel } from './run-model.ts';\nimport { lineageCurrentClaims } from './lineage.ts';`,
);
replaceOnce(
  'scripts/lib/check-helpers.ts',
  `export function activeClaims(model: RunModel): RunModel['claims'] {\n  return model.claims.filter((claim) => claim.values.status === 'active');\n}`,
  `export function activeClaims(model: RunModel): RunModel['claims'] {\n  if (usesLineage(model.manifest?.runFormatVersion || '')) {\n    return lineageCurrentClaims(model);\n  }\n  return model.claims.filter((claim) => claim.values.status === 'active');\n}`,
);

// ---- K2 integration ----
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `import type { ResultCollector } from './results.ts';`,
  `import type { ResultCollector } from './results.ts';\nimport { runK2Lineage } from './checks-k2-lineage.ts';`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `  usesExactEvidence,\n  usesForwardExecutionIdentity,`,
  `  usesExactEvidence,\n  usesForwardExecutionIdentity,\n  usesLineage,\n  usesSourceWalk,`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `  if (model.sourceWalkDocument) signals.push('ledgers/source-walk.md');`,
  `  if (model.sourceWalkDocument) signals.push('ledgers/source-walk.md');\n  if (model.documents.has('ledgers/lineage.md')) signals.push('ledgers/lineage.md');`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `      if (\n        model.manifest?.runFormatVersion === CURRENT_RUN_FORMAT_VERSION\n        && !existsPath(join(model.runDir, 'ledgers/source-walk.md'))\n      ) {\n        fail('required path ledgers/source-walk.md is missing');\n      }`,
  `      if (\n        usesSourceWalk(model.manifest?.runFormatVersion || '')\n        && !existsPath(join(model.runDir, 'ledgers/source-walk.md'))\n      ) {\n        fail('required path ledgers/source-walk.md is missing');\n      }\n      if (\n        usesLineage(model.manifest?.runFormatVersion || '')\n        && !existsPath(join(model.runDir, 'ledgers/lineage.md'))\n      ) {\n        fail('required path ledgers/lineage.md is missing');\n      }`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `    if (version !== CURRENT_RUN_FORMAT_VERSION) {\n      if (structurePresent) {\n        fail(\n          \`run format \${version || '(pre-versioned)'} must not be reinterpreted as \`\n          + \`\${SOURCE_WALK_FORMAT}\`,\n        );\n      }\n      if (\n        version\n        && version !== LEGACY_RUN_FORMAT_VERSION\n        && version !== EXACT_EVIDENCE_RUN_FORMAT_VERSION\n      ) {\n        fail(\n          \`source-walk activation cannot determine unsupported run_format_version \`\n          + \`"\${version}"\`,\n        );\n      }\n      return \`source walk is not applicable to run format \${version || '(pre-versioned)'}\`;\n    }`,
  `    if (!usesSourceWalk(version)) {\n      if (structurePresent) {\n        fail(\n          \`run format \${version || '(pre-versioned)'} must not be reinterpreted as \`\n          + \`\${SOURCE_WALK_FORMAT}\`,\n        );\n      }\n      if (\n        version\n        && !(SUPPORTED_RUN_FORMAT_VERSIONS as readonly string[]).includes(version)\n      ) {\n        fail(\n          \`source-walk activation cannot determine unsupported run_format_version \`\n          + \`"\${version}"\`,\n        );\n      }\n      return \`source walk is not applicable to run format \${version || '(pre-versioned)'}\`;\n    }`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `    const packetIndex = makeIndexes(model).PKT;\n    const s5Entered = reachedState(model, 'ASSEMBLED') || Boolean(firstRunLogEntry(model.runLog, 'S5'));`,
  `    const packetIndex = makeIndexes(model).PKT;\n    const currentClaimIds = new Set(activeClaims(model).map((claim) => claim.values.claimId));\n    const s5Entered = reachedState(model, 'ASSEMBLED') || Boolean(firstRunLogEntry(model.runLog, 'S5'));`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `      if (status === 'active') {\n        if (s5Entered && !isDisposition(disposition)) {\n          fail(\`${'${claimId}'} active after S5 has invalid disposition "${'${disposition || \'(blank)\'}'}"\`);\n        } else if (disposition && !isDisposition(disposition)) {\n          fail(\`${'${claimId}'} has invalid disposition "${'${disposition}'}"\`);\n        }\n      }`,
  `      if (status === 'active') {\n        if (s5Entered && currentClaimIds.has(claimId) && !isDisposition(disposition)) {\n          fail(\`${'${claimId}'} lineage-current after S5 has invalid disposition "${'${disposition || \'(blank)\'}'}"\`);\n        } else if (disposition && !isDisposition(disposition)) {\n          fail(\`${'${claimId}'} has invalid disposition "${'${disposition}'}"\`);\n        }\n      }`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `        if (absorbed.values.disposition !== 'merged') {\n          fail(\`${'${absorbedId}'} is absorbed but disposition is "${'${absorbed.values.disposition}'}"\`);\n        }`,
  `        if (\n          !usesLineage(model.manifest?.runFormatVersion || '')\n          && absorbed.values.disposition !== 'merged'\n        ) {\n          fail(\`${'${absorbedId}'} is absorbed but disposition is "${'${absorbed.values.disposition}'}"\`);\n        }`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `    const rows = allStatusRows(model);\n    const indexes = makeIndexes(model);`,
  `    const rows = allStatusRows(model);\n    const indexes = makeIndexes(model);\n    const lineageStatus = usesLineage(model.manifest?.runFormatVersion || '');`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `    for (const row of rows) {\n      if (row.status === 'active') continue;`,
  `    for (const row of rows) {\n      if (lineageStatus && /^(?:PKT|CC)-\\d+$/.test(row.id) && row.status !== 'active') {\n        fail(\`${'${row.id}'} run-format 1.3 unit rows must use durable status active; identity currentness belongs to lineage\`);\n        continue;\n      }\n      if (row.status === 'active') continue;`,
);
replaceOnce(
  'scripts/lib/checks-k2.ts',
  `  checkSourceWalk(results, model);\n}`,
  `  checkSourceWalk(results, model);\n  runK2Lineage(results, model);\n}`,
);

// ---- Core docs: make 1.3 semantics explicit without rewriting predecessor history ----
replaceOnce(
  'docs/architecture/03-artifact-contracts.md',
  `- **Activation:** run format \`1.2.0-provisional\` requires\n  \`source_walk_format: aleph-source-walk/v1\` and`,
  `- **Activation:** run formats \`1.2.0-provisional\` and\n  \`1.3.0-provisional\` require\n  \`source_walk_format: aleph-source-walk/v1\` and`,
);
replaceOnce(
  'docs/architecture/03-artifact-contracts.md',
  `## 6. Disposition-ledger summary (\`ledgers/disposition-ledger.md\`)`,
  `## 5a. Unit-lineage ledger (\`ledgers/lineage.md\`)\n\n- **Purpose:** preserve append-only packet/claim identity history while deriving a\n  structural current view without rewriting predecessor rows.\n- **Activation:** run format \`1.3.0-provisional\` requires\n  \`lineage_format: aleph-lineage/v1\` once S2 begins. Historical 1.0-1.2\n  runs retain their pinned status/merge interpretation and are not migrated.\n- **Fields:** \`LIN-NNNN\`; owner stage (S2-S4); one type from \`split\`,\n  \`merge\`, \`replace\`, \`supersede\`, \`duplicate\`, \`reject\`, \`exclude\`,\n  \`no-claim\`; predecessor IDs; successor IDs or \`none\`; inspectable basis;\n  establishing actor/invocation. Events are atomic transformations, not\n  unrelated pairwise edges.\n- **Cardinality:** split 1→2+ (PKT or CC); merge 2+→1 (CC); replace/supersede\n  1→1 (same unit family); duplicate 2+→1 (CC); reject/exclude 1→0 (PKT or CC);\n  no-claim 1→0 (PKT only). There is no generic N→M type; complex history\n  composes ordinary events. A successor may have multiple truthful incoming\n  events, while a predecessor is terminalized once.\n- **Currentness:** \`lineage-current\` is derived mechanically as a valid durable\n  PKT/CC definition that never appears as a lineage predecessor. It is not the\n  broader architectural EFFECTIVE state. In 1.3, packet/claim \`status = active\`\n  means the durable row is admitted/readable; it does not mean identity-current.\n- **Provenance:** packet→claim derivation remains claim provenance, not\n  replacement lineage. Merge/duplicate create a new successor CC whose packet\n  provenance conserves the predecessor union. Claim split successors each have\n  valid provenance and conserve predecessor provenance in aggregate. A\n  lineage-current claim may cite only lineage-current packets.\n- **S5/Précis boundary:** current S5 accounting and current Précis compilation\n  use lineage-current claims. Historical predecessors remain inspectable and do\n  not receive fabricated new dispositions merely to satisfy current accounting.\n- **Boundary:** K2 checks structure and provenance conservation only. Semantic\n  correctness of a split/merge/duplicate/replacement remains model/human\n  judgment. Generic STALE/INVALIDATED propagation, artifact revision, rewind,\n  cross-run reuse, and accepted-run correction remain outside this format.\n\n## 6. Disposition-ledger summary (\`ledgers/disposition-ledger.md\`)`,
);
replaceOnce(
  'docs/architecture/03-artifact-contracts.md',
  `Unchanged from the wedge (Précis §5): per-disposition counts and claim-id\nlists; totals equal the inventory; every claim appears exactly once. Exists as\nits own ledger so the accounting is checkable before the Précis is assembled.`,
  `Précis §5 records per-disposition counts and claim-id lists. In predecessor\nformats, totals retain their original active-row interpretation. In run format\n1.3, totals equal the lineage-current claim population and every lineage-current\nclaim appears exactly once; historical predecessors remain in durable history\nwithout fabricated current dispositions. Exists as its own ledger so accounting\nis checkable before the Précis is assembled.`,
);
appendOnce(
  'docs/architecture/03-artifact-contracts.md',
  '### Run-format 1.3 duplicate/merge identity rule',
  `### Run-format 1.3 duplicate/merge identity rule\n\nFor \`1.3.0-provisional\`, every S4 duplicate or merge decision has two\ncooperating records: the merge map records the semantic/corroboration judgment,\nand \`ledgers/lineage.md\` records the identity transformation. The canonical\nclaim is a newly materialized successor CC; no predecessor claim is mutated in\nplace. The merge map therefore names that successor as \`canonical\` and its\npredecessors as \`absorbs\`. Absorption is not itself an S5 \`merged\`\ndisposition. Historical predecessor formats retain their pinned behavior.`,
);

replaceOnce(
  'docs/architecture/04-pipeline-stages-and-dod.md',
  `- **Outputs:** \`ledgers/claim-inventory.md\` (claims + provenance + claim type;\n  dispositions still blank).`,
  `- **Outputs:** \`ledgers/claim-inventory.md\` (claims + provenance + claim type;\n  dispositions still blank); in run format 1.3, S3 structural identity outcomes\n  append to \`ledgers/lineage.md\`.`,
);
replaceOnce(
  'docs/architecture/04-pipeline-stages-and-dod.md',
  `  - [ ] ⚙ every claim has ≥1 packet; every packet either yielded claims or is\n        marked \`no-claim\` with one of the recorded criteria-reasons`,
  `  - [ ] ⚙ every claim has ≥1 packet; every packet either yielded claims or has\n        an explicit structural lineage closure; a true zero-claim packet uses\n        the \`no-claim\` lineage event`,
);
replaceOnce(
  'docs/architecture/04-pipeline-stages-and-dod.md',
  `- **Outputs:** \`ledgers/merge-map.md\`; inventory updated (absorbed claims keep\n  rows and get \`merged\`).`,
  `- **Outputs:** \`ledgers/merge-map.md\`; for run format 1.3, each merge or\n  duplicate also appends one lineage event and materializes a new canonical\n  successor claim while every predecessor row remains immutable history.`,
);
replaceOnce(
  'docs/architecture/04-pipeline-stages-and-dod.md',
  `  - [ ] ⚙ C8 provenance superset holds for every merge row`,
  `  - [ ] ⚙ C8 provenance superset holds for every merge row; in 1.3 every\n        merge/duplicate map row matches one typed lineage event whose new\n        successor conserves predecessor packet provenance`,
);
replaceOnce(
  'docs/architecture/04-pipeline-stages-and-dod.md',
  `  - [ ] ⚙ every claim exactly one disposition; accounting balances`,
  `  - [ ] ⚙ every current research claim exactly one disposition; in 1.3 this\n        population is the lineage-current claim set, while historical\n        predecessors require no fabricated new disposition; accounting balances`,
);

replaceOnce(
  'docs/architecture/templates/03-extraction-claims.md',
  `  \`1.1.0-provisional\` and \`1.2.0-provisional\` require this marker and the\n  three versioned tables once S2 is reached.`,
  `  \`1.1.0-provisional\`, \`1.2.0-provisional\`, and \`1.3.0-provisional\`\n  require this marker and the three versioned tables once S2 is reached.`,
);
replaceOnce(
  'docs/architecture/templates/03-extraction-claims.md',
  `- \`status\`: \`active\` | \`superseded-by:PKT-xxxx\` | \`retracted:⟨reason⟩\`.`,
  `- \`status\`: predecessor formats retain \`active\` |\n  \`superseded-by:PKT-xxxx\` | \`retracted:⟨reason⟩\`. In run format 1.3,\n  durable PKT/CC rows use \`active\`; unit identity currentness is derived from\n  T3.3a lineage instead of encoded in the status cell.`,
);
replaceOnce(
  'docs/architecture/templates/03-extraction-claims.md',
  `- **Précis §4 rendering:** exactly \`claim_id | normalized claim | source(s) |\n  disposition\`, \`active\` rows only.`,
  `- **Précis §4 rendering:** exactly \`claim_id | normalized claim | source(s) |\n  disposition\`. Predecessor formats retain their active-row rule; 1.3 renders\n  lineage-current claims only.`,
);
replaceOnce(
  'docs/architecture/templates/03-extraction-claims.md',
  `## T3.4 Disposition ledger → \`runs/<run-id>/ledgers/disposition-ledger.md\``,
  `## T3.3a Unit lineage → \`runs/<run-id>/ledgers/lineage.md\`\n\n\`\`\`markdown\n# Unit Lineage — ⟨RUN-slug⟩\n\n- lineage_format: aleph-lineage/v1\n\n| lineage_id | owner_stage | type | predecessors | successors | basis | established_by |\n|------------|-------------|------|--------------|------------|-------|----------------|\n\`\`\`\n\nRules for run format 1.3: \`LIN-NNNN\` is unique; owner stage is S2-S4; type\nis exactly split/merge/replace/supersede/duplicate/reject/exclude/no-claim;\ncardinality follows the artifact contract; \`none\` is used only when the event\nhas zero successors. Packet-to-claim ancestry remains claim provenance.\nLineage is append-only and predecessors are never rewritten or resurrected.\n\n## T3.4 Disposition ledger → \`runs/<run-id>/ledgers/disposition-ledger.md\``,
);
replaceOnce(
  'docs/architecture/templates/03-extraction-claims.md',
  `rows always present even at count 0 — a zero row is information; total equals\nthe inventory's \`active\` row count.`,
  `rows always present even at count 0 — a zero row is information. Predecessor\nformats retain active-row totals; in 1.3 total equals the lineage-current claim\ncount.`,
);
appendOnce(
  'docs/architecture/templates/03-extraction-claims.md',
  '### 1.3 merge-map rule',
  `### 1.3 merge-map rule\n\nFor run format 1.3, \`canonical\` is a newly materialized successor CC and\n\`absorbs\` lists its lineage predecessors. The same predecessor/successor set\nmust appear in one \`merge\` or \`duplicate\` lineage event. Absorbed historical\nclaims do not receive an S5 \`merged\` disposition merely because they were\nterminalized structurally.`,
);

// Worker contracts: lineage proposals remain stage-bounded; orchestrator assigns durable ids.
replaceOnce(
  'docs/architecture/prompts/workers-intake-extraction.md',
  `- NO dispositions. NO merging across the batch beyond identical wording.\n  NO importance judgments.`,
  `- For a packet that yields no claim, return an explicit no-claim proposal\n  with its packet id and structural basis. Do not invent a successor.\n- If correcting an already materialized packet/claim identity is explicitly in\n  the authorized S2-S4 task, propose the bounded lineage transformation; never\n  mutate a predecessor row in place.\n- NO dispositions. NO merging across the batch beyond identical wording.\n  NO importance judgments.`,
);
replaceOnce(
  'docs/architecture/prompts/workers-intake-extraction.md',
  `{ "claims": [{ "normalized_claim": "", "packets": ["PKT-…"],\n  "claim_type": "", "widen_requests": [{"packet": "", "new_locator": ""}],\n  "rationale": "", "flags": [] }] }`,
  `{ "claims": [{ "normalized_claim": "", "packets": ["PKT-…"],\n  "claim_type": "", "widen_requests": [{"packet": "", "new_locator": ""}],\n  "rationale": "", "flags": [] }],\n  "no_claim_packets": [{ "packet": "PKT-…", "basis": "" }],\n  "lineage_proposals": [{ "type": "split|replace|supersede|reject|exclude",\n  "predecessors": ["PKT-…|CC-…"], "successor_specs": [], "basis": "" }] }`,
);
replaceOnce(
  'docs/architecture/prompts/workers-intake-extraction.md',
  `- For each merge: canonical id (prefer the most complete provenance),\n  absorbed ids, one-line basis, and corroboration = independent (distinct\n  origins genuinely agree) vs restatement (one origin echoed).`,
  `- For each merge/duplicate in run format 1.3, do NOT reuse or mutate a\n  predecessor as canonical. Propose a new successor claim specification with\n  normalized text, claim type, and the complete packet-provenance union; the\n  orchestrator assigns its new CC id and the LIN id only after validation.\n- Distinguish \`duplicate\` (same-claim canonicalization) from \`merge\`\n  (several distinct predecessor identities intentionally forming one successor).\n  Record one-line basis and corroboration = independent (distinct origins\n  genuinely agree) vs restatement (one origin echoed).`,
);
replaceOnce(
  'docs/architecture/prompts/workers-intake-extraction.md',
  `{ "merges": [{ "canonical": "CC-…", "absorbs": ["CC-…"], "basis": "",\n  "corroboration": "independent|restatement", "rationale": "", "flags": [] }],\n  "contradiction_pairs": [{ "a": "CC-…", "b": "CC-…", "why": "" }] }`,
  `{ "canonicalizations": [{ "lineage_type": "merge|duplicate",\n  "predecessors": ["CC-…"],\n  "successor": { "normalized_claim": "", "packets": ["PKT-…"],\n  "claim_type": "" }, "basis": "",\n  "corroboration": "independent|restatement", "rationale": "", "flags": [] }],\n  "contradiction_pairs": [{ "a": "CC-…", "b": "CC-…", "why": "" }] }`,
);
replaceOnce(
  'docs/architecture/prompts/workers-judgment.md',
  `- merged: already absorbed per the merge map (you confirm, not decide).`,
  `- merged: a research-result role for a lineage-current claim when the S5\n  contract independently judges that role. It is NOT a marker that an identity\n  was absorbed; structural absorption belongs to the lineage ledger.`,
);
replaceOnce(
  'docs/architecture/prompts/workers-judgment.md',
  `- Judge from the claim + its packets + the scope + the criteria. Nothing\n  else exists for you.`,
  `- Judge only the current claim population supplied by the orchestrator. In\n  run format 1.3 that means lineage-current claims; never fabricate a new\n  disposition for a historical predecessor simply to balance current counts.\n- Judge from the claim + its packets + the scope + the criteria. Nothing\n  else exists for you.`,
);

appendOnce(
  'docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md',
  '- K2.15 (`lineage and lineage-current closure`)',
  `- K2.15 (\`lineage and lineage-current closure\`): run format\n  \`1.3.0-provisional\` activates \`lineage_format: aleph-lineage/v1\`. The\n  checker verifies the closed event vocabulary/cardinalities, LIN identity,\n  PKT/CC resolution and same-family constraints, single terminalization,\n  acyclicity, legal multiple incoming successors, merge/duplicate provenance\n  union, aggregate claim-split provenance conservation, true packet no-claim\n  closure, and direct lineage-current claim→lineage-current packet provenance.\n  Current S5 and Précis populations are derived from lineage-current claims,\n  not durable \`status = active\` alone. 1.3 merge-map rows must agree with\n  merge/duplicate lineage events. These checks are structural only and do not\n  decide semantic transformation quality. Earlier run formats must not be\n  reinterpreted as lineage runs.`,
);
replaceOnce(
  'docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md',
  `Run format \`1.2.0-provisional\` additionally requires\n  \`ledgers/source-walk.md\` whenever S2 applies.`,
  `Run formats \`1.2.0-provisional\` and \`1.3.0-provisional\` additionally\n  require \`ledgers/source-walk.md\` whenever S2 applies; 1.3 also requires\n  \`ledgers/lineage.md\`.`,
);
replaceOnce(
  'docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md',
  `Decision 0004's forward run formats (\`1.1.0-provisional\` and\n  \`1.2.0-provisional\`) additionally require`,
  `Decision 0004's forward run formats (\`1.1.0-provisional\`,\n  \`1.2.0-provisional\`, and \`1.3.0-provisional\`) additionally require`,
);
replaceOnce(
  'docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md',
  `In run formats \`1.1.0-provisional\` and\n  \`1.2.0-provisional\`, the marker is mandatory`,
  `In run formats \`1.1.0-provisional\`, \`1.2.0-provisional\`, and\n  \`1.3.0-provisional\`, the marker is mandatory`,
);
replaceOnce(
  'docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md',
  `- K2.14 (\`source walk, gap review, and resume accounting\`): only run format\n  \`1.2.0-provisional\` activates`,
  `- K2.14 (\`source walk, gap review, and resume accounting\`): run formats\n  \`1.2.0-provisional\` and \`1.3.0-provisional\` activate`,
);

// ---- focused 1.3 fixture ----
const sourceFixture = p('docs/fixtures/source-walk-accounting');
const fixture = p('docs/fixtures/lineage-accounting');
if (existsSync(fixture)) rmSync(fixture, { recursive: true, force: true });
cpSync(sourceFixture, fixture, { recursive: true });
for (const file of walkFiles(fixture).filter((name) => name.endsWith('.md'))) {
  writeFileSync(p(file), readFileSync(p(file), 'utf8').replaceAll('RUN-source-walk-accounting', 'RUN-lineage-accounting'));
}

write('docs/fixtures/lineage-accounting/README.md', `# Unified Lineage Accounting Fixture\n\n\`\`\`aleph-fixture\nkind: run\nsrc_ids: SRC-401\n\`\`\`\n\nThis synthetic \`1.3.0-provisional\` run exercises typed unit lineage, derived\nlineage-current views, current S5 accounting, and current Précis rendering on\ntop of the existing exact-evidence and source-walk contracts. It is structural\nfixture evidence only and does not prove semantic judgment, replay, validation,\nsanction, acceptance, production readiness, or v1.\n`);

replaceOnce(
  'docs/fixtures/lineage-accounting/run-manifest.md',
  '- run_format_version: 1.2.0-provisional',
  '- run_format_version: 1.3.0-provisional',
);
replaceOnce(
  'docs/fixtures/lineage-accounting/run-manifest.md',
  '| 3 | DISTILLING | 2026-08-14 08:20 UTC | manual-fixture-runner | source-walk accounting began |',
  '| 3 | DISTILLING | 2026-08-14 08:20 UTC | manual-fixture-runner | source-walk accounting began |\n| 4 | ASSEMBLED | 2026-08-14 09:20 UTC | manual-fixture-assembler | structural lineage-current Précis fixture assembled |',
);
appendOnce(
  'docs/fixtures/lineage-accounting/run-log.md',
  '## 2026-08-14 08:50 UTC — S3 — entry',
  `## 2026-08-14 08:50 UTC — S3 — entry\n\nMaterialized the synthetic claim inventory and explicit zero-claim packet closure.\n\n## 2026-08-14 09:00 UTC — S4 — exit\n\nRecorded synthetic split, merge, duplicate, replacement, and supersession lineage.\n\n## 2026-08-14 09:05 UTC — S5 — entry\n\nAssigned current dispositions only to lineage-current claims. Historical predecessors remain durable with blank current dispositions.\n\n## 2026-08-14 09:15 UTC — S11 — exit\n\nRendered only lineage-current claims into the synthetic Précis current view.`,
);

const claimRows = [
  ['CC-0401','Original claim later split','PKT-0401, PKT-0403','','',''],
  ['CC-0402','Original claim later replaced','PKT-0404','','',''],
  ['CC-0403','Original claim later superseded','PKT-0405','','',''],
  ['CC-0404','Duplicate wording A','PKT-0401','','',''],
  ['CC-0405','Duplicate wording B','PKT-0403','','',''],
  ['CC-0406','Merge input A','PKT-0404','','',''],
  ['CC-0407','Merge input B','PKT-0405','','',''],
  ['CC-0408','Rejected structural predecessor','PKT-0401','','',''],
  ['CC-0409','Excluded structural predecessor','PKT-0403','','',''],
  ['CC-0410','Intermediate split child A','PKT-0401','','',''],
  ['CC-0411','Intermediate split child B','PKT-0403','','',''],
  ['CC-0412','Replacement current claim','PKT-0404','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0413','Superseding current claim','PKT-0405','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0414','Canonical duplicate successor','PKT-0401, PKT-0403','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0415','Canonical merge successor','PKT-0404, PKT-0405','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0416','Second-generation split child','PKT-0401','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0417','Shared incoming successor','PKT-0401, PKT-0403','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0418','Bad merge input A','PKT-0404','','',''],
  ['CC-0419','Bad merge input B','PKT-0405','','',''],
  ['CC-0420','Historical bad merge successor','PKT-0404, PKT-0405','','',''],
  ['CC-0421','Corrected bad-merge child A','PKT-0404','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0422','Corrected bad-merge child B','PKT-0405','unresolved','current lineage identity','fixture-simulated-disposition'],
  ['CC-0423','Unaffected lineage-current sibling','PKT-0401','unresolved','current lineage identity','fixture-simulated-disposition'],
];
const claims = claimRows.map(([id,text,packets,disp,rationale,judge]) =>
  `| ${id} | ${text} | ${packets} | SRC-401 | factual | ${disp} | ${rationale} | ${judge} | | active |`).join('\n');
write('docs/fixtures/lineage-accounting/ledgers/claim-inventory.md', `# Candidate-Claim Inventory — RUN-lineage-accounting\n\n| claim_id | normalized claim | packets | sources | claim_type | disposition | rationale | judged_by | verified | status |\n|----------|------------------|---------|---------|------------|-------------|-----------|-----------|----------|--------|\n${claims}\n`);

write('docs/fixtures/lineage-accounting/ledgers/lineage.md', `# Unit Lineage — RUN-lineage-accounting\n\n- lineage_format: aleph-lineage/v1\n\n| lineage_id | owner_stage | type | predecessors | successors | basis | established_by |\n|------------|-------------|------|--------------|------------|-------|----------------|\n| LIN-0001 | S3 | split | CC-0401 | CC-0410, CC-0411 | original normalization contained two independently stateable claims | fixture-simulated-normalizer |\n| LIN-0002 | S3 | replace | CC-0402 | CC-0412 | corrected normalization establishes a new identity | fixture-simulated-normalizer |\n| LIN-0003 | S3 | supersede | CC-0403 | CC-0413 | later normalized identity overtakes predecessor | fixture-simulated-normalizer |\n| LIN-0004 | S4 | duplicate | CC-0404, CC-0405 | CC-0414 | same claim canonicalized with conserved provenance | fixture-simulated-merge-judge |\n| LIN-0005 | S4 | merge | CC-0406, CC-0407 | CC-0415 | distinct inputs intentionally form one successor | fixture-simulated-merge-judge |\n| LIN-0006 | S3 | reject | CC-0408 | none | structural claim candidate rejected with history retained | fixture-simulated-normalizer |\n| LIN-0007 | S3 | exclude | CC-0409 | none | structural claim candidate excluded with history retained | fixture-simulated-normalizer |\n| LIN-0008 | S3 | no-claim | PKT-0402 | none | packet yields no candidate claim | fixture-simulated-normalizer |\n| LIN-0009 | S3 | split | CC-0410 | CC-0416, CC-0417 | later correction refines the intermediate identity | fixture-simulated-normalizer |\n| LIN-0010 | S3 | supersede | CC-0411 | CC-0417 | sibling converges on the shared successor without compound N-to-M event | fixture-simulated-normalizer |\n| LIN-0011 | S4 | merge | CC-0418, CC-0419 | CC-0420 | historical merge retained for later correction exercise | fixture-simulated-merge-judge |\n| LIN-0012 | S3 | split | CC-0420 | CC-0421, CC-0422 | later unit correction preserves the prior merge as history | fixture-simulated-normalizer |\n`);

write('docs/fixtures/lineage-accounting/ledgers/merge-map.md', `# Duplicate / Merge Map — RUN-lineage-accounting\n\n| canonical | absorbs | basis | provenance retained | corroboration | status |\n|-----------|---------|-------|---------------------|---------------|--------|\n| CC-0414 | CC-0404, CC-0405 | same synthetic claim | SRC-401 | restatement | active |\n| CC-0415 | CC-0406, CC-0407 | synthetic merge exercise | SRC-401 | restatement | active |\n| CC-0420 | CC-0418, CC-0419 | historical bad merge retained | SRC-401 | restatement | active |\n`);
const currentIds = ['CC-0412','CC-0413','CC-0414','CC-0415','CC-0416','CC-0417','CC-0421','CC-0422','CC-0423'];
write('docs/fixtures/lineage-accounting/ledgers/disposition-ledger.md', `# Disposition Ledger — RUN-lineage-accounting\n\n| disposition | count | claim_ids |\n|-------------|-------|-----------|\n| carried | 0 | none |\n| merged | 0 | none |\n| deferred | 0 | none |\n| excluded-with-reason | 0 | none |\n| backgrounded | 0 | none |\n| judged-non-load-bearing | 0 | none |\n| unresolved | 9 | ${currentIds.join(', ')} |\n| **total** | **9** | all lineage-current claims accounted for |\n`);
write('docs/fixtures/lineage-accounting/ledgers/evidence-roles.md', `# Evidence-Role Ledger — RUN-lineage-accounting\n\n## Claim-source edges\n\n| claim_id | source_id | role | verification | removal_effect | note | status |\n|----------|-----------|------|--------------|----------------|------|--------|\n\n## Synthesis/inference markers\n\n| claim_id | inference basis (claim/packet ids) | uncertainty note |\n|----------|-------------------------------------|------------------|\n\n## Coverage accounting\n\n- carried+merged claims: 0\n- with ≥1 load-bearing or corroborative edge: 0\n- explicitly marked synthesis/inference: 0\n- NEITHER (must be 0 to pass): 0\n`);
write('docs/fixtures/lineage-accounting/ledgers/negative-boundaries.md', `# Negative Boundaries — RUN-lineage-accounting\n\n| boundary_id | claim_id | rule | reason | status |\n|-------------|----------|------|--------|--------|\n`);
write('docs/fixtures/lineage-accounting/ledgers/unresolved-queue.md', `# Unresolved Queue — RUN-lineage-accounting\n\nSynthetic unresolved current claims are represented in the current disposition ledger.\n`);
write('docs/fixtures/lineage-accounting/ledgers/external-referents.md', `# External Referents — RUN-lineage-accounting\n\n| ref_id | need/question | depends | status | supplied_by | intake | taint_note | note |\n|--------|---------------|---------|--------|-------------|--------|------------|------|\n`);
write('docs/fixtures/lineage-accounting/clusters/pre-cluster-tags.md', `# Structural Pre-Cluster Tags — RUN-lineage-accounting\n\n| tag | members | structural basis |\n|-----|---------|------------------|\n`);
write('docs/fixtures/lineage-accounting/clusters/route-cards/README.md', `# Route Cards\n\nNo route cards are needed for this structural lineage-current fixture.\n`);
write('docs/fixtures/lineage-accounting/arms/stress-test-matrix.md', `# Stress-Test Matrix — RUN-lineage-accounting\n\n| case id | target | result |\n|---------|--------|--------|\n`);
write('docs/fixtures/lineage-accounting/synthesis/cluster-synthesis.md', `# Cluster Synthesis — RUN-lineage-accounting\n\nNo stance-bearing synthesis is asserted by this structural fixture.\n`);

const precisRows = claimRows.filter(([id]) => currentIds.includes(id)).map(([id,text]) =>
  `| ${id} | ${text} | SRC-401 | unresolved |`).join('\n');
write('docs/fixtures/lineage-accounting/precis.md', `# Research Précis — RUN-lineage-accounting\n\n## 1. Scope\nSynthetic structural lineage accounting only.\n\n## 2. Source Inventory\n| source id | note |\n|-----------|------|\n| SRC-401 | synthetic frozen source |\n\n## 3. Method\nStructural fixture only.\n\n## 4. Candidate Claim Inventory\n| claim id | normalized claim | source(s) | disposition |\n|----------|------------------|-----------|-------------|\n${precisRows}\n\n## 5. Disposition Accounting\n| disposition | count | claim ids |\n|-------------|-------|-----------|\n| carried | 0 | none |\n| merged | 0 | none |\n| deferred | 0 | none |\n| excluded-with-reason | 0 | none |\n| backgrounded | 0 | none |\n| judged-non-load-bearing | 0 | none |\n| unresolved | 9 | ${currentIds.join(', ')} |\n| **total** | **9** | all lineage-current claims accounted for |\n\n## 6. Current Structural References\nCurrent lineage identities: ${currentIds.join(', ')}.\n\n## 7. Evidence Boundary\nNo truth claim is made by this fixture.\n\n## 8. Contradictions\nNone asserted.\n\n## 9. Uncertainty\nAll current claims remain unresolved.\n\n## 10. Structural Notes\nHistorical predecessors remain outside this current view.\n\n## 11. Duplicate and Merge Notes\nSemantic map history remains in the canonical ledgers.\n\n## 12. Routing\nNot exercised.\n\n## 13. Stress Testing\nNot exercised.\n\n## 14. Synthesis\nNot asserted.\n\n## 15. Verification\nStructural checker fixture only.\n\n## 16. Open Items\nNo additional item.\n\n## 17. Taint and Completeness\nNo external-referent claim is made.\n`);

// Recompute the copied source-walk review basis after the fixture-local criteria header changed.
{
  const { loadRun } = await import('../../scripts/lib/run-model.ts');
  const { sourceWalkReviewBasisDigest } = await import('../../scripts/lib/checks-k2.ts');
  let model = loadRun(fixture);
  for (const review of model.sourceWalk.gapReviews) {
    const digest = sourceWalkReviewBasisDigest(model, review.values.sourceId, review.values.reviewBasisCursorId);
    if (!digest) throw new Error(`cannot recompute review basis for ${review.values.gapReviewId}`);
    const path = 'docs/fixtures/lineage-accounting/ledgers/source-walk.md';
    const text = read(path);
    if (!text.includes(review.values.reviewBasisDigest)) throw new Error('old review basis digest not found');
    write(path, text.replace(review.values.reviewBasisDigest, digest));
    model = loadRun(fixture);
  }
}

// ---- dedicated lineage mutation battery ----
write('scripts/test-lineage-mutations.ts', `#!/usr/bin/env node\n\nimport { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';\nimport { tmpdir } from 'node:os';\nimport { dirname, join, resolve } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nimport { validateRun } from './validate-run.ts';\n\nconst ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');\nconst BASE = join(ROOT, 'docs/fixtures/lineage-accounting');\nlet passed = 0;\n\nfunction replaceOne(path: string, before: string, after: string): void {\n  const text = readFileSync(path, 'utf8');\n  const index = text.indexOf(before);\n  if (index < 0 || text.indexOf(before, index + before.length) >= 0) {\n    throw new Error(\`mutation anchor is not unique in \\${path}: \\${before}\`);\n  }\n  writeFileSync(path, text.slice(0, index) + after + text.slice(index + before.length));\n}\n\nfunction check(name: string, mutate: (run: string) => void): void {\n  const temp = mkdtempSync(join(tmpdir(), 'aleph-lineage-mutation-'));\n  const run = join(temp, 'run');\n  try {\n    cpSync(BASE, run, { recursive: true });\n    mutate(run);\n    const report = validateRun({ root: ROOT, run, kind: 'run' });\n    const lineageFailure = report.checks.some((row) => row.id === 'K2.15' && row.status === 'FAIL');\n    if (report.result !== 'FAIL' || !lineageFailure) {\n      throw new Error(\`expected K2.15 failure, got \\${JSON.stringify(report.checks)}\`);\n    }\n    console.log(\`PASS \\${name}\`);\n    passed++;\n  } finally {\n    rmSync(temp, { recursive: true, force: true });\n  }\n}\n\nconst baseline = validateRun({ root: ROOT, run: BASE, kind: 'run' });\nif (baseline.result !== 'PASS') throw new Error(\`lineage baseline failed: \\${JSON.stringify(baseline.checks)}\`);\nconsole.log('PASS baseline 1.3 lineage-current fixture');\npassed++;\n\nconst lineage = (run: string) => join(run, 'ledgers/lineage.md');\nconst claims = (run: string) => join(run, 'ledgers/claim-inventory.md');\nconst manifest = (run: string) => join(run, 'run-manifest.md');\n\ncheck('missing lineage artifact', (run) => rmSync(lineage(run)));\ncheck('missing lineage marker', (run) => replaceOne(lineage(run), '- lineage_format: aleph-lineage/v1\\n\\n', ''));\ncheck('duplicate LIN identity', (run) => replaceOne(lineage(run), '| LIN-0012 |', '| LIN-0001 |'));\ncheck('invalid lineage type', (run) => replaceOne(lineage(run), '| LIN-0001 | S3 | split |', '| LIN-0001 | S3 | fuse |'));\ncheck('invalid owner stage', (run) => replaceOne(lineage(run), '| LIN-0002 | S3 | replace |', '| LIN-0002 | S5 | replace |'));\ncheck('illegal split cardinality', (run) => replaceOne(lineage(run), 'CC-0410, CC-0411 | original normalization', 'CC-0410 | original normalization'));\ncheck('generic N-to-M shape rejected', (run) => replaceOne(lineage(run), 'CC-0415 | distinct inputs intentionally', 'CC-0415, CC-0416 | distinct inputs intentionally'));\ncheck('lineage self edge', (run) => replaceOne(lineage(run), '| LIN-0002 | S3 | replace | CC-0402 | CC-0412 |', '| LIN-0002 | S3 | replace | CC-0402 | CC-0402 |'));\ncheck('lineage cycle', (run) => replaceOne(lineage(run), 'CC-0416, CC-0417 | later correction', 'CC-0401, CC-0417 | later correction'));\ncheck('predecessor terminalized twice', (run) => replaceOne(lineage(run), '| LIN-0003 | S3 | supersede | CC-0403 |', '| LIN-0003 | S3 | supersede | CC-0402 |'));\ncheck('missing predecessor', (run) => replaceOne(lineage(run), '| LIN-0002 | S3 | replace | CC-0402 |', '| LIN-0002 | S3 | replace | CC-0999 |'));\ncheck('orphan successor', (run) => replaceOne(lineage(run), '| LIN-0003 | S3 | supersede | CC-0403 | CC-0413 |', '| LIN-0003 | S3 | supersede | CC-0403 | CC-0999 |'));\ncheck('terminal event with successor', (run) => replaceOne(lineage(run), '| LIN-0006 | S3 | reject | CC-0408 | none |', '| LIN-0006 | S3 | reject | CC-0408 | CC-0412 |'));\ncheck('no-claim applied to claim', (run) => replaceOne(lineage(run), '| LIN-0008 | S3 | no-claim | PKT-0402 | none |', '| LIN-0008 | S3 | no-claim | CC-0408 | none |'));\ncheck('packet to claim encoded as replacement', (run) => replaceOne(lineage(run), '| LIN-0002 | S3 | replace | CC-0402 | CC-0412 |', '| LIN-0002 | S3 | replace | PKT-0401 | CC-0412 |'));\ncheck('merge provenance loss', (run) => replaceOne(claims(run), '| CC-0414 | Canonical duplicate successor | PKT-0401, PKT-0403 |', '| CC-0414 | Canonical duplicate successor | PKT-0401 |'));\ncheck('split aggregate provenance loss', (run) => replaceOne(claims(run), '| CC-0411 | Intermediate split child B | PKT-0403 |', '| CC-0411 | Intermediate split child B | PKT-0401 |'));\ncheck('current claim cites non-current packet', (run) => replaceOne(claims(run), '| CC-0412 | Replacement current claim | PKT-0404 |', '| CC-0412 | Replacement current claim | PKT-0402 |'));\ncheck('silent packet disappearance', (run) => replaceOne(lineage(run), '| LIN-0008 | S3 | no-claim | PKT-0402 | none | packet yields no candidate claim | fixture-simulated-normalizer |\\n', ''));\ncheck('legacy 1.2 cannot be reinterpreted as lineage', (run) => replaceOne(manifest(run), '- run_format_version: 1.3.0-provisional', '- run_format_version: 1.2.0-provisional'));\ncheck('source identity cannot enter unit lineage', (run) => replaceOne(lineage(run), '| LIN-0002 | S3 | replace | CC-0402 | CC-0412 |', '| LIN-0002 | S3 | replace | SRC-401 | CC-0412 |'));\ncheck('empty lineage basis rejected', (run) => replaceOne(lineage(run), 'corrected normalization establishes a new identity | fixture-simulated-normalizer', 'none | fixture-simulated-normalizer'));\n\nconsole.log(\`RESULT: PASS (\\${passed}/\\${passed})\`);\n`);

// ---- package scripts ----
{
  const pkg = json('package.json');
  pkg.scripts['test:lineage-mutations'] = 'node scripts/test-lineage-mutations.ts';
  pkg.scripts.test = pkg.scripts.test.replace(
    'npm run test:mutations && npm run test:core-mutations',
    'npm run test:mutations && npm run test:lineage-mutations && npm run test:core-mutations',
  );
  writeJson('package.json', pkg);
}

// ---- manifest and adapter run-format pins ----
{
  const manifest = json('core.manifest.json');
  manifest.core.run_format_version = '1.3.0-provisional';
  const core = manifest.files.core;
  insertAfter(core, 'scripts/lib/checks-k2.ts', ['scripts/lib/checks-k2-lineage.ts']);
  insertAfter(core, 'scripts/lib/markdown.ts', ['scripts/lib/lineage.ts']);
  insertAfter(core, 'scripts/test-conformance-mutations.ts', ['scripts/test-lineage-mutations.ts']);
  insertAfter(core, 'runtime-js/scripts/lib/checks-k2.js', ['runtime-js/scripts/lib/checks-k2-lineage.js']);
  insertAfter(core, 'runtime-js/scripts/lib/markdown.js', ['runtime-js/scripts/lib/lineage.js']);
  const fixtureFiles = walkFiles(fixture);
  insertAfter(core, 'docs/fixtures/source-walk-accounting/run-manifest.md', fixtureFiles);

  const checker = manifest.checker_paths;
  insertAfter(checker, 'scripts/lib/checks-k2.ts', ['scripts/lib/checks-k2-lineage.ts']);
  insertAfter(checker, 'scripts/lib/markdown.ts', ['scripts/lib/lineage.ts']);
  insertAfter(checker, 'scripts/test-conformance-mutations.ts', ['scripts/test-lineage-mutations.ts']);
  insertAfter(checker, 'runtime-js/scripts/lib/checks-k2.js', ['runtime-js/scripts/lib/checks-k2-lineage.js']);
  insertAfter(checker, 'runtime-js/scripts/lib/markdown.js', ['runtime-js/scripts/lib/lineage.js']);
  writeJson('core.manifest.json', manifest);
}
for (const path of ['adapters/loa/adapter.manifest.json', 'adapters/hermes/adapter.manifest.json']) {
  const manifest = json(path);
  manifest.adapter.run_format_version = '1.3.0-provisional';
  writeJson(path, manifest);
}

console.log('Slice 3 source application complete.');
