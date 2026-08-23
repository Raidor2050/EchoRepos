# Progress Log

## 2026-08-23 — initial build complete

- Scaffolded Vite + React 18 + TS strict project; HashRouter locked for GH Pages.
- Authored design system (tokens/base/components/pages-a/pages-b) — AMOLED black, neon cyan/magenta accents, reduced-motion kill-switch.
- Built dataset: **227 repos** across 16 ecosystems via compact `seed()` factory; taxonomy with per-category hues; 12-lesson Learn track.
- Implemented engines: field-weighted search w/ synonyms + intents, quiz recommender w/ match% normalization + sliding-window diversity guard, Jaccard similarity, versioned localStorage store.
- Components: universe canvas constellation, ⌘K command palette, repo cards, filter rail, related-graph SVG, lesson diagrams, decor systems (grid/datastream/orbit/commit-chain).
- Pages: Home, Explore (URL-param filters), Categories (bubble map), Learn (+detail), Quiz (stepper → scan → results), RepoDetail, NotFound.
- Tests: 35 vitest cases green (data integrity, search behavior, recommender bounds/diversity).
- CI: deploy.yml runs typecheck+tests+build on push to main and publishes to GitHub Pages.

## Known follow-ups

- [ ] Run `npm run refresh-stats` with a token to overlay live star counts.
- [ ] Optional: lazy-route code splitting to shave the ~152KB gzipped bundle.
- [ ] Optional: sitemap/OG image polish.

## 2026-08-23 - v1.1 polish release

- Lazy routes: every page except Home is React.lazy code-split; vendor chunk split via manualChunks (initial JS now ~140KB gz across vendor+index).
- Page transitions: AnimatePresence fade/slide between routes, scroll reset on navigation, reduced-motion aware; RouteLoader fallback while chunks load.
- Full SPA navigation: removed remaining window.location.assign reloads (Categories bubbles, RelatedGraph satellites); footer /learn deep links now smooth-scroll in-app via location.hash.
- Copy sweep: all em dashes removed from UI copy and comments (~150 lines); en-dash ranges kept.
- Centered layout: page heads, hero, section headings, lesson/repo headers, step cards, category cards, breadcrumbs, filter pills and footers now center-aligned.