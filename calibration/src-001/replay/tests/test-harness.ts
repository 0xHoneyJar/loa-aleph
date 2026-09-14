import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, linkSync, mkdirSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { deflateRawSync, gzipSync } from 'node:zlib';
import { fixture, make, sample, Factory, REPLAY_ID, TIME } from './synthetic.ts';
import type { Fixture } from './synthetic.ts';
import * as H from '../protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/index.ts';
import type { Data } from '../protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/index.ts';
import { materialFeatureAvailable, prepareRepresentationCapture } from '../../../../scripts/lib/source-representation.ts';
import { validateWorkerReturnContract } from '../../../../scripts/lib/worker-return-contract.ts';

const tests: Data[] = [], mutations: Data[] = [];
const retainedBlobs = new Map<string,string>();
function retainBlob(bytes:Buffer):string {
  const sha256=H.digest(bytes);retainedBlobs.set(sha256,bytes.toString('base64'));return sha256;
}
function references(value:unknown):H.ArtifactRef[] {
  if(!value||typeof value!=='object')return [];
  const record=value as Data;
  if(!Array.isArray(value)&&Object.keys(value).length===4&&['store','path','byte_length','sha256'].every(k=>typeof record[k]==='string')
    &&record.store.startsWith('sha256:')&&record.sha256.startsWith('sha256:'))return [value as H.ArtifactRef];
  return Object.values(value).flatMap(references);
}
function retainReferences(c:Fixture,value:unknown):Data[] {
  const queue=references(value),seen=new Set<string>(),rows:Data[]=[];
  while(queue.length) {
    const ref=queue.shift()!,key=H.canonicalBytes(ref).toString();if(seen.has(key))continue;seen.add(key);
    try {
      const raw=c.f.stores.read(ref);rows.push({artifact_ref:ref,blob_sha256:retainBlob(raw)});
      try {queue.push(...references(JSON.parse(raw.toString('utf8'))));}catch {/* Raw evidence is retained even when it is not JSON. */}
    }catch(error){rows.push({artifact_ref:ref,unresolved_reason:String(error)});}
  }
  return rows;
}
function retainSnapshot(c:Fixture):Data[] {
  return H.inventory(c.resultRoot).filter(e=>e.type==='file').map(e=>({path:e.path,mode:e.mode,
    byte_length:e.byte_length,blob_sha256:retainBlob(H.exactFile(c.resultRoot,e.path))}));
}

function test(name: string, action: () => void): void {
  try { action(); tests.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
  catch (error) {
    tests.push({ name, result: 'FAIL', evidence: error instanceof Error ? error.stack : String(error) });
    console.log(`FAIL ${name}: ${String(error)}`);
  }
}
const controls = fixture();
const rule = (c: Fixture, id: string) => {
  switch (id) {
    case 'R01': return () => H.inputIdentity(c.input,c.f.stores,c.trustedInput);
    case 'R02': return () => H.releaseIdentity(c.release,c.f.stores);
    case 'R03': return () => H.workspaceClosure(c.env,c.observation,c.f.stores,c.trustedEnvironmentDigest);
    case 'R04': return () => H.deliveredContext(c.visibility,[c.delivery],c.f.stores,c.trust);
    case 'R05': return () => H.executionHonesty(c.mode,c.execution,c.outcome,c.f.stores);
    case 'R06': return () => H.evaluationFreeze(c.freeze,c.freezeEvidence);
    case 'R07': return () => H.chronology(c.freeze,c.access,c.comparison,c.events,c.freezeEvidence);
    case 'R08': return () => H.mappings([c.mapping],c.comparison,c.f.stores);
    case 'R09': return () => H.reports(c.exact,c.structural,c.semantic,c.uncertainty,[c.mapping],c.comparison,c.outcome,c.f.stores);
    default: throw new Error(id);
  }
};
const positiveResults = Object.keys(H.PROPOSITIONS).map((id) => H.check(id,rule(controls,id)));
for (const result of positiveResults) test(result.check_id, () => assert.equal(result.result,'PASS',JSON.stringify(result)));

test('all closed versioned schemas: positive, unknown key, missing field, duplicate JSON key', () => {
  for (const name of H.recordNames) {
    const value = make(name,controls.generic);
    H.parseRecord(name,H.canonicalBytes(value));
    assert.throws(() => H.validateRecord(name,{...value,unexpected:'synthetic'}));
    const missing = structuredClone(value); delete missing.format;
    assert.throws(() => H.validateRecord(name,missing));
    const raw = H.canonicalBytes(value).toString();
    assert.throws(() => H.parseRecord(name,Buffer.from(raw.replace('{','{"format":"synthetic",'))));
  }
});
test('enums, decimal strings, UTF-8, canonical JSON, escaped duplicate keys', () => {
  assert.equal(H.canonicalBytes({z:'2',a:{z:false,a:'é'}}).toString(),'{"a":{"a":"é","z":false},"z":"2"}\n');
  for (const bad of [1,NaN,undefined,{x:2},'\ud800']) assert.throws(() => H.canonicalBytes(bad));
  assert.throws(() => H.parseStrictJson(Buffer.from('{"a":"x","\\u0061":"y"}')));
  assert.throws(() => H.parseStrictJson(Buffer.from([0xff])));
  assert.throws(() => H.validateRecord('outcome',{...controls.outcome,completion:'PASS'}));
  assert.throws(() => H.validateRecord('artifact-ref',{...controls.generic,byte_length:'01'}));
  assert.throws(() => H.parseRecord('outcome',Buffer.from(JSON.stringify(controls.outcome,null,2))));
  assert.throws(() => H.utc('2026-02-30T00:00:00Z'));
});
test('path and ArtifactRef closure', () => {
  for (const path of ['/absolute','../escape','a/../b','a//b','a\\b','C:/file','a/%2e%2e/b','a/./b','a/','a.','NUL','e\u0301']) {
    assert.throws(() => H.relativePath(path),path);
  }
  H.relativePath('safe/.hidden');
  assert.throws(() => controls.f.stores.read({...controls.generic,store:H.digest('missing')}));
  assert.throws(() => controls.f.stores.read({...controls.generic,sha256:H.digest('changed')}));
  const f = new Factory(), root = join(f.root,'links'); mkdirSync(root);
  writeFileSync(join(root,'one'),'synthetic'); linkSync(join(root,'one'),join(root,'two'));
  assert.throws(() => H.inventory(root)); rmSync(join(root,'two'));
  symlinkSync(join(root,'one'),join(root,'alias')); assert.throws(() => H.inventory(root)); rmSync(join(root,'alias'));
  writeFileSync(join(root,'ONE'),'synthetic'); assert.throws(() => H.inventory(root));
});
test('approved opaque input metadata and bounded imported representation', () => {
  const input = structuredClone(controls.input);
  input.entries = H.INPUT_PINS.map(([basename,role,byte_length,hash]) => ({ member_path:
    `SRC-001-closed-development-calibration-reference/evidence/transfer/${basename}`, role, media_type:'synthetic-metadata-only',
    artifact_ref:{...controls.generic,byte_length,sha256:`sha256:${hash}`} }));
  input.archive_ref = {...controls.generic,...H.CONTAINER_PINS.archive};
  input.custody_metadata_ref = {...controls.generic,...H.CONTAINER_PINS.manifest};
  H.approvedInputMetadata(input);
  const capture = prepareRepresentationCapture([{source_id:'SRC-001',bytes:controls.source,descriptor:controls.descriptor,
    assets:new Map([['SYNTHETIC-upstream.pdf',Buffer.from('%PDF-SYNTHETIC\nopaque artificial upstream fixture\n')]])}]);
  assert.equal(capture.sourceSchemes.size,1);
  assert.deepEqual(capture.inventory.objects.map((o) => o.kind),['source','text']);
  assert.equal(capture.inventory.assets.filter((a) => a.role === 'upstream-capture').length,1);
  assert.equal(materialFeatureAvailable({inventory:capture.inventory,carriers:new Map(),inventoryHash:'synthetic',uses:[]},
    {object_id:capture.inventory.objects[0].object_id,feature:'formal-structure',binding_ids:[]}),false);
  assert(!capture.inventory.objects.some((o) => o.kind === 'criteria'));
  assert.throws(() => H.syntheticDescriptor('SRC001-REPLAY-20260914T000000Z-'+'a'.repeat(32),controls.source,Buffer.from('pdf'),'x','y','synthetic'));
});
test('event chain append-only, fork/sequence/predecessor/mutation and time independence', () => {
  const f = new Factory(), root = join(f.root,'events'); mkdirSync(root);
  const origin = {format:'src001-replay-event/v1',replay_id:REPLAY_ID,sequence:'0',previous_event_digest:null,
    utc_time:TIME,actor:'SYNTHETIC-recorder',event_kind:'origin',artifact_refs:[]};
  H.appendSyntheticEvent(root,origin);
  const next = {...origin,sequence:'1',previous_event_digest:H.digest(H.canonicalBytes(origin)),event_kind:'production-stop'};
  H.appendSyntheticEvent(root,next);
  assert.throws(() => H.appendSyntheticEvent(root,next));
  assert.throws(() => H.eventChain([origin,{...next,previous_event_digest:H.digest('wrong')}],REPLAY_ID));
  assert.throws(() => H.eventChain([{...origin,actor:'SYNTHETIC-changed'},next],REPLAY_ID));
  assert.throws(() => H.eventChain([origin,{...next,sequence:'0'}],REPLAY_ID));
  assert.equal(H.eventChain([origin,next],REPLAY_ID),H.digest(H.canonicalBytes(next)));
});
test('H-F1 inaccessible canary, input plumbing and closure controls', () => {
  assert.equal(H.check('R03',rule(controls,'R03')).result,'PASS');
  const canary = controls.f.put('SYNTHETIC-inaccessible-canary',Buffer.from('SYNTHETIC FORBIDDEN human-answer-inventory'));
  assert(canary.sha256);
  assert.equal(H.check('R04',rule(controls,'R04')).result,'PASS');
});
test('H-F2 blocked and completed synthetic snapshots with full directories', () => {
  for (const complete of [false,true]) {
    const c = fixture({complete});
    assert.equal(H.check('R06',rule(c,'R06')).result,'PASS');
    assert.equal(H.check('R07',rule(c,'R07')).result,'PASS');
    assert(c.inv.entries.some((e:Data) => e.path === 'run/quarantine/empty' && e.type === 'directory'));
    assert.equal(c.outcome.completion,complete ? 'COMPLETE_TO_DECLARED_ENDPOINT' : 'INCOMPLETE');
    assert.equal(H.check('R05',rule(c,'R05')).result,'PASS');
  }
});
test('H-F3 actual ID renaming, same-ID indeterminacy and many-sided mappings', () => {
  for (const ids of [{replay_id:'renamed-left',reference_id:'renamed-right'},{replay_id:'same',reference_id:'same'}]) {
    const c = fixture(ids); H.mappings([c.mapping],c.comparison,c.f.stores);
    assert.equal(c.mapping.correspondence,'CANNOT_DETERMINE');
    if(ids.replay_id==='same') {
      const sameIdsDifferentAnchors=structuredClone(c.mapping);
      sameIdsDifferentAnchors.reference_evidence[0].source_anchors=c.secondEvidence[1].source_anchors;
      H.mappings([sameIdsDifferentAnchors],c.comparison,c.f.stores);
      assert.equal(sameIdsDifferentAnchors.correspondence,'CANNOT_DETERMINE');
    }
    for (const [left,right] of [[1,1],[1,2],[2,1],[2,2]]) {
      const row = structuredClone(c.mapping);
      if(left===2)row.replay_evidence.push(c.secondEvidence[0]);
      if(right===2)row.reference_evidence.push(c.secondEvidence[1]);
      H.mappings([row],c.comparison,c.f.stores);
    }
  }
});
test('H-F4 indeterminate mapping, findings, summaries and denominator', () => {
  H.reports(controls.exact,controls.structural,controls.semantic,controls.uncertainty,[controls.mapping],
    controls.comparison,controls.outcome,controls.f.stores);
  assert.equal(controls.semantic.metrics[0].denominator,'1');
  assert.equal(controls.semantic.metrics[0].uncertainty_count,'1');
  assert.equal(controls.mapping.correspondence,'CANNOT_DETERMINE');
});
test('raw JSON/JSONL/Markdown selectors preserve exact selected bytes', () => {
  const json = Buffer.from('{ "outer": { "x" : 3 }, "arr":[true,"é"] }\n');
  H.selectedBytes(json,{kind:'json-pointer',locator:'/outer',selected_sha256:H.digest('{ "x" : 3 }')});
  H.selectedBytes(json,{kind:'json-pointer',locator:'/arr/1',selected_sha256:H.digest('"é"')});
  const row = '{"x":"one"}\n';
  H.selectedBytes(Buffer.from(row+'{"x":"two"}\n'),{kind:'jsonl-record',locator:'1',selected_sha256:H.digest(row)});
  H.selectedBytes(Buffer.from('# Heading\nbody\n'),{kind:'markdown-heading',locator:'L1-L1',selected_sha256:H.digest('# Heading\n')});
  H.selectedBytes(Buffer.from('| x | y |\n'),{kind:'markdown-row',locator:'L1-L1',selected_sha256:H.digest('| x | y |\n')});
  assert.throws(() => H.selectedBytes(Buffer.from('{"x":1,"x":2}'),{kind:'json-pointer',locator:'/x',selected_sha256:H.digest('2')}));
});
function mutation(id:string, checkId:string, subject:(c:Fixture)=>unknown, change:(c:Fixture)=>void,
  expected:string, action?:(c:Fixture)=>void, prepare?:(c:Fixture)=>void): void {
  test(id,() => {
    const c = fixture(); prepare?.(c);
    const run = () => action ? action(c) : rule(c,checkId)();
    const control = H.check(checkId,run);
    assert.equal(control.result,'PASS',`nonpassing control ${JSON.stringify(control)}`);
    const before = H.canonicalBytes(subject(c));
    const beforeArtifacts=retainReferences(c,subject(c));
    const beforeSnapshot=['R06','R07'].includes(checkId)?retainSnapshot(c):[];
    change(c);
    const after = H.canonicalBytes(subject(c));
    const afterArtifacts=retainReferences(c,subject(c));
    const afterSnapshot=['R06','R07'].includes(checkId)?retainSnapshot(c):[];
    assert(!before.equals(after),'mutation did not change the subject');
    const result = H.check(checkId,run);
    mutations.push({mutation_id:id,check_id:checkId,control,result,expected_token:expected,
      referenced_artifacts_before:beforeArtifacts,referenced_artifacts_after:afterArtifacts,
      snapshot_files_before:beforeSnapshot,snapshot_files_after:afterSnapshot,
      before_sha256:H.digest(before),before_base64:before.toString('base64'),
      after_sha256:H.digest(after),after_base64:after.toString('base64')});
    assert.notEqual(result.result,'PASS','mutation escaped');
    assert.equal(result.token,expected,`wrong rule/evidence ${JSON.stringify(result)}`);
  });
}
function ingress(c:Fixture,payload:Buffer): void {
  c.observation.observed_inventory_ref = c.f.put('SYNTHETIC-extra-inventory.json',{ original:c.observation.expected_inventory_ref,
    extra:c.f.put('SYNTHETIC-innocent-name.bin',payload) });
}
mutation('H-M01','R03',c=>c.observation,c=>ingress(c,Buffer.from(JSON.stringify({embedded:Buffer.from('SYNTHETIC FORBIDDEN human-answer-inventory').toString('base64')}))),'FAIL_CONTEXT_LEAK');
mutation('H-M02','R03',c=>c.observation,c=>ingress(c,Buffer.from('SYNTHETIC independent audit conclusions')),'FAIL_CONTEXT_LEAK');
mutation('H-M03','R03',c=>c.observation,c=>ingress(c,gzipSync('SYNTHETIC correction addendum overlay')),'FAIL_CONTEXT_LEAK');
mutation('H-M04','R04',c=>c.delivery,c=>{c.delivery.parts.push({...c.delivery.parts[0],channel:'task',entry_id:'SYNTHETIC-expected-IDs'});},'FAIL_CONTEXT_LEAK');
mutation('H-M05','R03',c=>c.observation,c=>ingress(c,Buffer.from('SYNTHETIC precomputed score 100')),'FAIL_CONTEXT_LEAK');
mutation('H-M06','R01',c=>c.input,c=>{c.input.entries=c.input.entries.filter((e:Data)=>e.role!=='source');},'FAIL_INPUT_PIN');
mutation('H-M07','R02',c=>c.release,c=>{delete c.release.builds[0].checker_digest;},'FAIL_RELEASE_PIN');
mutation('H-M08','R01',c=>c.input,c=>{c.input.entries[0].artifact_ref=c.f.put('SYNTHETIC-source-changed.txt',Buffer.concat([c.source,Buffer.from('\r\n')]));},'FAIL_INPUT_PIN');
mutation('H-M09','R01',c=>c.input,c=>{c.input.entries[1].artifact_ref=c.input.entries[2].artifact_ref;},'FAIL_INPUT_PIN');
mutation('H-M10','R06',c=>H.inventory(c.resultRoot),c=>{writeFileSync(join(c.resultRoot,'run/.hidden'),'SYNTHETIC changed after freeze\n');},'FAIL_FREEZE_MUTATION');
mutation('H-M11','R07',c=>({access:c.access,events:c.events}),c=>{
  const freezeRef = c.f.stores.byDigest(c.comparison.freeze_receipt_sha256)[0];
  const kinds = ['origin','production-stop','reference-open','evaluation-freeze','reference-grant','comparison-start'];
  c.events = kinds.map((event_kind,index)=>({...c.events[index],event_kind,artifact_refs:index>1?[freezeRef]:c.events[index].artifact_refs}));
  c.events.forEach((e,index)=>{e.previous_event_digest=index?H.digest(H.canonicalBytes(c.events[index-1])):null;});
  c.access.first_open_event_ref=c.f.put('SYNTHETIC-early-open.json',c.events[2]);
  c.access.freeze_event_ref=c.f.put('SYNTHETIC-later-freeze.json',c.events[3]);
  c.access.grant_event_ref=c.f.put('SYNTHETIC-later-grant.json',c.events[4]);
  c.comparison.start_event_ref=c.f.put('SYNTHETIC-later-start.json',c.events[5]);
},'FAIL_COMPARISON_CHRONOLOGY');
mutation('H-M12','R08',c=>c.mapping,c=>{c.mapping.replay_id='SYNTHETIC-WRONG-REPLAY';},'FAIL_COMPARISON_BINDING');
mutation('H-M13','R07',c=>c.access,c=>{c.access.writable_aliases=['/SYNTHETIC-writable-alias'];},'FAIL_COMPARISON_CHRONOLOGY');
mutation('H-M14','R06',c=>H.inventory(c.resultRoot),c=>{writeFileSync(join(c.resultRoot,'run/mapping.json'),H.canonicalBytes(c.mapping));},'FAIL_FREEZE_MUTATION');
mutation('H-M15','R08',c=>({predicate:(c as any).predicate||'evidence-selectors'}),c=>{(c as any).predicate='expected-ID-equality';},
  'FAIL_COMPARISON_BINDING',c=>H.mappings([c.mapping],c.comparison,c.f.stores,(c as any).predicate||'evidence-selectors'));
mutation('H-M16','R09',c=>c.semantic,c=>{c.semantic.rows[0].assessment='RECOVERED_REFERENCE_BEHAVIOR';},'FAIL_COMPARISON_BINDING');
mutation('H-M17','R04',c=>c.delivery,c=>{c.delivery.parts[1].artifact_ref=c.f.put('SYNTHETIC-swapped-attachment.txt',Buffer.from('SYNTHETIC swapped'));},'FAIL_CONTEXT_LEAK');
mutation('H-M18','R04',c=>c.delivery,c=>{c.delivery.inherited_context=true;},'FAIL_CONTEXT_LEAK');
mutation('H-M19','R02',c=>c.release,c=>{c.release.builds[0].actual_build_checkout_commit='main';},'FAIL_RELEASE_PIN');
mutation('H-M20','R02',c=>c.release,c=>{c.release.builds[0].actual_build_checkout_commit='0ff5443dd587bb287ae6bdf62985294e6d8dc19a';},'FAIL_RELEASE_PIN');
mutation('H-M21','R02',c=>c.release,c=>{c.release.builds[1].archive_ref=c.f.put('SYNTHETIC-release.tar.gz',Buffer.from('SYNTHETIC nondeterministic archive'));},'BLOCKED_RELEASE_REPRODUCTION');
mutation('H-M22','R03',c=>c.observation,c=>{c.observation.observed_channels.push('SYNTHETIC-unrecorded-FD-dependency');},'FAIL_CONTEXT_LEAK');
mutation('H-M23','R05',c=>c.execution,c=>{c.execution.deliveries[0].execution_class='native-dispatch';},'BLOCKED_CONTEXT_EVIDENCE');
mutation('H-M24','R05',c=>({outcome:c.outcome,execution:c.execution}),c=>{c.outcome.completion='COMPLETE_TO_DECLARED_ENDPOINT';},
  'BLOCKED_F03_PRODUCTION_REACHABILITY',undefined,c=>{
    const prompt=readFileSync('docs/architecture/prompts/workers-intake-extraction.md','utf8');
    const contracts=[...prompt.matchAll(/\*\*Output contract[^*]*\*\*\s*```json\s*([\s\S]*?)\s*```/gu)].map(m=>JSON.parse(m[1]));
    const contract=contracts.find(value=>value.role==='normalizer');assert(contract);
    const raw=Buffer.from(JSON.stringify({claims:[],no_claim_packets:[],lineage_proposals:[],material_findings:[],semantic_units:[]}));
    const validation=validateWorkerReturnContract(raw,contract);assert.equal(validation.result,'PASS');
    c.execution.accepted_return_refs=[c.f.put('SYNTHETIC-accepted-return.json',raw)];
    c.execution.quarantined_return_refs=[c.f.put('SYNTHETIC-quarantined-return.json',raw)];
    c.execution.raw_checker_result_ref=c.f.put('SYNTHETIC-Core-return-validation.json',validation);
    c.execution.raw_adapter_result_ref=c.f.put('SYNTHETIC-transport-result.json',{result:'PASS',ledger_write:false,execution_class:'synthetic'});
  });
mutation('H-M25','R05',c=>c.execution,c=>{c.execution.manual_passes[0].evidence.reviewer_actor='SYNTHETIC-producer';},
  'BLOCKED_CONTEXT_EVIDENCE',undefined,c=>{
    const mode={...c.mode,mode:'manual',sanction_status:'sanctioned-manual-path',evidence_kind:'manual-separate-pass'};
    c.mode=mode;c.execution.mode_ref=c.f.put('SYNTHETIC-manual-mode.json',mode);
    c.execution.manual_passes=[{role:'verifier-l2s',round:'1',verdict:'upheld',
      profile:{profile_id:'n/a (core-manual)',profile_digest:null,role:'verifier-l2s',model_identity:'human'},
      evidence:{producer_actor:'SYNTHETIC-producer',reviewer_actor:'SYNTHETIC-reviewer',producer_pass_id:'SYNTHETIC-producer-pass',
        reviewer_pass_id:'SYNTHETIC-reviewer-pass',subject_digest:c.generic.sha256,shown_digest:c.generic.sha256,withheld_declaration:'SYNTHETIC withheld'}}];
  });
mutation('H-M26','R08',c=>c.mapping,c=>{c.mapping.reference_evidence[0].record_selector.locator='/fabricated';},'FAIL_COMPARISON_BINDING');
mutation('H-M27','R04',c=>(c as any).gate,c=>{(c as any).gate.projected_fields.push('reference_mapping');},'FAIL_CONTEXT_LEAK',
  c=>H.gateProjection((c as any).gate,c.f.stores,[c.generic]),c=>{
    (c as any).gate=c.mk('gate-projection',{replay_id:REPLAY_ID,stage:'S0',request_ref:c.generic,allowed_fields:['scope'],
      projected_fields:['scope'],projected_ref:c.f.put('SYNTHETIC-gate-projection.json',{scope:'SYNTHETIC original scope'})});
  });
mutation('H-M28','R06',c=>H.inventory(c.resultRoot),c=>{rmSync(join(c.resultRoot,'run/control/pending-journal.json'));},'FAIL_FREEZE_MUTATION');
mutation('H-M29','R07',c=>({events:c.events,access:c.access}),c=>{
  c.events[3].artifact_refs=[];
  for(let i=4;i<c.events.length;i++)c.events[i].previous_event_digest=H.digest(H.canonicalBytes(c.events[i-1]));
  c.access.grant_event_ref=c.f.put('SYNTHETIC-timestamp-only-grant.json',c.events[3]);
  c.access.first_open_event_ref=c.f.put('SYNTHETIC-after-timestamp-open.json',c.events[4]);
  c.comparison.start_event_ref=c.f.put('SYNTHETIC-after-timestamp-start.json',c.events[5]);
},'FAIL_COMPARISON_CHRONOLOGY');

test('additional leak encodings, alias, environment, and unknown ingress variants', () => {
  const canary=Buffer.from('SYNTHETIC FORBIDDEN answer payload');
  for(const bytes of [canary,Buffer.from(canary.toString('base64')),gzipSync(canary),Buffer.from(JSON.stringify({embedded:canary.toString()}))]) {
    const c=fixture(); ingress(c,bytes); assert.equal(H.check('R03',rule(c,'R03')).token,'FAIL_CONTEXT_LEAK');
  }
  const c=fixture();c.observation.observed_mounts.push({...c.env.mounts[0],destination:'/SYNTHETIC-extra'});
  assert.equal(H.check('R03',rule(c,'R03')).token,'FAIL_CONTEXT_LEAK');
  const d=fixture();d.env.variables.push({name:'SYNTHETIC_HINT',state:'SET',secret:false,nonsecret_value:'SYNTHETIC extra',broker_permission_ref:null});
  assert.equal(H.check('R03',rule(d,'R03')).token,'FAIL_CONTEXT_LEAK');
});
test('freeze path/mode/hidden/quarantine mutations and detached-key rejection', () => {
  for(const change of [
    (c:Fixture)=>chmodSync(join(c.resultRoot,'run/.hidden'),0o644),
    (c:Fixture)=>renameSync(join(c.resultRoot,'run/.hidden'),join(c.resultRoot,'run/.renamed')),
    (c:Fixture)=>rmSync(join(c.resultRoot,'run/quarantine/accepted-return.json')),
  ]) {const c=fixture();change(c);assert.equal(H.check('R06',rule(c,'R06')).token,'FAIL_FREEZE_MUTATION');}
  const c=fixture();c.freezeEvidence.attestation.signature=Buffer.from('SYNTHETIC invalid signature').toString('base64');
  assert.equal(H.check('R06',rule(c,'R06')).token,'BLOCKED_FREEZE');
});
test('mapping absent sides and unknown buckets cannot disappear', () => {
  const c=fixture();
  for(const [side,correspondence] of [['replay_evidence','MISSING_REFERENCE_BEHAVIOR'],['reference_evidence','ADDITIONAL_BEHAVIOR']]) {
    const row={...c.mapping,[side]:[],correspondence};H.mappings([row],c.comparison,c.f.stores);
  }
  assert.throws(()=>H.mappings([{...c.mapping,replay_evidence:[],reference_evidence:[]}],c.comparison,c.f.stores));
  c.semantic.metrics[0].denominator='0';assert.equal(H.check('R09',rule(c,'R09')).token,'FAIL_COMPARISON_BINDING');
  const d=fixture();d.uncertainty.records=[];assert.equal(H.check('R09',rule(d,'R09')).token,'FAIL_COMPARISON_BINDING');
});
test('CLI refuses replay, provider, release, attestation and reference operations',()=>{
  const cli=resolve('calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/cli.ts');
  for(const command of ['start','resume','attest','prepare-release','open-reference']) {
    try {execFileSync(process.execPath,[cli,command],{stdio:'pipe'});assert.fail('unsafe command was accepted');}
    catch(error) {
      const failure=error as {status?:number;stdout?:Buffer};assert.equal(failure.status,1);
      const report=JSON.parse(failure.stdout!.toString('utf8'));assert.equal(report.token,'RECORD_REFUSED');assert.equal(report.result,'FAIL');
    }
  }
});
test('synthetic ZIP extraction selects only approved bytes and rejects malicious metadata',()=>{
  function zip(rows:Array<{name:string;bytes:Buffer;mode?:number;method?:number}>):Buffer {
    const local:Buffer[]=[],central:Buffer[]=[];let offset=0;
    for(const row of rows) {
      const name=Buffer.from(row.name),method=row.method||0,bytes=method===8?deflateRawSync(row.bytes):row.bytes;
      const l=Buffer.alloc(30),c=Buffer.alloc(46),crc=H.crc32(row.bytes);
      l.writeUInt32LE(0x04034b50);l.writeUInt16LE(20,4);l.writeUInt16LE(0x800,6);l.writeUInt16LE(method,8);
      l.writeUInt32LE(crc,14);l.writeUInt32LE(bytes.length,18);l.writeUInt32LE(row.bytes.length,22);l.writeUInt16LE(name.length,26);
      c.writeUInt32LE(0x02014b50);c.writeUInt16LE(0x314,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(method,10);
      c.writeUInt32LE(crc,16);c.writeUInt32LE(bytes.length,20);c.writeUInt32LE(row.bytes.length,24);c.writeUInt16LE(name.length,28);
      c.writeUInt32LE(((row.mode||0o100600)<<16)>>>0,38);c.writeUInt32LE(offset,42);
      local.push(l,name,bytes);central.push(c,name);offset+=l.length+name.length+bytes.length;
    }
    const directory=Buffer.concat(central),end=Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50);end.writeUInt16LE(rows.length,8);end.writeUInt16LE(rows.length,10);
    end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
    return Buffer.concat([...local,directory,end]);
  }
  assert.equal(H.crc32(Buffer.from('123456789')),0xcbf43926);
  const approved={name:'inputs/source.txt',bytes:Buffer.from('SYNTHETIC selected source\n'),method:8};
  const forbidden={name:'withheld/innocent.bin',bytes:Buffer.from('SYNTHETIC forbidden canary')};
  const pins=[{path:approved.name,byte_length:String(approved.bytes.length),sha256:H.digest(approved.bytes)}];
  const archive=zip([approved,forbidden]);
  const selected=H.syntheticArchiveMembers(REPLAY_ID,archive,pins);
  assert.deepEqual([...selected.keys()],[approved.name]);assert(selected.get(approved.name)!.equals(approved.bytes));
  for(const malformed of [
    zip([approved,{...forbidden,name:'../escape'}]),zip([approved,{...forbidden,name:'/absolute'}]),
    zip([approved,{...forbidden,name:approved.name}]),zip([approved,{...forbidden,mode:0o120777}]),
  ])assert.throws(()=>H.syntheticArchiveMembers(REPLAY_ID,malformed,pins));
  assert.throws(()=>H.syntheticArchiveMembers('SRC001-REPLAY-20260914T000000Z-'+'a'.repeat(32),archive,pins));
  assert.throws(()=>H.syntheticArchiveMembers(REPLAY_ID,archive,[{...pins[0],sha256:H.digest('wrong')}]));
});
test('visibility derivation closure, generations, and unapproved roots',()=>{
  const c=fixture(),output=c.f.put('SYNTHETIC-derived.txt',Buffer.from('SYNTHETIC recorded ordinary output'));
  const rule={rule_id:'SYNTHETIC-derive',contract_ref:c.generic,input_classes:['source'],producing_principal:'SYNTHETIC-producer',output_class:'derived'};
  const derivation=c.mk('derivation',{replay_id:REPLAY_ID,rule_id:rule.rule_id,input_refs:[c.sourceRef],
    operation_ref:c.generic,invocation_or_gate_ref:c.generic,producer:rule.producing_principal,output_ref:output});
  const manifest=structuredClone(c.visibility);
  manifest.derivation_rules=[rule];
  manifest.allowed_entries.push({entry_id:'SYNTHETIC-derived',artifact_ref:output,class:'derived',consumers:['SYNTHETIC-extractor'],
    access:'read-only',origin:'ordinary-run-output',derivation_ref:c.f.put('SYNTHETIC-derivation.json',derivation)});
  const trust={...c.trust,derivation_rules:[rule],receipt_refs:[...c.trust.receipt_refs,c.generic]};
  H.visibilityClosure(manifest,c.f.stores,trust);
  const first=c.mk('visibility-generation',{replay_id:REPLAY_ID,generation:'0',previous_digest:null,manifest_ref:c.generic,derivation_refs:[]});
  const next={...first,generation:'1',previous_digest:H.digest(H.canonicalBytes(first))};
  H.visibilityGenerations([first,next],c.f.stores);
  assert.throws(()=>H.visibilityGenerations([first,{...next,previous_digest:H.digest('wrong')}],c.f.stores));
  manifest.allowed_entries.at(-1).derivation_ref=null;
  assert.throws(()=>H.visibilityClosure(manifest,c.f.stores,trust));
});
test('manual conditional reviewer, L3/L2S pass reuse, normalizer pass and no fallback',()=>{
  const c=fixture();c.mode={...c.mode,mode:'manual',sanction_status:'sanctioned-manual-path',evidence_kind:'manual-separate-pass'};
  c.execution.mode_ref=c.f.put('SYNTHETIC-manual-mode.json',c.mode);
  const first={role:'verifier-l3',round:'1',verdict:'cannot-determine',
    profile:{profile_id:'n/a (core-manual)',profile_digest:null,role:'verifier-l3',model_identity:'human'},
    evidence:{producer_actor:'SYNTHETIC-producer',reviewer_actor:'SYNTHETIC-reviewer-1',producer_pass_id:'SYNTHETIC-produce',
      reviewer_pass_id:'SYNTHETIC-review-1',subject_digest:c.generic.sha256,shown_digest:c.generic.sha256,withheld_declaration:'SYNTHETIC withheld'}};
  const second={...structuredClone(first),round:'2',verdict:'upheld',
    evidence:{...first.evidence,reviewer_actor:'SYNTHETIC-reviewer-2',reviewer_pass_id:'SYNTHETIC-review-2'}};
  c.execution.manual_passes=[first,second];rule(c,'R05')();
  second.evidence.reviewer_actor=first.evidence.reviewer_actor;
  assert.equal(H.check('R05',rule(c,'R05')).token,'BLOCKED_CONTEXT_EVIDENCE');
  second.evidence.reviewer_actor='SYNTHETIC-reviewer-2';
  c.execution.manual_passes.push({...structuredClone(first),role:'verifier-l2s',verdict:'upheld',
    profile:{...first.profile,role:'verifier-l2s'},evidence:{...first.evidence,producer_pass_id:'SYNTHETIC-normalizer',reviewer_actor:'SYNTHETIC-L2S'}});
  assert.equal(H.check('R05',rule(c,'R05')).token,'BLOCKED_CONTEXT_EVIDENCE');
  c.execution.manual_passes.at(-1).evidence.reviewer_pass_id='SYNTHETIC-normalizer';
  assert.equal(H.check('R05',rule(c,'R05')).token,'BLOCKED_CONTEXT_EVIDENCE');
  c.execution.manual_passes=[first,second];c.execution.no_fallback=false;
  assert.equal(H.check('R05',rule(c,'R05')).token,'BLOCKED_EXECUTION_MODE_POLICY');
});
test('comparison output inventory and synthetic audit subject structure',()=>{
  const c=fixture(),root=join(c.f.root,'SYNTHETIC-comparison-outputs');
  mkdirSync(root);writeFileSync(join(root,'semantic-report.json'),H.canonicalBytes(c.semantic),{mode:0o600});
  const store=c.f.stores.sealSynthetic(root),output=c.f.stores.ref(store,'semantic-report.json');
  const end={format:'src001-replay-event/v1',replay_id:REPLAY_ID,sequence:String(c.events.length),
    previous_event_digest:H.digest(H.canonicalBytes(c.events.at(-1))),utc_time:TIME,actor:'SYNTHETIC-comparator',
    event_kind:'comparison-end',artifact_refs:[output]};
  const entries=H.inventory(root);
  const body={format:'src001-replay-comparison-inventory/v1',comparison_id:c.comparison.comparison_id,entries};
  const record={...body,inventory_digest:H.digest(H.canonicalBytes(body)),end_event_ref:c.f.put('SYNTHETIC-comparison-end.json',end),
    pre_replay_inventory_digest:c.inv.inventory_digest,post_replay_inventory_digest:c.inv.inventory_digest,
    verification_refs:[c.generic],output_refs:[output]};
  H.comparisonInventory(record,root,c.freeze,c.resultRoot,c.f.stores);
  assert.throws(()=>H.comparisonInventory({...record,post_replay_inventory_digest:H.digest('wrong')},root,c.freeze,c.resultRoot,c.f.stores));
  const audit=c.mk('audit-manifest',{audit_id:'SYNTHETIC-audit-shape-only',comparison_id:c.comparison.comparison_id,
    auditor_identity:'SYNTHETIC-separate-auditor',context_id:'SYNTHETIC-audit-context',implementation_ref:c.comparison.implementation_ref,
    freeze_receipt_sha256:c.comparison.freeze_receipt_sha256,replay_inventory_digest:c.inv.inventory_digest,
    comparison_inventory_ref:c.f.put('SYNTHETIC-comparison-inventory.json',record)});
  H.auditManifest(audit,c.comparison,c.f.stores);
  assert.throws(()=>H.auditManifest({...audit,auditor_identity:c.comparison.comparator_identity},c.comparison,c.f.stores));
});
test('protocol inventory and unchanged imported Core contract lock',()=>{
  H.verifyProtocolLock();
});
test('deterministic repeated R01-R09 reports and independently rebuilt fixture identities',()=>{
  const first=positiveResults;
  const second=Object.keys(H.PROPOSITIONS).map(id=>H.check(id,rule(controls,id)));
  assert(H.canonicalBytes(first).equals(H.canonicalBytes(second)));
  const rebuilt=fixture();
  assert.equal(rebuilt.inv.inventory_digest,controls.inv.inventory_digest);
  assert.equal(H.digest(H.canonicalBytes(rebuilt.freeze)),H.digest(H.canonicalBytes(controls.freeze)));
});
test('mutation evidence retains actual synthetic payload bytes without temporary-store dependence',()=>{
  for(const mutation of mutations)for(const item of [...mutation.referenced_artifacts_before,...mutation.referenced_artifacts_after,
    ...mutation.snapshot_files_before,...mutation.snapshot_files_after]) {
    if(item.blob_sha256)assert.equal(H.digest(Buffer.from(retainedBlobs.get(item.blob_sha256)!,'base64')),item.blob_sha256);
    else assert(item.unresolved_reason);
  }
});
const evidence={format:'SYNTHETIC-harness-test-evidence/v1',execution_class:'synthetic',tests,controls:positiveResults,mutations,
  blobs:[...retainedBlobs].sort(([a],[b])=>a.localeCompare(b)).map(([sha256,base64])=>({sha256,byte_length:String(Buffer.from(base64,'base64').length),base64})),
  real_release_preparations:'0',attestation_probes:'0',replay_model_calls:'0',real_replay_ids:'0',closed_reference_accesses:'0',real_comparisons:'0'};
const reportArg=process.argv.indexOf('--report');
if(reportArg>=0) {
  const path=resolve(process.argv[reportArg+1]);
  assert(path.startsWith(resolve('calibration/src-001/replay/tests/evidence')+'/') || path.startsWith('/tmp/SYNTHETIC-'));
  writeFileSync(path,H.canonicalBytes(evidence),{flag:'wx',mode:0o600});
}
const failures=tests.filter(t=>t.result==='FAIL');
console.log(`SYNTHETIC TESTS ${tests.length-failures.length}/${tests.length}; MUTATIONS ${mutations.filter(m=>m.result.token===m.expected_token).length}/29`);
process.exitCode=failures.length?1:0;
