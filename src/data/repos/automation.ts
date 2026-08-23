import { seed } from './factory'

/** Workflow automation and orchestration platforms. */
export const AUTOMATION = [
  seed('n8n-io/n8n', 'automation', ['agents'], 'TypeScript', {
    d: 'Node-based workflow automation with 400+ integrations and native AI-agent steps. Fair-code licensed.',
    w: 'Node-based workflow automation with fair-code license',
    t: 'Nodes Workflows Integrations Ai-steps Self-hosted',
    u: 'automation-scraping ai-integration data-pipelines', p: 'self-hosted tool app-template', diff: 'b',
    sig: [90, 99, 88, 86], s: 95000, f: 26000, topics: 'workflow automation integrations low-code',
    alt: 'activepieces/activepieces node-red/node-red',
  }),
  seed('huginn/huginn', 'automation', [], 'Ruby', {
    d: 'Build agents that monitor the web and act on your behalf — the original personal automation engine.',
    w: 'Build agents monitoring and acting on web',
    t: 'Agents Events Triggers Scraping Website-agents',
    u: 'automation-scraping data-pipelines', p: 'self-hosted', diff: 'i',
    sig: [70, 42, 78, 80], s: 46000, up: '2025-10',
  }),
  seed('node-red/node-red', 'automation', ['devops'], 'JavaScript', {
    d: 'Flow-based wiring of hardware devices, APIs and services with a browser editor — IoT classic.',
    w: 'Flow-based wiring for IoT and integration',
    t: 'Flows Nodes Dashboard MQTT Browser-editor',
    u: 'automation-scraping deploy-infra realtime-chat', p: 'self-hosted tool', diff: 'b',
    sig: [66, 80, 88, 84], s: 20000,
  }),
  seed('apache/airflow', 'automation', ['datasci'], 'Python', {
    d: 'The platform to programmatically author, schedule and monitor data pipelines as DAGs.',
    w: 'Platform for authoring scheduling monitoring workflows',
    t: 'DAGs Scheduling Operators Backfills Sensors',
    u: 'data-pipelines automation-scraping deploy-infra', p: 'self-hosted framework', diff: 'i',
    sig: [82, 92, 96, 78], s: 40000,
  }),
  seed('PrefectHQ/prefect', 'automation', ['datasci'], 'Python', {
    d: 'Pythonic workflow orchestration with dynamic DAGs, retries, caching and beautiful observability.',
    w: 'Pythonic workflow orchestration for dataflows',
    t: 'Flows Tasks Dynamic-dag Observability Blocks',
    u: 'data-pipelines automation-scraping', p: 'framework self-hosted', diff: 'b',
    sig: [64, 88, 88, 86], s: 19000, alt: 'apache/airflow temporalio/temporal',
  }),
  seed('temporalio/temporal', 'automation', ['backend'], 'Go', {
    d: 'Durable execution engine: workflows that survive crashes, retries and long-running business logic.',
    w: 'Durable execution engine for reliable applications',
    t: 'Durable-execution Activities Determinism Replay Workers',
    u: 'data-pipelines deploy-infra saas', p: 'engine self-hosted', diff: 'a',
    sig: [68, 94, 94, 76], s: 15000, f: 1300,
  }),
  seed('windmill-labs/windmill', 'automation', ['devtools'], 'TypeScript', {
    d: 'Turn scripts into workflows, internal apps and UIs — fast multi-language developer platform.',
    w: 'Turn scripts into workflows and UIs',
    t: 'Scripts Flows Internal-apps Schedule Deno', l: 'Svelte Go Python',
    u: 'automation-scraping dev-tooling dashboards-viz', p: 'self-hosted app-template', diff: 'i',
    sig: [62, 97, 84, 84], s: 13000, f: 700,
  }),
  seed('activepieces/activepieces', 'automation', ['agents'], 'TypeScript', {
    d: 'Open-source no-code Zapier alternative with AI steps and hundreds of community connectors.',
    w: 'Open-source no-code Zapier alternative',
    t: 'Connectors Pieces Ai-steps Webhooks Mcp',
    u: 'automation-scraping ai-integration', p: 'self-hosted app-template', diff: 'b',
    sig: [64, 98, 82, 84], s: 15000, f: 2200, alt: 'n8n-io/n8n',
  }),
]
