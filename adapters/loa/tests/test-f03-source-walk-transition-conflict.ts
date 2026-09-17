import assert from 'node:assert/strict';
import {mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {makeSemanticFixture} from '../../../scripts/semantic-fixture-support.ts';
import {loadRun} from '../../../scripts/lib/run-model.ts';
import {runK2} from '../../../scripts/lib/checks-k2.ts';
import {ResultCollector} from '../../../scripts/lib/results.ts';
import {materialHash,readRepresentationContext,representationUsesMarkdown,planRepresentationUseWrite,validateRepresentationRun} from '../../../scripts/lib/source-representation.ts';
// C-02 discriminator only: separately valid snapshots do not imply a legal
// append-only transition. This intentionally expects the unrepaired conflict.
// It constructs synthetic Core records, with no CLI/native/model execution.
const root=mkdtempSync(join(tmpdir(),'f03-source-walk-conflict-'));
const evidence=[];
try {
 for(const version of ['1.8.0-provisional','1.9.0-provisional']) {
  const after=join(root,version,'after');const f=makeSemanticFixture(after,undefined,undefined,undefined,version);
  const before=join(root,version,'before');cpSync(after,before,{recursive:true});
  const walkPath='ledgers/source-walk.md',packetPath='ledgers/packet-index.md';
  const afterWalk=readFileSync(join(after,walkPath),'utf8'),afterPackets=readFileSync(join(after,packetPath),'utf8');
  const complete=afterWalk.split('\n').find(line=>line.startsWith('| SRC-701 |'))!;
  const blocked=complete.replace('CUR-0702','CUR-0701').replace('GAP-0701','none').replace('| complete |','| blocked |');
  const beforeWalk=afterWalk.split('\n').filter(line=>!/^\| (?:WLK|EVT|GAP)-/u.test(line)&&(!/^\| CUR-/u.test(line)||line.startsWith('| CUR-0701 |'))).join('\n').replace(complete,blocked);
  const beforePackets=afterPackets.split('\n').filter(line=>!/^\| (?:PKT|EVID|FRAG|TRN)-/u.test(line)).join('\n');
  writeFileSync(join(before,walkPath),beforeWalk);writeFileSync(join(before,packetPath),beforePackets);
  writeFileSync(join(before,'ledgers/representation-uses.md'),representationUsesMarkdown([]));
  const k214=(run:string)=>{const results=new ResultCollector('synthetic temporal walk discriminator');runK2(results,loadRun(run),join(run,'control/runtime/bundle'));return results.checks.filter(c=>c.id==='K2.14');};
  assert(k214(before).every(c=>c.status==='PASS'));assert(k214(after).every(c=>c.status==='PASS'));
  validateRepresentationRun(loadRun(before));validateRepresentationRun(loadRun(after));
  const row=readRepresentationContext(loadRun(after)).uses[0];
  const plan=(run:string)=>{try {const writes=[packetPath,walkPath].map(path=>{const a=readFileSync(join(run,path));return {path,before_hash:materialHash(readFileSync(join(before,path))),after_base64:a.toString('base64'),after_hash:materialHash(a)}});const planned=planRepresentationUseWrite({model:loadRun(before),proposedModel:loadRun(run),row,subjectWrites:writes,stage:'S2'});return {result:'PASS',writes:planned.writes.length};}catch(error){return {result:'FAIL',error:String(error)}}};
  const replaced=plan(after);assert.equal(replaced.result,'FAIL');assert.match(replaced.error!,/subject writes may insert rows but cannot replace retained lines/u);
  const stale=join(root,version,'keep-old');cpSync(after,stale,{recursive:true});writeFileSync(join(stale,walkPath),afterWalk.replace(complete,blocked));
  assert.equal(plan(stale).result,'PASS');assert(k214(stale).some(c=>c.status==='FAIL'&&c.message.includes('last recorded cursor')));
  const append=join(root,version,'append-next');cpSync(after,append,{recursive:true});writeFileSync(join(append,walkPath),afterWalk.replace(complete,blocked+'\n'+complete));
  assert.equal(plan(append).result,'PASS');assert(k214(append).some(c=>c.message.includes('more than one final traversal state')));
  const omit=join(root,version,'omit-before');cpSync(before,omit,{recursive:true});writeFileSync(join(omit,walkPath),beforeWalk.replace(blocked+'\n',''));
  assert(k214(omit).some(c=>c.message.includes('lacks one per-source completion row')));
  evidence.push({version,before:k214(before),after:k214(after),replace_completion:replaced,keep_old_completion:{plan:plan(stale),checks:k214(stale)},append_completion_successor:{plan:plan(append),checks:k214(append)},omit_completion:k214(omit)});
 }
 console.log(JSON.stringify({evidence_kind:'synthetic Core transition discriminator; no production/native/model execution',evidence},null,2));
}finally{rmSync(root,{recursive:true,force:true})}
