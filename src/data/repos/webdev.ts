import { seed } from './factory'

/** Meta-frameworks, fullstack tooling and content platforms. */
export const WEBDEV = [
  seed('vercel/next.js', 'webdev', ['frontend', 'backend'], 'JavaScript', {
    d: 'The React framework for the web — server rendering, file routing, API routes and edge deployment in one toolkit.',
    w: 'Industry-leading React fullstack framework',
    t: 'React SSR RSC Edge Turbopack', l: 'TypeScript',
    u: 'web-apps saas content-sites ai-integration', p: 'framework app-template', diff: 'i',
    sig: [96, 93, 95, 82], s: 130000, topics: 'react ssr fullstack vercel', alt: 'remix-run/remix nuxt/nuxt',
  }),
  seed('sveltejs/kit', 'webdev', ['frontend'], 'JavaScript', {
    d: 'Official Svelte application framework with file-based routing, server endpoints and adapters for every platform.',
    w: 'Official Svelte application framework',
    t: 'Svelte SSR Vite', l: 'TypeScript',
    u: 'web-apps content-sites', p: 'framework', diff: 'b',
    sig: [72, 88, 84, 88], s: 13000, f: 2100, alt: 'vercel/next.js nuxt/nuxt',
  }),
  seed('nuxt/nuxt', 'webdev', ['frontend', 'backend'], 'TypeScript', {
    d: 'The intuitive Vue meta-framework: hybrid rendering, auto-imported composables, and a huge module ecosystem.',
    w: 'Intuitive Vue fullstack framework',
    t: 'Vue SSR Nitro Vite',
    u: 'web-apps content-sites saas', p: 'framework', diff: 'i',
    sig: [86, 90, 90, 84], s: 56000, alt: 'vercel/next.js sveltejs/kit',
  }),
  seed('remix-run/remix', 'webdev', ['frontend', 'backend'], 'TypeScript', {
    d: 'Web-standards-first React framework centered on loaders, actions, nested routes and progressive enhancement.',
    w: 'Web-standards-first React fullstack framework',
    t: 'React Router SSR Forms',
    u: 'web-apps saas', p: 'framework', diff: 'i',
    sig: [78, 74, 86, 85], s: 31000, alt: 'vercel/next.js',
  }),
  seed('nestjs/nest', 'webdev', ['backend'], 'TypeScript', {
    d: 'Opinionated Node.js framework with dependency injection, modules and decorators for scalable server architecture.',
    w: 'Production-grade Node.js server framework',
    t: 'Express Fastify DI Microservices',
    u: 'apis saas deploy-infra', p: 'framework', diff: 'i',
    sig: [88, 87, 94, 80], s: 68000, alt: 'fastify/fastify expressjs/express',
  }),
  seed('strapi/strapi', 'webdev', ['backend'], 'JavaScript', {
    d: 'Leading open-source headless CMS: model your content, get REST + GraphQL APIs and an admin panel instantly.',
    w: 'Leading open-source headless CMS',
    t: 'GraphQL Admin Panel REST Headless', l: 'TypeScript',
    u: 'content-sites web-apps data-storage', p: 'self-hosted app-template', diff: 'b',
    sig: [86, 85, 88, 78], s: 65000,
  }),
  seed('appwrite/appwrite', 'webdev', ['backend', 'mobile'], 'TypeScript', {
    d: 'Self-hosted backend-as-a-service: databases, auth, functions, storage and realtime in one containerized platform.',
    w: 'Self-hosted Firebase alternative platform',
    t: 'Docker Realtime Auth Functions',
    u: 'data-storage auth-payments mobile-apps web-apps', p: 'self-hosted', diff: 'b',
    sig: [82, 89, 86, 76], s: 50000, alt: 'pocketbase/pocketbase supabase/supabase',
  }),
  seed('vitejs/vite', 'webdev', ['frontend', 'devtools'], 'TypeScript', {
    d: 'Next-generation frontend tooling: instant dev server, lightning HMR and a rollup-based production build.',
    w: 'Lightning-fast frontend build tooling standard',
    t: 'ESBuild Rollup HMR ESM',
    u: 'dev-tooling web-apps', p: 'tool', diff: 'b',
    sig: [92, 96, 95, 84], s: 72000,
  }),
  seed('withastro/astro', 'webdev', ['frontend'], 'TypeScript', {
    d: 'Content-driven websites with island architecture: ship zero JS by default, embed any UI framework where needed.',
    w: 'Content-driven sites with island architecture',
    t: 'Islands MDX SSG Vite',
    u: 'content-sites web-apps', p: 'framework', diff: 'b',
    sig: [84, 92, 88, 90], s: 50000,
  }),
  seed('BuilderIO/qwik', 'webdev', ['frontend'], 'TypeScript', {
    d: 'Resumable framework that executes almost no JS on load — fine-grained laziness for near-instant interactivity.',
    w: 'Resumable framework with instant-load performance',
    t: 'Resumability Signals Lazy-hydration',
    u: 'web-apps', p: 'framework', diff: 'a',
    sig: [64, 78, 66, 72], s: 21000,
  }),
  seed('rollup/rollup', 'webdev', ['devtools'], 'JavaScript', {
    d: 'The ES-module bundler that popularized tree-shaking; powers Vite and most modern library builds.',
    w: 'Efficient ES-module bundler powering toolchains',
    t: 'Tree-shaking ESM Plugins',
    u: 'dev-tooling', p: 'tool', diff: 'b',
    sig: [76, 82, 93, 70], s: 26000,
  }),
]
