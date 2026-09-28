import type { LiveDataAdapter } from '../types'
import { registerAdapter } from './adapters'

async function json<T>(url: string, signal: AbortSignal, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    signal,
  })
  if (!response.ok) throw new Error(`Live endpoint returned HTTP ${response.status}`)
  return response.json() as Promise<T>
}

function adapter(id: string, rehearsal: Record<string, unknown>, load: LiveDataAdapter['load'], timeoutMs = 12_000): LiveDataAdapter {
  return { id, timeoutMs, load, rehearsal: { data: rehearsal, collectedAt: '2026-09-28T00:00:00.000Z' } }
}

registerAdapter(adapter('sovereign-identity', {
  model: 'sovereign-granite-2b-instruct', license: 'Apache-2.0', provenance: 'cca90cb67fd…', evaluation: 'all gates passed', hardware: 'Intel Xeon CPU',
}, async (signal) => {
  const aibom = await json<any>('/api/model/aibom', signal)
  return {
    model: aibom.model?.name ?? 'unreported',
    license: aibom.model?.base_model?.license ?? 'unreported',
    provenance: aibom.provenance_hash?.slice(0, 12) ?? 'unreported',
    evaluation: aibom.model?.evaluation?.all_pass ? 'all gates passed' : 'not qualified',
    hardware: aibom.model?.adaptation?.training_environment?.node_type ?? 'unreported',
  }
}))

registerAdapter(adapter('sovereign-policy-allow', {
  decision: 'ALLOW', destination: 'local', classification: 'general', rule: 'local processing is allowed',
}, async (signal) => {
  const result = await json<{ result: boolean }>('/api/policies/evaluate', signal, {
    method: 'POST', body: JSON.stringify({ policy: 'sovereign/data_residency/allow', input: { destination_region: 'local', data_classification: 'general' } }),
  })
  return { decision: result.result ? 'ALLOW' : 'DENY', destination: 'local', classification: 'general', rule: 'default deny + explicit local allow' }
}))

registerAdapter(adapter('sovereign-inference', {
  route: 'completed', model: 'granite-3.2-sovereign', latency: 'rehearsal only', response: 'Local processing keeps the request inside the governed workload boundary.',
}, async (signal) => {
  const start = performance.now()
  const result = await json<any>('/api/route', signal, {
    method: 'POST', body: JSON.stringify({ prompt: 'Explain why local processing supports data sovereignty in one sentence.', max_tokens: 80 }),
  })
  return { route: result.route, model: result.model ?? 'unreported', latency: `${Math.round(performance.now() - start)} ms`, response: result.response ?? result.reason ?? 'No response returned' }
}, 65_000))

registerAdapter(adapter('sovereign-policy-deny', {
  decision: 'DENY', destination: 'us-east-1', classification: 'sensitive_personal', effect: 'inference not authorized',
}, async (signal) => {
  const result = await json<{ result: boolean }>('/api/policies/evaluate', signal, {
    method: 'POST', body: JSON.stringify({ policy: 'sovereign/data_residency/allow', input: { destination_region: 'us-east-1', data_classification: 'sensitive_personal' } }),
  })
  return { decision: result.result ? 'ALLOW' : 'DENY', destination: 'us-east-1', classification: 'sensitive_personal', effect: result.result ? 'eligible for routing' : 'inference not authorized' }
}))

registerAdapter(adapter('sovereign-proof', {
  chain: 'VALID', entries: 'rehearsal snapshot', writers: 'router + policy bridge', authority: 'human review',
}, async (signal) => {
  const [verification, writers] = await Promise.all([
    json<any>('/api/ledger/verify', signal),
    json<any>('/api/ledger/writers', signal),
  ])
  const checked = Array.isArray(verification.chains) ? verification.chains.reduce((sum: number, chain: any) => sum + Number(chain.entries_checked ?? 0), 0) : 0
  return { chain: verification.all_valid ? 'VALID' : 'INVALID', entries: checked, writers: Object.keys(writers.writers ?? {}).length, authority: 'human review' }
}))
