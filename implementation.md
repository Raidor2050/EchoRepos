# Implementation Notes

Decisions and mechanics behind EchoRepos, for future maintainers (human or AI).

## Architecture

Single-page React app, fully static. Vite builds to `dist/`; GitHub Pages serves it at `/EchoRepos/` via Actions. HashRouter avoids server-side rewrites.

State: one React context (`src/lib/store.tsx`) holding favorites, learned-lessons, quiz answers and command-palette open state, persisted through a versioned localStorage envelope (`src/lib/engine.ts`, keys `er:favs`, `er:learned`, `er:quiz`). Migrations slot into `migrate()`.

## Data pipeline

- **Seed layer** - 727 repos written as compact rows (`seed('owner/name', category, [extra], lang, {...})`) across 20 files in `src/data/repos/` (17 curated + 3 API-generated expansion batches). The factory expands defaults: forks ≈ 16% of stars, per-category use-cases, topics.
- **Merge layer** — `src/lib/data.ts` concatenates seeds, then overlays `stats.generated.json` (live stars/forks/pushed_at) when present, and prebuilds indexes (`BY_ID`, language stats, per-category lists).
- **Refresh** — `scripts/fetch-stats.mjs` hits the GitHub REST API with cached ETags (304-friendly) and requires `GITHUB_TOKEN`.

Invariants enforced by `tests/data.test.ts`: ≥200 repos, unique `owner/name` ids, closed category union, signal ranges 0–100, alternatives shape + no self-reference, lesson slugs ↔ search hints sync.

## Search engine (`src/lib/search.ts`)

Pure functions. Pipeline: tokenize → synonym expansion → per-doc field scoring (name > topics > tech/lang > categories > useCases > desc) → NL-intent boosts (12 regex intents) → popularity tiebreak prior. Empty query returns a popularity/activity blend. Queries with tokens but zero literal matches fall back to intent-matched slices, else empty (drives the Explore empty state).

Suggestions merge three sources in priority order: LESSON_HINTS match → category label match → top repo results.

## Recommender (`src/lib/recommend.ts`)

Quiz answers → five weighted dimensions (category .26, capability .22, priority .24, tech .16, difficulty .12). Raw score is normalized to a 38–97 match band (`38 + 58·raw^0.92`) so the median pool lands mid-range and top picks hit 85–97. Reasons come from the two highest-contributing dimensions above a 0.08 floor, with a star-count fallback.

Diversity pass: greedy selection where each pick minimizes `max(langCount, primaryCatCount)` over the last-9 window — guarantees ≤4 same language and ≤5 same primary category in any sliding 10-window (test-enforced).

## Universe canvas (`src/components/universe/*`)

Deterministic mulberry32 RNG so layout is stable across loads. Clusters = 24 ecosystems on two rings around an "EchoRepos" hub; nodes orbit parametrically with pointer parallax; edges are intra-cluster lattices + quadratic hub spokes + random chords. Glow uses pre-rendered radial-gradient sprites drawn with `lighter` compositing. Adaptive quality: DPR cap 1.75, fps watchdog (sustained <42fps → drop glows + halve particles), visibility + offscreen pause, full static frame under prefers-reduced-motion. Hit-testing is a linear scan (~220 nodes).

## Styling

Four CSS layers: `tokens.css` (palette/type/spacing vars) → `base.css` (reset, focus, reduced-motion kill-switch) → `components.css` (buttons/cards/nav/chips/palette) → `pages-a|b.css` (page layouts + keyframes). No framework; color-mix() derives tints from category hues.

## Deployment

`.github/workflows/deploy.yml`: install → typecheck → vitest → build → upload-pages-artifact → deploy-pages, concurrency-grouped. Base path fixed in vite.config.ts.
