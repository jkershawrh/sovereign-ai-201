import type { DemoConfig } from './types'

const technicalTopology = {
  boundary: { label: 'OpenShift project', detail: 'governed workload boundary' },
  entry: { id: 'engineer', kind: 'actor', label: 'Platform engineer', detail: 'defines request + reviews proof' },
  primaryPath: [
    { id: 'frontend', kind: 'deployment', label: 'frontend', detail: 'React workload experience', endpoint: 'Service :9001', edgeLabel: 'HTTPS' },
    { id: 'api', kind: 'deployment', label: 'demo-api', detail: 'typed integration facade', endpoint: 'Service :9099', edgeLabel: 'HTTP/JSON' },
    { id: 'router', kind: 'deployment', label: 'prompt-adapter', detail: 'classify + route', endpoint: 'Service :8001', edgeLabel: 'OpenAI API' },
    { id: 'model', kind: 'deployment', label: 'OVMS + Granite', detail: 'Intel Xeon CPU inference', endpoint: 'Service :8080', edgeLabel: '/v3/chat' },
  ],
  supportPath: [
    { id: 'opa', kind: 'policy', label: 'OPA', detail: 'default-deny residency + access', endpoint: 'Service :8181', edgeLabel: 'evaluate' },
    { id: 'gateway', kind: 'service', label: 'ledger-gateway', detail: 'typed evidence writer', endpoint: 'Service :28099', edgeLabel: 'record' },
    { id: 'ledger', kind: 'deployment', label: 'immutable ledger', detail: 'ordered hash-linked evidence', endpoint: 'gRPC :9092', edgeLabel: 'persist' },
  ],
  optionalPath: { id: 'reviewer', kind: 'authority', label: 'Human review', detail: 'receipt is evidence—not permission', edgeLabel: 'verify' },
}

export const demoConfig: DemoConfig = {
  id: 'sovereign-ai-201',
  title: 'Build a Governed Sovereign AI Workload',
  subtitle: 'Red Hat OpenShift policy and proof · Intel Xeon CPU inference',
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
        { id: 'request', component: 'Workload contract', tone: 'primary', question: 'What must be known before the model is called?', answer: 'The request declares prompt, identity, classification, destination, and approved model.', detail: 'The frontend and demo-api make the workload inputs explicit before inference.', activeNodeIds: ['engineer', 'frontend', 'api'] },
        { id: 'policy', component: 'Deterministic policy', tone: 'primary', question: 'Who decides whether this request may proceed?', answer: 'OPA evaluates deny-by-default residency and model-access rules.', detail: 'The LLM cannot grant itself data movement, identity, or execution authority.', activeNodeIds: ['engineer', 'frontend', 'api', 'opa'] },
        { id: 'route', component: 'Prompt control', tone: 'success', question: 'How is unsafe or sensitive input handled?', answer: 'The prompt adapter classifies the request and blocks injection before inference.', detail: 'A rejected request returns a named outcome instead of a fabricated answer.', activeNodeIds: ['engineer', 'frontend', 'api', 'opa', 'router'] },
        { id: 'inference', component: 'Intel CPU inference', tone: 'partner', question: 'Which model actually produces the response?', answer: 'OVMS serves the approved open-weight Granite model on Intel Xeon CPU.', detail: 'Model identity comes from the AIBOM and live response—not from slide copy.', activeNodeIds: ['engineer', 'frontend', 'api', 'opa', 'router', 'model'] },
        { id: 'proof', component: 'Independent receipt', tone: 'success', question: 'How can a reviewer challenge the claim later?', answer: 'The gateway writes decision evidence to an independently verifiable ledger.', detail: 'The receipt proves integrity and ordering. It never grants permission or proves an action occurred.', activeNodeIds: ['engineer', 'frontend', 'api', 'opa', 'router', 'model', 'gateway', 'ledger', 'reviewer'] },
      ], technicalTopology, speakerPrompt: 'Pause on the question, then reveal the owning runtime object. Keep policy, LLM output, evidence, and authority visibly separate.' },
    ] },
    { id: 'proof', label: '02', title: 'Live governed journey', scenes: [
      { id: 'live', type: 'live-journey', beat: 'live-proof', eyebrow: 'Live governed workload', title: 'Follow one request—then change the condition', body: 'The same architecture must produce a distinguishable allow and deny outcome.', cta: 'Inspect the live workload', workspace: { label: 'Continue to the 201 lab', href: '/lab/' }, technicalTopology, nodes: [
        { id: 'request', label: 'Request', detail: 'identity + destination', tone: 'primary' },
        { id: 'policy', label: 'Policy', detail: 'deterministic allow or deny', tone: 'primary' },
        { id: 'route', label: 'Router', detail: 'classification + guardrail', tone: 'success' },
        { id: 'model', label: 'Granite on Xeon', detail: 'draft response only', tone: 'partner' },
        { id: 'proof', label: 'Receipt', detail: 'independent verification', tone: 'success' },
      ], steps: [
        { id: 'identity', title: 'Identify the approved workload', detail: 'Read model origin, license, evaluation state, and declared hardware before sending a prompt.', adapterId: 'sovereign-identity', activeNode: 0, activeNodeIds: ['engineer', 'frontend', 'api', 'model'], resultFields: [{ key: 'model', label: 'Model' }, { key: 'license', label: 'License' }, { key: 'hardware', label: 'Declared compute' }, { key: 'evaluation', label: 'Qualification' }] },
        { id: 'allow', title: 'Evaluate a local request', detail: 'OPA applies default-deny policy to a general prompt whose destination is local.', adapterId: 'sovereign-policy-allow', activeNode: 1, activeNodeIds: ['engineer', 'frontend', 'api', 'opa'], resultFields: [{ key: 'decision', label: 'Policy decision' }, { key: 'destination', label: 'Destination' }, { key: 'classification', label: 'Data class' }, { key: 'rule', label: 'Rule' }] },
        { id: 'infer', title: 'Run approved CPU inference', detail: 'The router classifies the allowed prompt, then OVMS serves Granite on Intel Xeon.', adapterId: 'sovereign-inference', activeNode: 3, activeNodeIds: ['engineer', 'frontend', 'api', 'opa', 'router', 'model', 'gateway'], resultFields: [{ key: 'route', label: 'Route outcome' }, { key: 'model', label: 'Live model' }, { key: 'latency', label: 'Request latency' }, { key: 'response', label: 'Model draft' }] },
        { id: 'deny', title: 'Change the sovereignty condition', detail: 'The same path now receives sensitive personal data bound for a non-approved region.', adapterId: 'sovereign-policy-deny', activeNode: 1, activeNodeIds: ['engineer', 'frontend', 'api', 'opa', 'gateway'], resultFields: [{ key: 'decision', label: 'Policy decision' }, { key: 'destination', label: 'Destination' }, { key: 'classification', label: 'Data class' }, { key: 'effect', label: 'Inference effect' }] },
        { id: 'verify', title: 'Verify the evidence chain', detail: 'A reviewer checks ledger integrity independently from the model and policy services.', adapterId: 'sovereign-proof', activeNode: 4, activeNodeIds: ['engineer', 'frontend', 'api', 'gateway', 'ledger', 'reviewer'], resultFields: [{ key: 'chain', label: 'Chain' }, { key: 'entries', label: 'Entries checked' }, { key: 'writers', label: 'Evidence writers' }, { key: 'authority', label: 'Final authority' }] },
      ], speakerPrompt: 'Name the source badge before interpreting anything. The live latency is measured in this browser session; fixture values never become performance claims.' },
      { id: 'comparison', type: 'comparison', beat: 'trials', eyebrow: 'Changed condition', title: 'The model did not make the sovereignty decision', columns: [
        { label: 'Local general request', value: 'Eligible', detail: 'OPA allows the destination; the router may call Granite on Intel Xeon.', tone: 'success' },
        { label: 'Sensitive cross-border request', value: 'Denied', detail: 'Default-deny policy stops the path before model inference.', tone: 'danger' },
        { label: 'Evidence receipt', value: 'Reviewable', detail: 'Allow and deny outcomes remain independently inspectable.', tone: 'partner' },
      ], speakerPrompt: 'The business result is controlled behavior under change. Do not turn this into a model accuracy claim.' },
    ] },
    { id: 'mechanism', label: '03', title: 'Implementation pattern', scenes: [
      { id: 'mechanisms', type: 'mechanisms', beat: 'trials', eyebrow: 'Why the pattern is reusable', title: 'Keep each responsibility independently testable', body: 'The lab builds these seams, tests failure behavior, and produces a reviewable receipt.', mechanisms: [
        { id: 'policy', label: 'Policy is code', claim: 'Default deny before inference.', detail: 'OPA owns jurisdiction and model-access rules; the LLM cannot rewrite them.', tone: 'primary' },
        { id: 'compute', label: 'Inference is bounded', claim: 'Approved Granite runs on Intel Xeon.', detail: 'OVMS provides the serving boundary while the AIBOM identifies the model artifact.', tone: 'partner' },
        { id: 'proof', label: 'Evidence is independent', claim: 'Every outcome can be challenged.', detail: 'The ledger preserves ordered evidence, but never becomes an authorization source.', tone: 'success' },
      ], speakerPrompt: 'This is the development blueprint: typed contract, deterministic guardrail, bounded inference, immutable evidence, human review.' },
    ] },
    { id: 'payoff', label: '04', title: 'Proof and handoff', scenes: [
      { id: 'payoff', type: 'evidence-payoff', beat: 'transformation', eyebrow: 'What this session established', title: 'Sovereignty becomes a property of the workload', adapterIds: ['sovereign-identity', 'sovereign-policy-allow', 'sovereign-inference', 'sovereign-policy-deny', 'sovereign-proof'], fallbackLine: 'Run the governed journey to populate this close', evidenceFields: [{ key: 'chain', label: 'Proof chain' }, { key: 'entries', label: 'Entries checked' }, { key: 'writers', label: 'Evidence writers' }, { key: 'authority', label: 'Authority' }], line1: 'Policy constrained the request. Intel Xeon served the approved model.', line2: 'The evidence—not the model—earned the claim.', cta: 'Next: build, break, and qualify this path in the Sovereign AI 201 lab →', speakerPrompt: 'If the proof is not live, say rehearsal or offline. Close the demo before offering the lab as the next journey.' },
    ] },
  ],
  journeyHandoffs: [
    { depth: 'lab', title: 'Sovereign AI 201 lab', duration: '60–90 minutes', question: 'Can your team build and qualify the same governed path?', technology: 'Red Hat OpenShift · OPA · Granite · OVMS · Intel Xeon · immutable ledger', instruction: 'Define the workload, enforce policy, run inference, test a denial, and export the receipt.', href: '/lab/' },
  ],
}
