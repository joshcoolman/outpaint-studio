# Continue — outpaint-studio

> Cross-session orientation. Source of truth for "where are we / what's next."
> If this disagrees with the code, follow the code and update this.

## Where the repo is

**Phase 0 + the styles setup step are DONE. Nothing is in-flight. Next is Phase 1.**

This is a runnable shell with rails, not feature-complete anything. There is no
outpaint / generate / verify logic yet — only contracts (`types.ts`) and empty
feature folders. The last three commits are all scaffold/setup:

```
f16c28b Port Paper & Ink styles, capture as portable baseline, add theme toggle + docs ordering
5ac76bd Phase 0: runnable shell, rails, and build plan (+ in-app /docs viewer)
f22197c Scaffold TanStack Start shell — outpaint-studio
```

Working tree is **clean** — everything committed, branch `main`. `git pull` says
up to date because the recent history is all setup.

## What exists today

- **Shell:** empty home (`src/components/home.tsx`, has a `home.test.tsx`);
  in-app markdown docs viewer at **`/docs`** (`src/routes/docs.tsx`,
  react-markdown + remark-gfm). Routes: `__root`, `docs`, `index`. `pnpm dev` → :3000.
- **Styling baseline ("Paper & Ink"):** self-contained, portable unit in
  `src/styles/` — `tokens.css` (the design contract, light+dark), `base.css`,
  `typography.css` (`.prose` reading layer + `.compact`), `index.css` (Tailwind
  v4 import + `@theme inline` bridge → theme-aware utilities like `bg-surface`,
  `text-muted`, `font-serif`). Reskin by editing `tokens.css` only. Fonts: IBM
  Plex Sans (UI), Martel (reading body), Space Mono (code), loaded via `<link>`
  in `__root.tsx` with a pre-paint theme script. Global sun/moon **theme toggle**
  (`src/components/theme-toggle.tsx`, flips `data-theme` + localStorage).
  Contract + port recipe in `docs/STYLE.md`. Rule: feature styles never go in
  `src/styles/`.
- **Feature rails** under `src/features/` — `outpaint`, `generate`, `verify`,
  `knowledge`, `prefs` — each with a `CLAUDE.md` and core contracts as
  `types.ts` (`OutpaintRecord`, `ExtendEngine`, `SeamVerdict`). **Zero logic.**
- **Knowledge layer** (the "soul"): `knowledge/{composition,lighting,seam-quality}.md`
  — prompt guidance + the verifier rubric. Human-rewritable; retune output
  quality here, not in code.
- **Deps installed, unused until the build:** `@google/genai`,
  `@anthropic-ai/sdk`, `sharp`, `react-markdown` + `remark-gfm`.

## The welded boundary (do not drift)

Image + target ratio **in** → seam-aware extension **out**. Adds believable
surroundings (sky/ground/background) and repairs the seam. Does **NOT** generate
from scratch, inpaint, remove objects, restyle, or upscale. Retune *what a good
extension looks like* via `/knowledge` only — the lane is welded.

Stack: TanStack Start (React 19 + Vite + Nitro SSR), Tailwind v4, TS strict,
Vitest, Vercel. Image gen = `@google/genai` (Gemini 2.5 Flash Image / "Nano
Banana"). Vision verify = `@anthropic-ai/sdk` (Claude). Mechanism = `sharp`
(canvas build + pixel-preserving composite-back). **No Supabase/Stripe/credits/
accounts.** Local storage (IndexedDB), BYO-key, single user.

## Next: Phase 1 — the first vertical (one-pass)

Build the end-to-end mechanism, **no verifier yet**, to prove output quality:

1. Upload an image → pick a ratio (presets first; draggable handles deferred to ~1.5).
2. Build the extended canvas + call Google extend.
3. **Composite-back with `sharp`** — pixel-preserving so the original is untouched.
4. Show before/after.

Orchestrator lives in `features/outpaint/` and stays thin (sequences
generate→composite, holds no provider/vision logic). Provider adapters go behind
the one `ExtendEngine` interface in `features/generate/`. Image gen is the one
thing that needs a server: a thin stateless Nitro proxy (`server/api/...`) — not
built yet (that's more Phase 4, but the proxy seam may show up in Phase 1 for the
Google call).

## Open decisions to resolve while building (from PLAN §13)

- **Direction UX:** ratio presets vs. draggable asymmetric handles. Lean presets first.
- **Schema validator** for `SeamVerdict`: zod vs. hand-rolled. Lean hand-rolled, keep deps lean.
- **Result persistence:** store result blobs in IndexedDB vs. re-derive. Lean store blobs + offer download.
- **Free-tier cap shape** (Phase 4): per-IP/day count, lower res, or watermark?

## Read before building

`docs/PLAN.md` (the decided how + build order — authoritative), then
`docs/SPEC.md` (what/why) and `docs/OVERVIEW.md` (vision). `docs/STYLE.md` for
the style contract. All viewable in-app at `/docs`. Each `features/*/CLAUDE.md`
states that feature's responsibility.
