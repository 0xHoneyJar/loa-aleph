import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sourceFilePath } from './check-helpers.js';
import { runK2 } from './checks-k2.js';
import { parseTables, parseBulletFields } from './markdown.js';
import { hasRunCapability, parseSourceWalk } from './run-model.js';
import { ResultCollector } from './results.js';
export const SOURCE_WALK_PATH = 'ledgers/source-walk.md';
const digest = (bytes) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
function requireWalk(condition, why) {
    if (!condition)
        throw new Error(`WORK_SOURCE_COMPLETION ${why}`);
}
function gapIds(value) {
    if (value === 'none')
        return [];
    const ids = value.split(',').map((id) => id.trim());
    requireWalk(ids.every((id) => /^GAP-\d+$/u.test(id)) && new Set(ids).size === ids.length, 'invalid prior gap IDs');
    return ids;
}
/** A read-only model projection for the one fixed Core source-walk artifact. */
export function projectSourceWalk(model, text) {
    const document = {
        path: join(model.runDir, SOURCE_WALK_PATH), relativePath: SOURCE_WALK_PATH,
        text, lines: text.split('\n'), tables: parseTables(text, SOURCE_WALK_PATH), bullets: parseBulletFields(text),
    };
    return { ...model, sourceWalkDocument: document, sourceWalk: parseSourceWalk(document),
        documents: new Map([...model.documents, [SOURCE_WALK_PATH, document]]),
        files: [...model.files.filter((file) => file.relativePath !== SOURCE_WALK_PATH),
            { path: document.path, relativePath: SOURCE_WALK_PATH, text }] };
}
function withCompletionRows(model, rows) {
    const table = model.sourceWalk.completionTable;
    requireWalk(table, 'missing Per-source completion table');
    const matches = model.sourceWalkDocument.tables.filter((entry) => entry.normalizedHeader.join('\0') === table.normalizedHeader.join('\0'));
    requireWalk(matches.length === 1, 'duplicate Per-source completion table');
    const lines = model.sourceWalkDocument.text.split('\n');
    // Markdown table and row line numbers are one-based.
    lines.splice(table.line + 1, table.rows.length, ...rows);
    return projectSourceWalk(model, lines.join('\n'));
}
function k214(model) {
    const result = new ResultCollector('source completion transition');
    runK2(result, model, join(model.runDir, 'control/runtime/bundle'));
    return result.checks.filter((check) => check.id === 'K2.14' && check.status === 'FAIL').map((check) => check.message);
}
function retainedHistory(before, after) {
    for (const key of ['intervals', 'events', 'cursors', 'gapReviews']) {
        const prior = before.sourceWalk[key], next = after.sourceWalk[key];
        requireWalk(prior.length <= next.length && prior.every((row, index) => row.raw === next[index].raw), `${key} history must remain an exact ordered prefix`);
    }
    if (before.sourceWalkDocument) {
        const scaffold = (model) => {
            const dataLines = new Set(model.sourceWalkDocument.tables.flatMap((table) => table.rows.map((row) => row.line)));
            return model.sourceWalkDocument.lines.filter((_, index) => !dataLines.has(index + 1)).join('\n');
        };
        requireWalk(scaffold(before) === scaffold(after), 'source-walk headers and non-row bytes changed');
    }
}
function row(values) {
    requireWalk(values.every((value) => !/[|\r\n]/u.test(value)), 'invalid mechanically generated cell');
    return `| ${values.join(' | ')} |`;
}
/**
 * The only replacement permitted by HUMAN C-02. Proposed historical evidence
 * must already be Core-derived; this function never accepts a desired state,
 * note, actor, destination or completion row from a worker/caller.
 */
export function deriveSourceWalkCompletion(before, history) {
    requireWalk(hasRunCapability(before.manifest?.runFormatVersion || '', 'orchestrator-work-transitions')
        && before.manifest?.runFormatVersion === history.manifest?.runFormatVersion
        && before.manifest?.runId === history.manifest?.runId, '1.9 orchestration identity required');
    requireWalk(before.corpus.sources.length === history.corpus.sources.length
        && before.corpus.sources.every((source, index) => {
            const next = history.corpus.sources[index].values;
            return source.values.sourceId === next.sourceId && source.values.locus === next.locus
                && source.values.contentHash === next.contentHash && source.values.scheme === next.scheme;
        }), 'frozen source identity changed');
    retainedHistory(before, history);
    if (before.sourceWalkDocument) {
        const invalid = k214(before);
        requireWalk(invalid.length === 0, `invalid prior source-walk evidence: ${invalid.join('; ')}`);
    }
    const old = new Map(before.sourceWalk.completions.map((entry) => [entry.values.sourceId, entry]));
    requireWalk(old.size === before.sourceWalk.completions.length, 'duplicate prior completion row');
    requireWalk(new Set(history.sourceWalk.completions.map((entry) => entry.values.sourceId)).size === history.sourceWalk.completions.length, 'duplicate proposed completion row');
    const sourceIds = history.corpus.sources.map((source) => source.values.sourceId);
    requireWalk([...old.keys(), ...history.sourceWalk.completions.map((entry) => entry.values.sourceId)]
        .every((id) => sourceIds.includes(id)), 'completion source does not resolve');
    const rows = [];
    const projections = [];
    // Preserve existing projection row order, adding newly applicable sources
    // in frozen manifest order. Never normalize retained rows by sorting them.
    const orderedSources = [...old.keys(), ...sourceIds.filter((id) => !old.has(id))]
        .map((id) => history.corpus.sources.find((source) => source.values.sourceId === id));
    for (const source of orderedSources) {
        const id = source.values.sourceId, previous = old.get(id);
        const path = sourceFilePath(history.runDir, source.values.locus);
        requireWalk(path, `${id} frozen locus does not resolve`);
        const bytes = readFileSync(path), hash = digest(bytes);
        const cursors = history.sourceWalk.cursors.filter((cursor) => cursor.values.sourceId === id);
        const current = cursors.at(-1);
        requireWalk(current, `${id} has no legal cursor`);
        const reviews = history.sourceWalk.gapReviews.filter((review) => review.values.sourceId === id).map((review) => review.values.gapReviewId);
        if (previous) {
            requireWalk(previous.values.sourceHash === hash && previous.values.sourceLengthBytes === String(bytes.length), `${id} frozen hash/length changed`);
            const priorCursor = before.sourceWalk.cursors.find((cursor) => cursor.values.cursorId === previous.values.finalCursorId);
            requireWalk(priorCursor && priorCursor.values.sourceId === id, `${id} prior cursor does not resolve`);
            requireWalk(Number(current.values.byteOffset) >= Number(priorCursor.values.byteOffset), `${id} frontier regressed`);
            if (current.values.byteOffset === priorCursor.values.byteOffset
                && current.values.sharedPositionKey === priorCursor.values.sharedPositionKey
                && current.values.sharedPositionKey !== 'none') {
                requireWalk(Number(current.values.nextEventOrdinal) >= Number(priorCursor.values.nextEventOrdinal), `${id} event frontier regressed`);
            }
            const priorGaps = gapIds(previous.values.gapReviewIds);
            requireWalk(priorGaps.every((value, index) => reviews[index] === value), `${id} prior gap ID removed or reordered`);
            requireWalk(['blocked', 'complete'].includes(previous.values.completionState), `${id} invalid prior completion state`);
            if (previous.values.completionState === 'complete') {
                requireWalk(current.values.cursorId === previous.values.finalCursorId
                    && reviews.join(', ') === (previous.values.gapReviewIds === 'none' ? '' : previous.values.gapReviewIds), `${id} completed projection is terminal`);
                const proposed = history.sourceWalk.completions.find((entry) => entry.values.sourceId === id);
                requireWalk(proposed?.raw === previous.raw, `${id} completed projection must be an exact no-op`);
                rows.push(previous.raw);
                projections.push({ source_id: id, progression: 'complete-no-op', before_row: previous.raw, after_row: previous.raw });
                continue;
            }
        }
        const frontier = row([id, hash, String(bytes.length), current.values.cursorId, reviews.join(', ') || 'none',
            'blocked', 'orchestrator', 'Current procedural frontier; source completion remains unmet.']);
        const unchanged = previous && previous.values.finalCursorId === current.values.cursorId
            && gapIds(previous.values.gapReviewIds).join('\0') === reviews.join('\0');
        rows.push(unchanged ? previous.raw : frontier);
        projections.push({ source_id: id, progression: previous ? unchanged ? 'blocked-no-op' : 'blocked-to-blocked' : 'absent-to-blocked',
            before_row: previous?.raw || null, after_row: rows.at(-1) });
    }
    let projected = withCompletionRows(history, rows);
    const structural = k214(projected);
    requireWalk(structural.length === 0, `invalid retained source-walk evidence: ${structural.join('; ')}`);
    for (const [index, projection] of projections.entries()) {
        if (projection.progression === 'absent-to-blocked' || projection.progression === 'complete-no-op')
            continue;
        const candidate = [...rows], values = projected.sourceWalk.completions[index].values;
        candidate[index] = row([values.sourceId, values.sourceHash, values.sourceLengthBytes, values.finalCursorId,
            values.gapReviewIds, 'complete', 'orchestrator', 'K2.14 procedural closure; no semantic recall claim.']);
        const complete = withCompletionRows(projected, candidate);
        if (k214(complete).length === 0) {
            rows[index] = candidate[index];
            projection.after_row = candidate[index];
            projection.progression = 'blocked-to-complete';
            projected = complete;
        }
    }
    // Completing one source never changes another source's history.
    const text = projected.sourceWalkDocument.text;
    return {
        format: 'aleph-source-walk-completion-projection/v1',
        before_digest: before.sourceWalkDocument ? digest(before.sourceWalkDocument.text) : null,
        after_digest: digest(text), after_base64: Buffer.from(text).toString('base64'), completions: projections,
        prerequisite_hashes: before.files.map((file) => ({ path: file.relativePath, digest: digest(file.text) }))
            .sort((a, b) => Buffer.compare(Buffer.from(a.path), Buffer.from(b.path))),
    };
}
/** Validate the narrow replacement inside an existing Core material plan. */
export function validateSourceWalkCompletionWrite(before, after) {
    const expected = deriveSourceWalkCompletion(before, after);
    requireWalk(Buffer.from(expected.after_base64, 'base64').toString('utf8') === after.sourceWalkDocument?.text, 'caller-supplied completion row differs from Core derivation');
    return expected;
}
