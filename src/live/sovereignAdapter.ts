import type { LiveDataAdapter } from '../types'
import { registerAdapter } from './adapters'

type Condition = 'allowed' | 'denied' | 'injection' | 'unavailable'

const evidenceIds: string[] = []

async function json<T>(url: string, signal: AbortSignal, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    signal,
  })
  if (!response.ok) throw new Error(`Qualification endpoint returned HTTP ${response.status}`)
  return response.json() as Promise<T>
}

function adapter(id: string, rehearsal: Record<string, unknown>, load: LiveDataAdapter['load'], timeoutMs = 12_000): LiveDataAdapter {
  return { id, timeoutMs, load, rehearsal: { data: rehearsal, collectedAt: '2026-09-28T00:00:00.000Z' } }
}

function governedRequest(condition: Condition) {
  const id = crypto.randomUUID()
  const destination = condition === 'denied' ? 'us-east-1' : 'local'
  return {
    contract_version: 'sovereign-inference/v1',
    request_id: id,
    correlation_id: `demo-${condition}-${id}`,
    identity: { subject: 'spiffe://northstar.example/workload/claims-assistant', trust_domain: 'northstar.example' },
    residency: { data_origin: 'local', approved_regions: ['local', 'eu-central'], destination_region: destination },
    data_classification: condition === 'denied' ? 'sensitive_personal' : 'general',
    requested_model: 'granite-3.2-sovereign',
    prompt: 'Draft a three-bullet case summary from the approved, non-personal claim facts.',
    final_decision_owner: 'claims-analyst',
  }
}

async function qualify(condition: Condition, signal: AbortSignal) {
  if (condition === 'allowed') evidenceIds.splice(0)
  const response = await json<any>(`/api/v1/qualify?condition=${condition}`, signal, {
    method: 'POST', body: JSON.stringify(governedRequest(condition)),
  })
  if (response.evidence_id) evidenceIds.push(response.evidence_id)
  return {
    outcome: response.outcome,
    policy: response.policy?.decision ?? 'NOT_EVALUATED',
    reason: response.policy?.reason ?? 'unreported',
    model: response.model?.id ?? 'not invoked',
    model_participated: response.model_participated ? 'yes' : 'no',
    source_state: response.source_state,
    authority: response.authority,
  }
}

registerAdapter(adapter('sovereign-allowed', {
  outcome: 'ALLOWED', policy: 'ALLOW', reason: 'destination and model are approved', model: 'not invoked', model_participated: 'no', source_state: 'REHEARSAL', authority: 'HUMAN_REVIEW_REQUIRED',
}, (signal) => qualify('allowed', signal)))

registerAdapter(adapter('sovereign-denied', {
  outcome: 'POLICY_DENIED', policy: 'DENY', reason: 'destination region is not approved', model: 'not invoked', model_participated: 'no', source_state: 'REHEARSAL', authority: 'HUMAN_REVIEW_REQUIRED',
}, (signal) => qualify('denied', signal)))

registerAdapter(adapter('sovereign-injection', {
  outcome: 'INJECTION_BLOCKED', policy: 'DENY', reason: 'prompt injection pattern detected', model: 'not invoked', model_participated: 'no', source_state: 'REHEARSAL', authority: 'HUMAN_REVIEW_REQUIRED',
}, (signal) => qualify('injection', signal)))

registerAdapter(adapter('sovereign-unavailable', {
  outcome: 'DEPENDENCY_UNAVAILABLE', policy: 'NOT_EVALUATED', reason: 'required dependency is unavailable', model: 'not invoked', model_participated: 'no', source_state: 'OFFLINE', authority: 'HUMAN_REVIEW_REQUIRED',
}, (signal) => qualify('unavailable', signal)))

registerAdapter(adapter('sovereign-proof', {
  outcome: 'EVIDENCE_REVIEW', records: 4, correlated: 'yes', secrets_recorded: 'no', source_state: 'REHEARSAL', authority: 'HUMAN_REVIEW_REQUIRED',
}, async (signal) => {
  if (!evidenceIds.length) throw new Error('Run the qualification conditions first.')
  const records = await Promise.all(evidenceIds.map((id) => json<any>(`/api/v1/evidence/${id}`, signal)))
  const states = new Set(records.map((record) => record.source_state))
  const reportedState = states.has('OFFLINE') ? 'OFFLINE' : states.size === 1 && states.has('LIVE') ? 'LIVE' : 'REHEARSAL'
  return {
    outcome: 'EVIDENCE_REVIEW',
    records: records.length,
    correlated: records.every((record) => record.correlation_id && record.request_sha256) ? 'yes' : 'no',
    secrets_recorded: records.some((record) => record.secret_values_recorded) ? 'yes' : 'no',
    source_state: reportedState,
    authority: 'HUMAN_REVIEW_REQUIRED',
  }
}))
