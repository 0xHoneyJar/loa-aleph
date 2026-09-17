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
    for (const key of ['intervals', 'cursors', 'gapReviews']) {
        const prior = before.sourceWalk[key], next = after.sourceWalk[key];
        requireWalk(prior.length <= next.length && prior.every((row, index) => row.raw === next[index].raw), `${key} history must remain an exact ordered prefix`);
    }
    const changes = [];
    requireWalk(before.sourceWalk.events.length <= after.sourceWalk.events.length, 'event deletion');
    for (const [index, prior] of before.sourceWalk.events.entries()) {
        const next = after.sourceWalk.events[index];
        if (prior.raw === next.raw)
            continue;
        requireWalk(prior.values.status === 'pending' && next.values.status === 'committed'
            && next.raw === committedEventRow(prior.raw), 'event identity/history changed outside pending commitment');
        const cursor = before.sourceWalk.cursors.filter((entry) => entry.values.sourceId === prior.values.sourceId).at(-1);
        requireWalk(cursor && cursor.values.sharedPositionKey === prior.values.sharedPositionKey
            && cursor.values.byteOffset === prior.values.startByte
            && cursor.values.nextEventOrdinal === prior.values.eventOrdinal, 'current cursor does not expect this pending event');
        changes.push({ event_id: prior.values.eventId, before_row: prior.raw, after_row: next.raw });
    }
    requireWalk(changes.length <= 1, 'one current pending event commitment per transition');
    if (before.sourceWalkDocument) {
        const scaffold = (model) => {
            const dataLines = new Set(model.sourceWalkDocument.tables.flatMap((table) => table.rows.map((row) => row.line)));
            return model.sourceWalkDocument.lines.filter((_, index) => !dataLines.has(index + 1)).join('\n');
        };
        requireWalk(scaffold(before) === scaffold(after), 'source-walk headers and non-row bytes changed');
    }
    return changes;
}
function committedEventRow(pending) {
    const committed = pending.replace(/\bpending(?=\s*\|\s*$)/u, 'committed');
    requireWalk(committed !== pending, 'exact pending status cell required');
    return committed;
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
    const event_commitments = retainedHistory(before, history);
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
        after_digest: digest(text), after_base64: Buffer.from(text).toString('base64'), completions: projections, event_commitments,
        prerequisite_hashes: before.files.map((file) => ({ path: file.relativePath, digest: digest(file.text) }))
            .sort((a, b) => Buffer.compare(Buffer.from(a.path), Buffer.from(b.path))),
    };
}
/**
 * HUMAN C-03: commit only the existing event expected by the current shared
 * cursor. No destination, replacement row, new event ID or ordinal is input.
 * The caller must be the authenticated Core work-transition controller.
 */
export function derivePendingEventCommitment(before, eventId) {
    requireWalk(hasRunCapability(before.manifest?.runFormatVersion || '', 'orchestrator-work-transitions'), '1.9 orchestration identity required');
    const invalid = k214(before);
    requireWalk(invalid.length === 0, `invalid commitment prerequisites: ${invalid.join('; ')}`);
    const matches = before.sourceWalk.events.filter((entry) => entry.values.eventId === eventId);
    requireWalk(matches.length === 1, 'one retained event identity required');
    const event = matches[0];
    // Repeated observations do not create a cursor or a semantic effect.
    if (event.values.status === 'committed') {
        const projection = deriveSourceWalkCompletion(before, before);
        return { ...projection, after_digest: projection.before_digest,
            after_base64: Buffer.from(before.sourceWalkDocument.text).toString('base64'),
            completions: before.sourceWalk.completions.map((entry) => ({ source_id: entry.values.sourceId,
                progression: entry.values.completionState === 'complete' ? 'complete-no-op' : 'blocked-no-op',
                before_row: entry.raw, after_row: entry.raw })) };
    }
    requireWalk(event.values.status === 'pending', 'pending event required');
    const sourceId = event.values.sourceId;
    const cursor = before.sourceWalk.cursors.filter((entry) => entry.values.sourceId === sourceId).at(-1);
    requireWalk(cursor.values.sharedPositionKey === event.values.sharedPositionKey
        && cursor.values.byteOffset === event.values.startByte
        && cursor.values.nextEventOrdinal === event.values.eventOrdinal, 'current cursor does not expect this pending event');
    const siblings = before.sourceWalk.events.filter((entry) => entry.values.sourceId === sourceId
        && entry.values.sharedPositionKey === event.values.sharedPositionKey);
    const next = siblings.find((entry) => Number(entry.values.eventOrdinal) === Number(event.values.eventOrdinal) + 1);
    requireWalk(!next || next.values.status === 'pending', 'next sibling is not pending');
    const walk = before.sourceWalk.intervals.find((entry) => entry.values.walkId === cursor.values.predecessorWalkId);
    const source = before.corpus.sources.find((entry) => entry.values.sourceId === sourceId);
    const sourcePath = sourceFilePath(before.runDir, source.values.locus);
    requireWalk(sourcePath, 'frozen source must reopen');
    const length = readFileSync(sourcePath).length;
    const offset = next ? event.values.startByte : walk.values.endByte;
    const ordinal = Math.max(0, ...before.sourceWalk.cursors.map((entry) => Number(entry.values.cursorId.slice(4)))) + 1;
    requireWalk(Number.isSafeInteger(ordinal), 'cursor identity overflow');
    const cursorId = `CUR-${String(ordinal).padStart(4, '0')}`;
    const nextRow = row([cursorId, sourceId, offset, next ? event.values.sharedPositionKey : 'none',
        next ? next.values.eventOrdinal : 'none', walk.values.walkId,
        next || event.values.endByte === offset ? eventId : 'none', source.values.contentHash,
        next ? 'resumed-shared-position' : Number(offset) === length ? 'source-complete' : 'progress']);
    const lines = before.sourceWalkDocument.text.split('\n');
    const eventLine = lines.indexOf(event.raw);
    requireWalk(eventLine >= 0 && lines.lastIndexOf(event.raw) === eventLine, 'exact unique pending row required');
    lines[eventLine] = committedEventRow(event.raw);
    const table = before.sourceWalk.cursorTable;
    lines.splice(table.line + table.rows.length + 1, 0, nextRow);
    // K2.14 checks exact evidence, ordinal continuity, containment, cursor
    // eligibility and refusal to jump any other still-pending event.
    return deriveSourceWalkCompletion(before, projectSourceWalk(before, lines.join('\n')));
}
/** Validate the narrow replacement inside an existing Core material plan. */
export function validateSourceWalkCompletionWrite(before, after) {
    const expected = deriveSourceWalkCompletion(before, after);
    if (expected.event_commitments.length) {
        const commitment = derivePendingEventCommitment(before, expected.event_commitments[0].event_id);
        requireWalk(commitment.after_base64 === expected.after_base64, 'caller-supplied event/cursor after-image differs from Core commitment');
    }
    requireWalk(Buffer.from(expected.after_base64, 'base64').toString('utf8') === after.sourceWalkDocument?.text, 'caller-supplied completion row differs from Core derivation');
    return expected;
}
