#!/usr/bin/env node
// Aleph Slice 3 — v0 Précis Conformance Checker
//
// A narrow, dependency-free, local conformance checker over the already-accepted
// Markdown Précis fixtures (Slice 1 + Slice 2). Node built-ins only. Reads files,
// writes nothing, mutates no repo state, needs no network, spawns no subprocess.
// Fails closed (non-zero exit) on a real invariant violation.
//
// It validates the REAL Aleph invariant:
//   - the Précis does not GENERATE downstream projections,
//   - the corpus does not LEAK answer-key / disposition labels,
//   - no candidate claim is silently dropped (accounting balances).
// It does NOT validate the false invariant that the words PRD / GTM / product
// spec / schema freeze / unresolved / disposition may never appear — they are
// allowed in ordinary prose and in explicit refusal / boundary contexts.
//
// Run:
//   node scripts/validate-precis-fixtures.mjs
//   node scripts/validate-precis-fixtures.mjs --root /tmp/some-copy
// (--root points at a directory that contains docs/fixtures/… ; used by the
//  negative-test battery to run THIS checker against temporary copies without
//  ever mutating tracked fixtures.)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = join(__dirname, '..');

function parseRoot() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root') return args[i + 1];
    if (args[i].startsWith('--root=')) return args[i].slice('--root='.length);
  }
  return DEFAULT_ROOT;
}

const REPO_ROOT = parseRoot();
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

// The EXACT set of direct entries allowed in a fixture directory.
const EXPECTED_FILES = ['README.md', 'corpus.md', 'precis.md'];

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

// Cues that mark a line as a genuine refusal / negation / boundary / hypothetical
// — i.e. NOT an actual generation assertion. NOTE: "deliberately" is deliberately
// NOT in this list: "deliberately generates a PRD" is still generation. The cue
// must be a real negation / refusal / hypothetical word.
const EXEMPTION_CUES =
  /\b(no|not|never|none|neither|nor|without|cannot|can't|don't|doesn't|won't|could|would|may|might|should not|stops?|stopped|refus\w*|defer(?:s|red|ring)?|projection-neutral)\b|out[ -]of[ -]scope/i;

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
function sliceHasFailure(name, ...prefixes) {
  return failures.some((m) => prefixes.some((p) => m.startsWith(`${name} ${p}`)));
}

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

// Split a Markdown table row into trimmed content cells (drops the leading and
// trailing empty cells produced by the outer pipes). Returns null if the line
// is not a pipe-delimited row.
function tableCells(line) {
  if (!line.includes('|')) return null;
  const raw = line.split('|');
  // A well-formed row starts and ends with '|', so first/last split parts are ''.
  if (raw.length < 3) return null;
  const inner = raw.slice(1, raw.length - 1).map((c) => c.trim());
  return inner;
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((c) => /^:?-{3,}:?$/.test(c.replace(/\s/g, '')) || /^-+$/.test(c));
}

// Return the body of numbered envelope section `n` (## n. ...) up to the next
// "## " heading. Returns '' if not found.
function envelopeSection(text, n) {
  return headingSection(text, new RegExp(`^##\\s+${n}\\.\\s`));
}

// Return the body of the first heading matching `startRe`, up to the next
// same-or-higher-level "## " heading. Includes the heading line itself.
function headingSection(text, startRe) {
  const lines = text.split('\n');
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

// FIX 1: require the EXACT file set — reject any extra direct entry (incl .md).
function checkFilesPresentAndMarkdown(slice, dir) {
  let entries = [];
  try { entries = readdirSync(dir); } catch {
    fail(`${slice.name} files: fixture directory "${dir}" is unreadable`);
    return;
  }
  const expected = new Set(EXPECTED_FILES);
  const present = new Set();

  for (const e of entries) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      fail(`${slice.name} files: unexpected subdirectory "${e}" (fixtures are flat: README.md, corpus.md, precis.md only)`);
      continue;
    }
    if (!expected.has(e)) {
      fail(`${slice.name} files: unexpected extra entry "${e}" (fixture dir must contain exactly README.md, corpus.md, precis.md)`);
      continue;
    }
    present.add(e);
  }
  for (const f of EXPECTED_FILES) {
    if (!present.has(f)) fail(`${slice.name} files: required fixture file "${f}" is missing`);
  }
  if (!sliceHasFailure(slice.name, 'files')) {
    pass(`${slice.name} files: exactly README.md, corpus.md, precis.md present; Markdown-only`);
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

      // Exemption is judged on the LINE ITSELF and requires a genuine
      // negation / refusal / hypothetical cue — not merely a word like
      // "deliberately". "deliberately generates a PRD" is still generation.
      if (EXEMPTION_CUES.test(line)) continue;

      hit = true;
      fail(`${slice.name} projection boundary: ${f}:${i + 1} appears to GENERATE a downstream projection rather than refuse it -> ${line.trim()}`);
    }
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

  for (const id of slice.srcIds) {
    if (!new RegExp(`\\b${id}\\b`).test(text)) {
      hit = true;
      fail(`${slice.name} corpus boundary: required source id ${id} not found in corpus.md`);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    for (const { label, re } of CORPUS_LEAKS) {
      if (re.test(lines[i])) {
        hit = true;
        fail(`${slice.name} corpus boundary: ${label} leaked in corpus.md:${i + 1} -> ${lines[i].trim()}`);
      }
    }
    // Disposition CLASSIFICATION row: a pipe line carrying >= 2 disposition labels.
    const cells = tableCells(lines[i]);
    if (cells) {
      const lc = cells.map((c) => c.toLowerCase());
      const found = VALID_DISPOSITIONS.filter((d) => lc.includes(d));
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

// FIX 2: parse §4 inventory rows STRICTLY as 4-column Markdown table rows.
// Reject too many / too few cells, missing/invalid disposition, or more than
// one valid disposition appearing across the row's cells.
function parseInventory(slice, precisText) {
  const body = envelopeSection(precisText, 4);
  const ids = [];
  const map = new Map();
  for (const rawLine of body.split('\n')) {
    const cells = tableCells(rawLine);
    if (!cells) continue;
    if (isSeparatorRow(cells)) continue;
    // header row: first cell is the literal column name
    if (/^claim[_ ]?id$/i.test(cells[0])) continue;
    // Only treat as a candidate row if it carries a CC-id anywhere.
    const looksLikeClaim = cells.some((c) => /\bCC-\d{3}\b/.test(c));
    if (!looksLikeClaim) continue;

    if (cells.length !== 4) {
      fail(`${slice.name} inventory: malformed candidate row (expected exactly 4 columns, got ${cells.length}) -> ${rawLine.trim()}`);
      continue;
    }
    const id = cells[0];
    if (!/^CC-\d{3}$/.test(id)) {
      fail(`${slice.name} inventory: candidate row id column is not a bare CC-NNN id -> ${rawLine.trim()}`);
      continue;
    }
    // Count valid dispositions across ALL cells; must be exactly one, in col 4.
    const dispInCells = cells.filter((c) => VALID_DISPOSITIONS.includes(c.toLowerCase()));
    if (dispInCells.length !== 1) {
      fail(`${slice.name} inventory: candidate ${id} must have exactly one valid disposition cell, found ${dispInCells.length} (${dispInCells.join(', ') || 'none'}) -> ${rawLine.trim()}`);
      continue;
    }
    const disp = cells[3].toLowerCase();
    if (!VALID_DISPOSITIONS.includes(disp)) {
      fail(`${slice.name} inventory: candidate ${id} disposition column "${cells[3]}" is not a valid disposition -> ${rawLine.trim()}`);
      continue;
    }
    ids.push(id);
    map.set(id, disp);
  }
  return { ids, map };
}

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

  const { ids, map } = parseInventory(slice, text);

  const dupes = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  if (dupes.length) fail(`${slice.name} inventory: duplicate candidate-claim ID(s): ${[...new Set(dupes)].join(', ')}`);

  const idSet = new Set(ids);
  const missing = slice.claimIds.filter((id) => !idSet.has(id));
  const extra = ids.filter((id) => !slice.claimIds.includes(id));
  if (missing.length) fail(`${slice.name} inventory: missing candidate claim(s): ${missing.join(', ')}`);
  if (extra.length) fail(`${slice.name} inventory: unexpected candidate claim(s): ${extra.join(', ')}`);

  for (const [id, disp] of map.entries()) {
    if (!VALID_DISPOSITIONS.includes(disp)) {
      fail(`${slice.name} inventory: claim ${id} has invalid disposition "${disp}"`);
    }
  }

  const seen = new Set(map.values());
  const uncovered = VALID_DISPOSITIONS.filter((d) => !seen.has(d));
  if (uncovered.length) {
    fail(`${slice.name} coverage: disposition(s) never used: ${uncovered.join(', ')}`);
  }

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

  let ledgerSum = 0;
  for (const v of counts.values()) ledgerSum += v;
  if (ledgerSum !== invCount) {
    fail(`${slice.name} accounting: ledger disposition counts sum to ${ledgerSum}, not inventory count ${invCount}`);
  }

  const actual = new Map();
  for (const disp of map.values()) actual.set(disp, (actual.get(disp) || 0) + 1);
  for (const disp of VALID_DISPOSITIONS) {
    const declared = counts.get(disp) || 0;
    const real = actual.get(disp) || 0;
    if (declared !== real) {
      fail(`${slice.name} accounting: disposition "${disp}" declared ${declared} in ledger but ${real} in inventory`);
    }
  }

  if (!sliceHasFailure(slice.name, 'inventory', 'accounting', 'coverage')) {
    pass(`${slice.name} inventory & accounting: ${invCount} unique claims, each exactly one valid disposition, all 7 dispositions covered, ledger balances (${invCount}=${invCount})`);
  }
}

// FIX 3: STM rows must be ACTUAL table rows inside the isolated matrix section.
function checkStressMatrix(slice, dir) {
  if (!slice.requireMatrix) return;
  const text = readMaybe(join(dir, 'precis.md'));
  if (text === null) { fail(`${slice.name} matrix: precis.md missing`); return; }

  const section = headingSection(text, /^##\s+stress-test matrix\s*$/i);
  if (!section) {
    fail(`${slice.name} matrix: no clearly named "## Stress-test matrix" section`);
    return;
  }

  // Collect STM ids that appear as the FIRST cell of a table row in the section.
  const rowCounts = new Map();
  for (const line of section.split('\n')) {
    const cells = tableCells(line);
    if (!cells || isSeparatorRow(cells)) continue;
    const m = cells[0].match(/^(STM-\d+)$/);
    if (m) rowCounts.set(m[1], (rowCounts.get(m[1]) || 0) + 1);
  }

  let hit = false;
  for (const id of slice.matrixIds) {
    const c = rowCounts.get(id) || 0;
    if (c === 0) {
      hit = true;
      fail(`${slice.name} matrix: required stress-test row ${id} not present as a table row in the matrix section`);
    } else if (c > 1) {
      hit = true;
      fail(`${slice.name} matrix: stress-test row ${id} appears ${c} times as a matrix row (expected exactly once)`);
    }
  }
  if (!hit) pass(`${slice.name} matrix: stress-test matrix section present with table rows STM-1..STM-7 (each once)`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('Aleph Slice 3 — v0 Précis Conformance Checker');
console.log('(validates the accepted provisional v0 envelope; this is NOT a schema freeze)');
if (REPO_ROOT !== DEFAULT_ROOT) console.log(`(root override: ${REPO_ROOT})`);
console.log('');

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
