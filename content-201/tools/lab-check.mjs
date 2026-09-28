#!/usr/bin/env node
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const readJson = async (name) => JSON.parse(await readFile(path.join(root, name), 'utf8'))
const journey = await readJson('journey.json')
const expected = ['00-preflight', '01-declare', '02-identify', '03-allow-infer', '04-deny', '05-verify', '06-break-qualify', '07-export-close']
assert.equal(journey.schema, 'sovereign-ai-201-journey/v1')
assert.deepEqual(journey.stages.map((stage) => stage.id), expected)
assert.equal(journey.stages.reduce((sum, stage) => sum + stage.minutes, 0), journey.duration_minutes)
assert.equal(new Set(journey.stages.map((stage) => stage.produces)).size, expected.length)

const allowed = await readJson('fixtures/allowed.rehearsal.json')
const denied = await readJson('fixtures/denied.rehearsal.json')
const proof = await readJson('fixtures/proof.rehearsal.json')
for (const fixture of [allowed, denied, proof]) assert.equal(fixture.source, 'REHEARSAL')
assert.equal(allowed.policy.decision, 'ALLOW')
assert.ok(allowed.inference?.model)
assert.equal(denied.policy.decision, 'DENY')
assert.equal(denied.inference, null, 'denied fixture must prove no inference')
assert.equal(proof.grants_authority, false, 'receipt cannot grant authority')
assert.deepEqual(proof.request_ids, [allowed.request_id, denied.request_id])

for (const id of expected) {
  const module = await readFile(path.join(root, 'modules', `${id}.md`), 'utf8')
  for (const heading of ['## Objective', '## Build', '## Verify', '## Learner checkpoint']) assert.ok(module.includes(heading), `${id}: missing ${heading}`)
  assert.ok(module.includes('Source state:'), `${id}: missing source-state instruction`)
}
console.log('Sovereign AI 201 lab valid: 8 stages / 75 minutes / allow + deny + proof + authority invariants.')
