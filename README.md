# EchoRepos

**Navigate the open source universe** — a cinematic, AMOLED-black interactive site that teaches GitHub fundamentals and surfaces 727 hand-picked open-source repositories across 24 ecosystems.

Live: https://raidor2050.github.io/EchoRepos/

## What's inside

- **Universe hero** — a living canvas constellation of curated repos; hover any node for details, click to dive in.
- **Command search (⌘K / Ctrl+K)** — natural-language search with synonym expansion (`py → python`), intent detection ("beginner python projects"), repo/category/lesson suggestions.
- **Explore** — filter by ecosystem, language, difficulty and minimum stars; URL params are the source of truth (shareable views).
- **Quiz & recommendation engine** — 7 questions (~90s) → ranked matches with match %, generated reasons, and a diversity guard so you never get 8 TypeScript frameworks in a row.
- **Learn track** — 12 illustrated lessons from "what is open source?" to "releases & versions", with progress saved locally.
- **Repo deep dives** — vital-signal bars (popularity/activity/production/learning), related-repo constellation graph, alternatives.

## Stack

Vite 6 · React 18 · TypeScript 5 (strict) · react-router-dom 6 (HashRouter) · motion (Framer Motion v12) · Canvas 2D + SVG systems · vanilla CSS design system · Vitest.

No backend. No tracking. Everything runs client-side.

## Develop

```bash
npm install
npm run dev          # local dev server
npm test             # vitest suite (data integrity, search, recommender)
npm run typecheck    # tsc --noEmit
npm run build        # production build to dist/
npm run preview      # serve the production build
```

## Refreshing live star counts

Star/fork counts are approximate snapshots. To refresh them from the GitHub API:

```bash
GITHUB_TOKEN=ghp_yourtoken npm run refresh-stats
```

This writes `src/data/stats.generated.json` (a merge overlay) using conditional ETag requests; a token is required for the full catalog (authenticated rate limit: 5,000 req/h).

## Deployment

GitHub Actions deploys every push to `main`: `.github/workflows/deploy.yml` runs typecheck + tests + build, then publishes `dist/` via GitHub Pages.

## Repository map

```
src/
  data/            dataset (727 repos), taxonomy, lessons, types
  lib/             search engine, quiz recommender, similarity, store, hooks
  components/      universe canvas, command palette, cards, decor systems
  pages/           Home, Explore, Categories, Learn, Quiz, RepoDetail, NotFound
tests/             vitest suites
scripts/           fetch-stats.mjs (live stats refresh)
```
