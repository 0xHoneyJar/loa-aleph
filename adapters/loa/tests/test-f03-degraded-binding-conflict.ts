import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { makeSemanticFixture, addFixtureMaterialFinding, writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { materialHash } from '../../../scripts/lib/source-representation.ts';
import { validateSemanticReturn, validateSemanticRun, semanticJson, semanticProducerBinding, semanticSubjectPath, semanticLedgerMarkdown, SEMANTIC_PATH } from '../../../scripts/lib/semantic-review.ts';
// This discriminator intentionally constructs synthetic Core records. It does
// not exercise the production controller or authenticate a native worker.
const root=mkdtempSync(join(tmpdir(),'f03-degraded-core-'));
const evidence=[];
try {
  for(const version of ['1.8.0-provisional','1.9.0-provisional']) {
    const f=makeSemanticFixture(join(root,version),undefined,undefined,undefined,version);
    addFixtureMaterialFinding(f);
    const baseline=validateSemanticRun(loadRun(f.run));
    const rawPath='verification/harness/semantic-process/manual-material-0716.raw.json';
    const raw=JSON.parse(readFileSync(join(f.run,rawPath),'utf8'));
    const material=raw.material_findings[0];
    const entry=raw.semantic_units[0];
    const degraded={...raw,packets:[{evidence_state:'degraded-non-exact',join_policy:'not-applicable',fragments:[],
      rendered_text:'Synthetic unresolvable material.',degraded_source_locator:'L1-L1',degradation_reason:'Grouping cannot be determined.',criterion:1,flags:[],material_use:material.material_use}],
      material_findings:[],semantic_units:[{...entry,output_kind:'packet-candidate'}]};
    const model=loadRun(f.run);
    const checked=validateSemanticReturn('extractor',version,degraded,{model,owner_stage:'S2',legal_source_ids:['SRC-701'],
      source_windows:[{source_id:'SRC-701',start_byte:0,end_byte:f.source.length}],packet_ids:[],origin_unit_refs:[]});
    assert.equal(checked.result,'PASS',checked.errors.join('; '));
    assert.equal(checked.binding,'checked');
    const multiple=structuredClone(degraded);
    multiple.packets[0].material_use.requirements.push({object_id:'OBJ-0001',feature:'formal-structure',binding_ids:['BND-0001']});
    const multipleChecked=validateSemanticReturn('extractor',version,multiple,{model,owner_stage:'S2',legal_source_ids:['SRC-701'],
      source_windows:[{source_id:'SRC-701',start_byte:0,end_byte:f.source.length}],packet_ids:[],origin_unit_refs:[]});
    assert.equal(multipleChecked.result,'PASS',multipleChecked.errors.join('; '));
    const producerPath='verification/harness/semantic-process/producer-0716.json';
    const producer=JSON.parse(readFileSync(join(f.run,producerPath),'utf8'));
    producer.output_kind='packet-candidate'; producer.raw_return_hash=materialHash(semanticJson(degraded));
    writeFixtureFile(f.run,rawPath,semanticJson(degraded));
    writeFixtureFile(f.run,producerPath,semanticJson(producer));
    const path=semanticSubjectPath('SEM-0716');
    const subject=JSON.parse(readFileSync(join(f.run,path),'utf8'));
    subject.producer_binding_hash=semanticProducerBinding(producer);
    writeFixtureFile(f.run,path,semanticJson(subject));
    const row=f.ledger.subjects.find(r=>r.semantic_id==='SEM-0716')!;
    row.subject_digest=materialHash(semanticJson(subject));
    row.producer_receipt_ref=`${producerPath}@${materialHash(semanticJson(producer))}`;
    writeFixtureFile(f.run,SEMANTIC_PATH,semanticLedgerMarkdown(f.ledger));
    let failure='';try{validateSemanticRun(loadRun(f.run));}catch(error){failure=String(error);}
    assert.match(failure,/SEM_SUBJECT material candidate: existing selected OBJ required/u);
    evidence.push({version,baseline_material_candidate_subjects:baseline.subjects,degraded_return:checked.result,
      degraded_return_binding:checked.binding,multiple_object_degraded_return:multipleChecked.result,retained_subject_failure:failure});
  }
  console.log(JSON.stringify({evidence_kind:'fixture-constructed Core contract discriminator; no production/native/live execution',evidence},null,2));
} finally {rmSync(root,{recursive:true,force:true});}
