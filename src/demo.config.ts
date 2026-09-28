import type { DemoConfig } from './types'

const technicalTopology = {
  boundary: { label: 'OpenShift project', detail: 'governed workload boundary' },
  entry: { id: 'engineer', kind: 'actor', label: 'Platform engineer', detail: 'defines request + reviews proof' },
  primaryPath: [
    { id: 'frontend', kind: 'deployment', label: 'presentation', detail: 'typed qualification client', endpoint: 'Service :8080', edgeLabel: 'HTTP/JSON' },
    { id: 'service', kind: 'service', label: 'adapter Service', detail: 'stable namespace-local boundary', endpoint: 'Service :8080', edgeLabel: '/api/v1/qualify' },
    { id: 'adapter', kind: 'deployment', label: 'qualification adapter', detail: 'schema + policy + injection checks', endpoint: 'Deployment :8080', edgeLabel: 'validate' },
    { id: 'model', kind: 'model-endpoint', label: 'approved model', detail: 'Intel CPU inference when LIVE', endpoint: 'Secret-referenced HTTPS', edgeLabel: 'OpenAI API' },
  ],
  supportPath: [
    { id: 'secret', kind: 'secret-reference', label: 'runtime Secret reference', detail: 'model identity + endpoint; no values in source', edgeLabel: 'project' },
    { id: 'network', kind: 'network-policy', label: 'NetworkPolicy', detail: 'default deny + approved egress', edgeLabel: 'enforce' },
    { id: 'evidence', kind: 'service', label: 'evidence API', detail: 'redacted correlation receipt', endpoint: '/api/v1/evidence', edgeLabel: 'record' },
  ],
  optionalPath: { id: 'reviewer', kind: 'authority', label: 'Human review', detail: 'receipt is evidence—not permission', edgeLabel: 'verify' },
}

export const demoConfig: DemoConfig = {
  id: 'sovereign-ai-201',
  title: 'Build the Governed Inference Boundary',
  subtitle: 'Red Hat OpenShift controls · Intel CPU inference when LIVE',
  event: 'Sovereign AI learning journey',
  audience: 'AI platform engineers and governance leaders',
  cta: 'Build the governed request path.',
  brand: {
    primary: { name: 'Red Hat', logo: '/logos/redhat.svg', alt: 'Red Hat' },
    partner: { name: 'Intel', logo: '/logos/intel.png', alt: 'Intel' },
    attribution: 'Red Hat × Intel',
  },
  acts: [
    { id: 'story', label: '00', title: 'The sovereignty gap', scenes: [
      { id: 'intro', type: 'intro', beat: 'ordinary-world', title: 'The model is local. Is the workload sovereign?', subtitle: 'Location is a claim. Governance requires proof.', speakerPrompt: 'Open with the business question. A local endpoint does not tell us which policy ran, which model answered, where data could go, or whether the evidence can be verified.' },
      { id: 'reframe', type: 'reframe', beat: 'stakes', eyebrow: 'The implementation decision', title: 'Move sovereignty into the request path', before: 'Trust the deployment location', after: 'Prove each governed decision', detail: 'Separate deterministic policy, model inference, evidence recording, and human authority.', speakerPrompt: 'The reframe is architectural: sovereignty becomes an observable workload behavior, not a hosting label.' },
    ] },
    { id: 'architecture', label: '01', title: 'Guided architecture', scenes: [
      { id: 'guided-architecture', type: 'guided-architecture', beat: 'system-reveal', eyebrow: 'Governed workload architecture', title: 'One request. Five independent responsibilities.', body: 'Answer one implementation question at a time, then reveal the runtime boundary that owns it.', layers: [
        { id: 'request', component: 'Versioned contract', tone: 'primary', question: 'What must be known before the model is called?', answer: 'The request declares identity, residency, data class, model, prompt, correlation, and human owner.', detail: 'Schema validation rejects incomplete or credential-bearing requests before inference.', activeNodeIds: ['engineer', 'frontend', 'service', 'adapter'] },
        { id: 'policy', component: 'Deterministic policy', tone: 'primary', question: 'Who decides whether this request may proceed?', answer: 'The adapter evaluates platform-approved region and model configuration.', detail: 'The request and LLM cannot approve their own destination, model, or authority.', activeNodeIds: ['engineer', 'frontend', 'service', 'adapter'] },
        { id: 'platform', component: 'Secret + network boundary', tone: 'success', question: 'How are identity and reachability constrained?', answer: 'Secret references supply runtime identity while NetworkPolicy limits clients and model egress.', detail: 'No Secret value enters source, browser, request, fixture, or evidence.', activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'secret', 'network'] },
        { id: 'inference', component: 'Approved inference', tone: 'partner', question: 'When may the model actually participate?', answer: 'Only an allowed LIVE request with complete runtime identity reaches the approved endpoint.', detail: 'REHEARSAL qualifies mechanics without claiming model participation or hardware placement.', activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'secret', 'network', 'model'] },
        { id: 'proof', component: 'Correlated evidence', tone: 'success', question: 'How can a reviewer challenge every outcome?', answer: 'The evidence API records redacted identity, residency, policy, outcome, source state, and request hash.', detail: 'The receipt supports human review; it grants no deployment or promotion authority.', activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'evidence', 'reviewer'] },
      ], technicalTopology, speakerPrompt: 'Pause on the question, then reveal the owning runtime object. Keep policy, LLM output, evidence, and authority visibly separate.' },
    ] },
    { id: 'proof', label: '02', title: 'Live governed journey', scenes: [
      { id: 'live', type: 'live-journey', beat: 'live-proof', eyebrow: 'Governed boundary proof', title: 'One contract. Four distinguishable outcomes.', body: 'Allowed, denied, injection, and unavailable conditions must remain attributable and fail closed.', cta: 'Run the qualification journey', workspace: { label: 'Continue to the 201 lab', href: '/lab/' }, technicalTopology, nodes: [
        { id: 'request', label: 'Request', detail: 'identity + destination', tone: 'primary' },
        { id: 'policy', label: 'Policy', detail: 'deterministic allow or deny', tone: 'primary' },
        { id: 'route', label: 'Adapter', detail: 'schema + policy + injection guard', tone: 'success' },
        { id: 'model', label: 'Approved model', detail: 'LIVE advisory only', tone: 'partner' },
        { id: 'proof', label: 'Evidence', detail: 'correlation + human review', tone: 'success' },
      ], steps: [
        { id: 'allow', title: 'Qualify the allowed request', detail: 'A local request reaches the model only when policy allows and LIVE identity is complete.', adapterId: 'sovereign-allowed', activeNode: 3, activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'secret', 'network', 'model', 'evidence'], resultFields: [{ key: 'outcome', label: 'Outcome' }, { key: 'policy', label: 'Policy' }, { key: 'model_participated', label: 'Model participated' }, { key: 'model', label: 'Model identity' }] },
        { id: 'deny', title: 'Change the residency condition', detail: 'Sensitive data targets a region outside the platform-approved set.', adapterId: 'sovereign-denied', activeNode: 1, activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'network', 'evidence'], resultFields: [{ key: 'outcome', label: 'Outcome' }, { key: 'policy', label: 'Policy' }, { key: 'model_participated', label: 'Model participated' }, { key: 'reason', label: 'Reason' }] },
        { id: 'injection', title: 'Challenge the prompt boundary', detail: 'An injection pattern must be rejected before any model call.', adapterId: 'sovereign-injection', activeNode: 2, activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'evidence'], resultFields: [{ key: 'outcome', label: 'Outcome' }, { key: 'policy', label: 'Policy' }, { key: 'model_participated', label: 'Model participated' }, { key: 'reason', label: 'Reason' }] },
        { id: 'unavailable', title: 'Remove a required dependency', detail: 'The same contract returns a typed unavailable result with no invented advisory.', adapterId: 'sovereign-unavailable', activeNode: 2, activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'evidence'], resultFields: [{ key: 'outcome', label: 'Outcome' }, { key: 'policy', label: 'Policy' }, { key: 'model_participated', label: 'Model participated' }, { key: 'source_state', label: 'Source state' }] },
        { id: 'verify', title: 'Inspect correlated evidence', detail: 'The reviewer checks all retained outcomes without exposing prompt or Secret values.', adapterId: 'sovereign-proof', activeNode: 4, activeNodeIds: ['engineer', 'frontend', 'service', 'adapter', 'evidence', 'reviewer'], resultFields: [{ key: 'records', label: 'Records' }, { key: 'correlated', label: 'Correlation complete' }, { key: 'secrets_recorded', label: 'Secrets recorded' }, { key: 'authority', label: 'Final authority' }] },
      ], speakerPrompt: 'Name the source badge before interpreting anything. REHEARSAL and OFFLINE results never become live model or hardware claims.' },
      { id: 'comparison', type: 'comparison', beat: 'trials', eyebrow: 'Changed condition', title: 'The model did not make the sovereignty decision', columns: [
        { label: 'Local approved request', value: 'Allowed', detail: 'Policy permits the route; only LIVE identity permits model participation.', tone: 'success' },
        { label: 'Residency or injection violation', value: 'Denied', detail: 'The adapter returns a typed outcome with no model content.', tone: 'danger' },
        { label: 'Dependency outage', value: 'Unavailable', detail: 'The boundary fails closed and retains correlation evidence.', tone: 'partner' },
      ], speakerPrompt: 'The business result is controlled behavior under change. Do not turn this into a model accuracy claim.' },
    ] },
    { id: 'mechanism', label: '03', title: 'Implementation pattern', scenes: [
      { id: 'mechanisms', type: 'mechanisms', beat: 'trials', eyebrow: 'Why the pattern is reusable', title: 'Keep each responsibility independently testable', body: 'The lab builds these seams, tests failure behavior, and produces a reviewable receipt.', mechanisms: [
        { id: 'contract', label: 'CDD defines the seam', claim: 'Schemas exist before implementation.', detail: 'Request, response, evidence, and failure semantics make incompatible behavior visible.', tone: 'primary' },
        { id: 'tests', label: 'TDD qualifies change', claim: 'Every branch proves no unauthorized model call.', detail: 'Allowed, denied, malformed, injection, and unavailable paths share executable acceptance tests.', tone: 'partner' },
        { id: 'evidence', label: 'EDD preserves authority', claim: 'Every outcome remains reviewable.', detail: 'Redacted correlation evidence supports a named human decision and cleanup receipt.', tone: 'success' },
      ], speakerPrompt: 'This is the development blueprint: typed contract, deterministic guardrail, bounded inference, immutable evidence, human review.' },
    ] },
    { id: 'payoff', label: '04', title: 'Proof and handoff', scenes: [
      { id: 'payoff', type: 'evidence-payoff', beat: 'transformation', eyebrow: 'What this session established', title: 'Sovereignty becomes a property of the boundary', adapterIds: ['sovereign-allowed', 'sovereign-denied', 'sovereign-injection', 'sovereign-unavailable', 'sovereign-proof'], fallbackLine: 'Run the governed journey to populate this close', evidenceFields: [{ key: 'records', label: 'Evidence records' }, { key: 'correlated', label: 'Correlation complete' }, { key: 'secrets_recorded', label: 'Secrets recorded' }, { key: 'authority', label: 'Authority' }], line1: 'One contract separated allowed, denied, injection, and outage outcomes.', line2: 'The evidence—not the model—supports the human decision.', cta: 'Next: build, break, and qualify this path in the Sovereign AI 201 lab →', speakerPrompt: 'If the proof is not live, say rehearsal or offline. Close the demo before offering the lab as the next journey.' },
    ] },
  ],
  journeyHandoffs: [
    { depth: 'lab', title: 'Sovereign AI 201 Showroom', duration: '75–90 minutes', question: 'Can your team construct and qualify the same fail-closed boundary?', technology: 'Red Hat OpenShift · JSON Schema · Secret references · NetworkPolicy · typed evidence', instruction: 'Map, author, wire, allow, deny, break, review, and reclaim the workload.', href: '/lab/' },
  ],
}
