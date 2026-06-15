#!/usr/bin/env node
// Aleph Slice 3 — v0 Précis Conformance Checker
//
// A narrow, dependency-free, local conformance checker over the already-accepted
// Markdown Précis fixtures (Slice 1 + Slice 2). Node built-ins only. Reads files,
// writes nothing, mutates no repo state, needs no network. Fails closed (non-zero
// exit) on a real invariant violation.
//
// It validates the REAL Aleph invariant:
//   - the Précis does not GENERATE downstream projections,
//   - the corpus does not LEAK answer-key / disposition labels,
//   - no candidate claim is silently dropped (accounting balances).
// It does NOT validate the false invariant that the words PRD / GTM / product
// spec / schema freeze / unresolved / disposition may never appear — they are
// allowed in ordinary prose and in explicit refusal / boundary contexts.
//
// Run:  node scripts/validate-precis-fixtures.mjs

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const FIXTURES_DIR = join(REPO_ROOT, 'docs', 'fixtures');

// ---------------------------------------------------------------------------
// Constants: the accepted provisional v0 vocabulary (NOT a frozen schema)
// ---------------------------------------------------------------------------

const VALID_DISPOSITIONS = [
  'carried',
  'merged',
  'deferred',
  'excluded-with-reason',
  'backgrounded',
  'judged-non-load-bearing',
  'unresolved',
];

// Absolute zero-tolerance tokens — hard failure anywhere under a fixture dir.
const ABSOLUTE_FORBIDDEN = [
  { label: 'Phase', re: /\bphase\b/i },
  { label: 'Sensenet', re: /\bsensenet\b/i },
];

// Per-slice expectations.
const SLICES = [
  {
    name: 'slice-1',
    srcIds: ['SRC-001', 'SRC-002', 'SRC-003'],
    claimIds: range(1, 10).map((n) => `CC-${String(n).padStart(3, '0')}`),
    ledgerTotal: 10,
    requireMatrix: false,
  },
  {
    name: 'slice-2',
    srcIds: ['SRC-101', 'SRC-102', 'SRC-103', 'SRC-104'],
    claimIds: range(101, 114).map((n) => `CC-${n}`),
    ledgerTotal: 14,
    requireMatrix: true,
    matrixIds: range(1, 7).map((n) => `STM-${n}`),
  },
];

const EXPECTED_FILES = ['README.md', 'corpus.md', 'precis.md'];

// ---------------------------------------------------------------------------
// Projection-boundary vocabulary (context-aware, NOT naive word absence)
// ---------------------------------------------------------------------------

// Downstream-artifact nouns. Presence alone is fine; only generation matters.
const PROJECTION_TERMS = [
  /\bPRD\b/,
  /\bGTM\b/,
  /\bmarket landscape\b/i,
  /\bproduct spec\b/i,
  /\bpitch deck\b/i,
  /\bdownstream projection\b/i,
  /\badjacent-consumer formalization\b/i,
  /\bprojection\b/i,
];

// Verbs that imply GENERATING / PRODUCING / FORMALIZING such an artifact.
// Note: precise verb inflections only — must NOT match the nouns "product"
// (in "product spec") or "deliverable", which legitimately appear in refusal prose.
const GENERATION_VERBS =
  /\b(generat(?:e|es|ing|ed|ion)|produc(?:e|es|ing|ed|tion)|emit(?:s|ting|ted)?|formaliz(?:e|es|ing|ed|ation)|render(?:s|ed|ing)? into|ship(?:s|ped|ping)?|deliver(?:s|ed|ing)?\b|projects|projecting|project into)\b/i;

// Cues that mark a line (or its immediate context) as a refusal / boundary /
// hypothetical / negation — i.e. NOT an actual generation assertion.
const EXEMPTION_CUES =
  /\b(no|not|never|none|neither|without|deliberately|cannot|can't|don't|could|would|should not|stops?|stopped|refus\w*|deferred?|projection-neutral)\b|out[ -]of[ -]scope/i;

// Real-export markers (genuine ChatGPT export artifacts) — must not appear.
const REAL_EXPORT_MARKERS = [/chatgpt said:/i, /\[oai_citation/i, /^\s*user:\s*$/i];

// ---------------------------------------------------------------------------
// Corpus answer-key / label-leakage detectors (corpus.md only)
// ---------------------------------------------------------------------------

const CORPUS_LEAKS = [
  { label: 'candidate-claim ID (CC-NNN)', re: /\bCC-\d{3}\b/ },
  { label: 'stress-test-matrix ID (STM-N)', re: /\bSTM-\d+\b/ },
  { label: 'phrase "candidate claim"', re: /\bcandidate claim\b/i },
  { label: 'phrase "stress-test matrix"', re: /\bstress-test matrix\b/i },
  { label: 'compound disposition "excluded-with-reason"', re: /\bexcluded-with-reason\b/i },
  { label: 'compound disposition "judged-non-load-bearing"', re: /\bjudged-non-load-bearing\b/i },
  { label: 'disposition label ("disposition: <value>")', re: /\bdisposition:\s*\S/i },
  { label: 'disposition column header ("| disposition |")', re: /\|\s*disposition\s*\|/i },
];

// ---------------------------------------------------------------------------
// Result accumulation
// ---------------------------------------------------------------------------

const failures = [];
const passes = [];
function fail(msg) { failures.push(msg); }
function pass(msg) { passes.push(msg); }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function range(a, b) {
  const out = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

function readMaybe(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

// Return the body of numbered envelope section `n` (## n. ...) up to the next
// "## " heading. Returns '' if not found.
function envelopeSection(text, n) {
  const lines = text.split('\n');
  const startRe = new RegExp(`^##\\s+${n}\\.\\s`);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startRe.test(lines[i])) { start = i; break; }
  }
  if (start === -1) return '';
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start, end).join('\n');
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function checkFilesPresentAndMarkdown(slice, dir) {
  // Expected files exist.
  for (const f of EXPECTED_FILES) {
    if (!existsSync(join(dir, f))) {
      fail(`${slice.name} files: expected fixture file "${f}" is missing`);
    }
  }
  // Every entry in the fixture dir is a Markdown file.
  let entries = [];
  try { entries = readdirSync(dir); } catch {
    fail(`${slice.name} files: fixture directory "${dir}" is unreadable`);
    return;
  }
  for (const e of entries) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      fail(`${slice.name} files: unexpected subdirectory "${e}" (fixtures are flat Markdown only)`);
      continue;
    }
    if (!e.endsWith('.md')) {
      fail(`${slice.name} files: non-Markdown file "${e}" present (fixtures must be Markdown only)`);
    }
  }
  if (!failures.some((m) => m.startsWith(`${slice.name} files`))) {
    pass(`${slice.name} files: README.md, corpus.md, precis.md present; Markdown-only`);
  }
}

function checkAbsoluteForbidden(slice, dir) {
  const entries = readdirSync(dir).filter((e) => e.endsWith('.md'));
  let hit = false;
  for (const e of entries) {
    const text = readFileSync(join(dir, e), 'utf8');
    const lines = text.split('\n');
    for (const { label, re } of ABSOLUTE_FORBIDDEN) {
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) {
          hit = true;
          fail(`${slice.name} forbidden token: "${label}" found in ${e}:${i + 1} -> ${lines[i].trim()}`);
        }
      }
    }
  }
  if (!hit) pass(`${slice.name} forbidden tokens: zero Phase / Sensenet occurrences`);
}

function checkProjectionBoundary(slice, dir) {
  let hit = false;
  for (const f of ['precis.md', 'README.md']) {
    const text = readMaybe(join(dir, f));
    if (text === null) continue;
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const hasTerm = PROJECTION_TERMS.some((re) => re.test(line));
      if (!hasTerm) continue;
      const hasGenVerb = GENERATION_VERBS.test(line);
      if (!hasGenVerb) continue; // naming a projection is fine; only generation matters

      // Exemption is judged on the LINE ITSELF — a refusal/negation/hypothetical
      // cue must sit on the same line as the projection+generation assertion.
      // (A blanket heading- or context-window exemption is too loose: it would
      // let an unqualified "This Precis generates a PRD" pass merely because it
      // landed under a boundary heading. Real fixtures always negate inline.)
      if (EXEMPTION_CUES.test(line)) continue;

      hit = true;
      fail(`${slice.name} projection boundary: ${f}:${i + 1} appears to GENERATE a downstream projection rather than refuse it -> ${line.trim()}`);
    }
    // Real-export markers.
    for (let i = 0; i < lines.length; i++) {
      for (const re of REAL_EXPORT_MARKERS) {
        if (re.test(lines[i])) {
          hit = true;
          fail(`${slice.name} real-export marker: ${f}:${i + 1} -> ${lines[i].trim()}`);
        }
      }
    }
  }
  if (!hit) pass(`${slice.name} projection boundary: no downstream-projection generation / no real-export markers`);
}

function checkSchemaWording(slice, dir) {
  const precis = readMaybe(join(dir, 'precis.md')) || '';
  const readme = readMaybe(join(dir, 'README.md')) || '';
  const blob = `${precis}\n${readme}`;
  const re = /no schema freeze|no schema is frozen|not a final schema|accepted provisional v0 envelope|field structure is provisional/i;
  if (re.test(blob)) {
    pass(`${slice.name} schema wording: explicitly rejects schema finality (provisional v0)`);
  } else {
    fail(`${slice.name} schema wording: no explicit "no schema freeze" / provisional-envelope disclaimer found in precis.md or README.md`);
  }
}

function checkCorpusBoundary(slice, dir) {
  const text = readMaybe(join(dir, 'corpus.md'));
  if (text === null) { fail(`${slice.name} corpus boundary: corpus.md missing`); return; }
  const lines = text.split('\n');
  let hit = false;

  // Required source IDs present.
  for (const id of slice.srcIds) {
    if (!new RegExp(`\\b${id}\\b`).test(text)) {
      hit = true;
      fail(`${slice.name} corpus boundary: required source id ${id} not found in corpus.md`);
    }
  }

  // Answer-key / label leakage.
  for (let i = 0; i < lines.length; i++) {
    for (const { label, re } of CORPUS_LEAKS) {
      if (re.test(lines[i])) {
        hit = true;
        fail(`${slice.name} corpus boundary: ${label} leaked in corpus.md:${i + 1} -> ${lines[i].trim()}`);
      }
    }
    // Disposition CLASSIFICATION row: a pipe line carrying >= 2 disposition labels.
    if (lines[i].includes('|')) {
      const cells = lines[i].split('|').map((c) => c.trim().toLowerCase());
      const found = VALID_DISPOSITIONS.filter((d) => cells.includes(d));
      if (found.length >= 2) {
        hit = true;
        fail(`${slice.name} corpus boundary: disposition classification row leaked in corpus.md:${i + 1} -> ${lines[i].trim()}`);
      }
    }
  }
  if (!hit) pass(`${slice.name} corpus boundary: source IDs present; no answer-key/label leakage`);
}

function checkEnvelope17(slice, dir) {
  const text = readMaybe(join(dir, 'precis.md'));
  if (text === null) { fail(`${slice.name} envelope: precis.md missing`); return; }
  const present = new Set();
  for (const line of text.split('\n')) {
    const m = line.match(/^##\s+(\d+)\.\s/);
    if (m) present.add(Number(m[1]));
  }
  const missing = range(1, 17).filter((n) => !present.has(n));
  if (missing.length === 0) {
    pass(`${slice.name} envelope: all 17 accepted provisional v0 sections present`);
  } else {
    fail(`${slice.name} envelope: missing v0 envelope section(s) ${missing.join(', ')} (of 17)`);
  }
}

// Parse the §4 candidate-claim inventory table. Returns { ids:[], map: id->disposition }.
function parseInventory(precisText) {
  const body = envelopeSection(precisText, 4);
  const ids = [];
  const map = new Map();
  for (const line of body.split('\n')) {
    // inventory row: | CC-NNN | normalized claim | source(s) | disposition |
    const m = line.match(/^\|\s*(CC-\d{3})\s*\|.*\|\s*([a-zA-Z-]+)\s*\|\s*$/);
    if (m) {
      ids.push(m[1]);
      map.set(m[1], m[2].trim());
    }
  }
  return { ids, map };
}

// Parse the §5 disposition ledger. Returns { declaredTotal, counts: Map }.
function parseLedger(precisText) {
  const body = envelopeSection(precisText, 5);
  const counts = new Map();
  let declaredTotal = null;
  for (const line of body.split('\n')) {
    const tot = line.match(/\|\s*\*\*total\*\*\s*\|\s*\*\*(\d+)\*\*/i);
    if (tot) { declaredTotal = Number(tot[1]); continue; }
    const m = line.match(/^\|\s*([a-z-]+)\s*\|\s*(\d+)\s*\|/);
    if (m && VALID_DISPOSITIONS.includes(m[1])) {
      counts.set(m[1], Number(m[2]));
    }
  }
  return { declaredTotal, counts };
}

function checkInventoryAndAccounting(slice, dir) {
  const text = readMaybe(join(dir, 'precis.md'));
  if (text === null) { fail(`${slice.name} inventory: precis.md missing`); return; }

  const { ids, map } = parseInventory(text);

  // Unique IDs.
  const dupes = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  if (dupes.length) fail(`${slice.name} inventory: duplicate candidate-claim ID(s): ${[...new Set(dupes)].join(', ')}`);

  // Exact expected ID set.
  const idSet = new Set(ids);
  const missing = slice.claimIds.filter((id) => !idSet.has(id));
  const extra = ids.filter((id) => !slice.claimIds.includes(id));
  if (missing.length) fail(`${slice.name} inventory: missing candidate claim(s): ${missing.join(', ')}`);
  if (extra.length) fail(`${slice.name} inventory: unexpected candidate claim(s): ${extra.join(', ')}`);

  // Every claim has exactly one valid disposition.
  for (const [id, disp] of map.entries()) {
    if (!VALID_DISPOSITIONS.includes(disp)) {
      fail(`${slice.name} inventory: claim ${id} has invalid disposition "${disp}"`);
    }
  }

  // Disposition coverage: all seven appear at least once.
  const seen = new Set(map.values());
  const uncovered = VALID_DISPOSITIONS.filter((d) => !seen.has(d));
  if (uncovered.length) {
    fail(`${slice.name} coverage: disposition(s) never used: ${uncovered.join(', ')}`);
  }

  // Accounting (1): inventory count == declared ledger total.
  const { declaredTotal, counts } = parseLedger(text);
  const invCount = ids.length;
  if (declaredTotal === null) {
    fail(`${slice.name} accounting: no declared ledger total (** total ** row) found in §5`);
  } else if (declaredTotal !== invCount) {
    fail(`${slice.name} accounting: disposition ledger total ${declaredTotal} does not equal inventory count ${invCount}`);
  }
  if (slice.ledgerTotal !== invCount) {
    fail(`${slice.name} accounting: inventory count ${invCount} does not match expected ${slice.ledgerTotal}`);
  }

  // Accounting (2): sum of ledger disposition counts == inventory count.
  let ledgerSum = 0;
  for (const v of counts.values()) ledgerSum += v;
  if (ledgerSum !== invCount) {
    fail(`${slice.name} accounting: ledger disposition counts sum to ${ledgerSum}, not inventory count ${invCount}`);
  }

  // Accounting (3): per-disposition declared count == actual inventory count.
  const actual = new Map();
  for (const disp of map.values()) actual.set(disp, (actual.get(disp) || 0) + 1);
  for (const disp of VALID_DISPOSITIONS) {
    const declared = counts.get(disp) || 0;
    const real = actual.get(disp) || 0;
    if (declared !== real) {
      fail(`${slice.name} accounting: disposition "${disp}" declared ${declared} in ledger but ${real} in inventory`);
    }
  }

  if (!failures.some((m) => m.startsWith(`${slice.name} inventory`) || m.startsWith(`${slice.name} accounting`) || m.startsWith(`${slice.name} coverage`))) {
    pass(`${slice.name} inventory & accounting: ${invCount} unique claims, each one valid disposition, all 7 dispositions covered, ledger balances (${invCount}=${invCount})`);
  }
}

function checkStressMatrix(slice, dir) {
  if (!slice.requireMatrix) return;
  const text = readMaybe(join(dir, 'precis.md'));
  if (text === null) { fail(`${slice.name} matrix: precis.md missing`); return; }
  let hit = false;
  if (!/^##\s+stress-test matrix\s*$/im.test(text)) {
    hit = true;
    fail(`${slice.name} matrix: no clearly named "## Stress-test matrix" section`);
  }
  for (const id of slice.matrixIds) {
    if (!new RegExp(`\\b${id}\\b`).test(text)) {
      hit = true;
      fail(`${slice.name} matrix: required stress-test row ${id} not found`);
    }
  }
  if (!hit) pass(`${slice.name} matrix: stress-test matrix present with STM-1..STM-7`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('Aleph Slice 3 — v0 Précis Conformance Checker');
console.log('(validates the accepted provisional v0 envelope; this is NOT a schema freeze)\n');

if (!existsSync(FIXTURES_DIR)) {
  console.error(`FAIL: fixtures directory not found at ${FIXTURES_DIR}`);
  process.exit(1);
}

for (const slice of SLICES) {
  const dir = join(FIXTURES_DIR, slice.name);
  if (!existsSync(dir)) {
    fail(`${slice.name}: fixture directory missing at ${dir}`);
    continue;
  }
  checkFilesPresentAndMarkdown(slice, dir);
  checkAbsoluteForbidden(slice, dir);
  checkProjectionBoundary(slice, dir);
  checkSchemaWording(slice, dir);
  checkCorpusBoundary(slice, dir);
  checkEnvelope17(slice, dir);
  checkInventoryAndAccounting(slice, dir);
  checkStressMatrix(slice, dir);
}

console.log('PASSED CHECKS:');
for (const p of passes) console.log(`  PASS ${p}`);
console.log('');

if (failures.length) {
  console.log('FAILURES:');
  for (const f of failures) console.log(`  FAIL ${f}`);
  console.log(`\nRESULT: FAIL (${failures.length} failure${failures.length === 1 ? '' : 's'})`);
  process.exit(1);
}

console.log(`RESULT: PASS — both fixtures conform to the accepted provisional v0 envelope.`);
process.exit(0);
