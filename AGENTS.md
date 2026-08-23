# AGENTS.md — working notes for AI agents on EchoRepos

## Project

Static client-side SPA: Vite 6 + React 18 + TS strict + HashRouter. Deployed to GitHub Pages at base `/EchoRepos/`. No backend; localStorage for favorites/progress/quiz.

## Hard conventions (do not violate)

- **TypeScript strict with `noUnusedLocals`/`noUnusedParameters`.** No unused imports survive typecheck.
- **HashRouter only** — GH Pages has no SPA rewrite. Never switch to BrowserRouter.
- **Base path is `/EchoRepos/`** (vite.config.ts). Asset refs must be relative or vite-aliased.
- **No CSS framework.** Design system lives in `src/styles/` (tokens → base → components → pages-a/pages-b). Reuse tokens (`--cyan`, `--glass`, etc.) instead of hardcoding.
- **Data model:** repos are created via the compact `seed()` factory in `src/data/repos/factory.ts`. Category ids are the closed union in `src/data/types.ts`. Use-case ids must stay aligned with quiz Q4 options in `src/pages/Quiz.tsx`.
- **Search/recommend engines are pure functions** in `src/lib/search.ts` / `recommend.ts` — no React, no I/O; covered by vitest.
- **Motion policy:** honor `usePrefersReducedMotion()`; canvas degrades via fps watchdog; SMIL/CSS decor is disabled by the global reduced-motion kill-switch in base.css.

## Gotchas learned the hard way

- Very long single tool-call writes (>~10KB) can truncate mid-JSON — split files or write in two parts.
- `stats.generated.json` is generated (`scripts/fetch-stats.mjs`). Never hand-edit; it's a merge overlay over seed values.
- Diversity guard in `recommend.ts` operates on sliding 10-windows (≤4 same language, ≤5 same primary category) — tests assert this; don't weaken.
- Alternatives lists must be full `owner/name` ids that resolve to catalog entries or real GitHub paths — a data test enforces the shape and self-reference ban.
- Lesson slugs are load-bearing: `search.ts` LESSON_HINTS regexes map queries to `/learn/<slug>` routes; keep both sides in sync.

## Verify before committing

```bash
npm run typecheck && npm test && npm run build
```

Deploy happens automatically on push to main (`.github/workflows/deploy.yml`).
