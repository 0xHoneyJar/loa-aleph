// C-03 historical reproduction, not an implementation repair. Core snapshots
// and declared fixture returns only; no native/adapter execution or semantic proof.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeSemanticFixture } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { semanticProducerSelections, semanticProducerView, validateSemanticReturn, semanticJson } from '../../../scripts/lib/semantic-review.ts';
import { runK2 } from '../../../scripts/lib/checks-k2.ts';
import { ResultCollector } from '../../../scripts/lib/results.ts';
import { projectSourceWalk, deriveSourceWalkCompletion } from '../../../scripts/lib/source-walk-transition.ts';
const scratch=mkdtempSync('/tmp/f03-shared-position-');
const root=resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const f=makeSemanticFixture(scratch,'A counter rose.',undefined,undefined,'1.9.0-provisional');
let packet=readFileSync(join(scratch,'ledgers/packet-index.md'),'utf8');
for(const line of packet.split('\n').filter(l=>/^\| (?:PKT|EVID|FRAG)-0701 \|/u.test(l))) packet=packet.replace(line,line+'\n'+line.replaceAll('0701','0702'));
writeFileSync(join(scratch,'ledgers/packet-index.md'),packet);
const original=loadRun(scratch), fullWalk=original.sourceWalkDocument!.text;
const evt=original.sourceWalk.events[0].raw;
const cur=original.sourceWalk.cursors[1].raw;
const comp=original.sourceWalk.completions[0].raw;
const interval=original.sourceWalk.intervals[0].raw;
const gap=original.sourceWalk.gapReviews[0].raw;
const pauseCur=`| CUR-0702 | SRC-701 | 0 | SP-0701 | 2 | WLK-0701 | EVT-0701 | ${original.corpus.sources[0].values.contentHash} | bounded-pause |`;
const pendingEvent=evt.replace('EVT-0701','EVT-0702').replace('PKT-0701','PKT-0702').replace('| 1 |','| 2 |').replace('| committed |','| pending |');
const pause=projectSourceWalk(original,fullWalk.replace(gap+'\n','').replace(interval,interval.replace('| PKT-0701 |','| PKT-0701, PKT-0702 |'))
 .replace(evt,evt+'\n'+pendingEvent).replace(cur,pauseCur).replace(comp,comp.replace('GAP-0701','none').replace('| complete |','| blocked |')));
function k(model:any){const c=new ResultCollector('shared-position discriminator');runK2(c,model,root);return c.checks.filter(c=>c.id==='K2.14');}
const raw=structuredClone(f.returned) as any;
raw.packets.push(structuredClone(raw.packets[0]));raw.walk_intervals[0].packet_candidate_indexes=[0,1];
raw.extraction_events.push({...raw.extraction_events[0],packet_candidate_index:1,event_ordinal:2});
raw.semantic_units.push({...structuredClone(raw.semantic_units[0]),output_index:1});
raw.next_cursor={byte_offset:0,shared_position_key:'SP-0701',next_event_ordinal:2,predecessor_walk_index:0,predecessor_event_index:0,source_hash:original.corpus.sources[0].values.contentHash,reason:'bounded-pause'};
raw.walk_exhausted=false;
const initialWalk=fullWalk.split('\n').filter(line=>!/^\| (?:WLK|EVT|GAP)-/u.test(line) && !line.startsWith('| CUR-0702 |')).join('\n').replace(comp,comp.replace('CUR-0702','CUR-0701').replace('GAP-0701','none').replace('| complete |','| blocked |'));
writeFileSync(join(scratch,'ledgers/source-walk.md'),initialWalk);
const initial=loadRun(scratch);
const selections=semanticProducerSelections(initial,'extractor','S2',{source_id:'SRC-701'});
const validated=validateSemanticReturn('extractor','1.9.0-provisional',raw,semanticProducerView(initial,'extractor','S2',selections).context);
const terminal=cur.replace('CUR-0702','CUR-0703').replace('EVT-0701','EVT-0702');
const after=projectSourceWalk(pause,pause.sourceWalkDocument!.text.replace(pendingEvent,pendingEvent.replace('| pending |','| committed |'))
 .replace(pauseCur,pauseCur+'\n'+terminal).replace(pause.sourceWalk.completions[0].raw,pause.sourceWalk.completions[0].raw.replace('CUR-0702','CUR-0703')));
let rejected='';try{deriveSourceWalkCompletion(pause,after);}catch(e){rejected=String(e);}
const alreadyCommitted=projectSourceWalk(pause,pause.sourceWalkDocument!.text.replace(pendingEvent,pendingEvent.replace('| pending |','| committed |')));
const pendingUnchanged=projectSourceWalk(pause,pause.sourceWalkDocument!.text.replace(pauseCur,pauseCur+'\n'+terminal).replace(pause.sourceWalk.completions[0].raw,pause.sourceWalk.completions[0].raw.replace('CUR-0702','CUR-0703')));
const noFuture=projectSourceWalk(pause,pause.sourceWalkDocument!.text.replace(pendingEvent+'\n','').replace('| PKT-0701, PKT-0702 |','| PKT-0701 |'));
const appended=projectSourceWalk(pendingUnchanged,pendingUnchanged.sourceWalkDocument!.text.replace(pendingEvent,pendingEvent+'\n'+pendingEvent.replace('EVT-0702','EVT-0703').replace('| pending |','| committed |')));
const result={evidence:'Core structural discriminator only; no adapter/native/live execution',validated_return:validated,paused:k(pause),advanced_with_event_replacement:k(after),replacement_rejection:rejected,all_committed_at_pause:k(alreadyCommitted),pending_event_unchanged:k(pendingUnchanged),append_committed_event:k(appended),future_event_absent:k(noFuture),raw:raw};
assert.equal(validated.result,'PASS');assert(k(pause).every(c=>c.status==='PASS'));assert(k(after).every(c=>c.status==='PASS'));assert.match(rejected,/events history must remain an exact ordered prefix/u);
for(const caseName of ['all_committed_at_pause','pending_event_unchanged','append_committed_event','future_event_absent'] as const)assert(result[caseName].some(c=>c.status==='FAIL'));
if (process.argv.includes('--json')) console.log(JSON.stringify(result,null,2));
else console.log('PASS 8/8 C-03 structural discriminators: bound return and both snapshots pass; required event-row replacement and all tested append-only bypasses fail. Conflict remains unresolved.');
rmSync(scratch,{recursive:true,force:true});
