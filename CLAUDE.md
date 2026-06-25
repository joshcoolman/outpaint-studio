# outpaint-studio — working notes for Claude

**Read first:** [`docs/PLAN.md`](docs/PLAN.md) (the concrete, decided build
plan — the _how_ and the build order). Then [`docs/SPEC.md`](docs/SPEC.md) (the
_what/why_ sketch) and [`docs/OVERVIEW.md`](docs/OVERVIEW.md) (the umbrella
vision). All docs are viewable in-app at `/docs`.

## Hold the line

- **Agent-first, not agent-added.** The agent is the product; the UI serves its loop.
- **The boundary is welded.** Image + ratio in → seam-aware extension out. Adds believable surroundings and repairs the seam; does NOT generate from scratch, inpaint, remove objects, restyle, or upscale. Retune _what a good extension looks like_ via `/knowledge` only.
- **Mechanism vs knowledge.** The pixel-preserving composite-back (seam mechanism) is domain-invariant code (`sharp`). The extension prompt and the vision-check rubric live in `/knowledge` as plain, human-rewritable markdown.
- **Verifier:** vision — generate, inspect the seam, regenerate the bad region, under a hard iteration cap. Emits a schema-validated `SeamVerdict` (JSON). Fine to start one/two-pass simple; add the loop once the basic version works.
- **No SaaS.** BYO-key, single user, local storage (IndexedDB). No accounts, DB, or credits. Google-first; FAL deferred/invisible. See the plan's provider model.
- **Data model:** clean, addressable records with stable IDs (MCP-ready later).

## Current state

**Phase 0 done — runnable shell + rails.** Not "scaffold only" anymore:

- **Shell:** empty home (`src/components/home.tsx`); in-app markdown docs viewer
  at `/docs` (`src/routes/docs.tsx`, react-markdown). `pnpm dev` → :3000.
- **Deps in place (unused until the build):** `@google/genai`, `@anthropic-ai/sdk`,
  `sharp`, `react-markdown` + `remark-gfm`. Native build approvals in
  `pnpm-workspace.yaml`.
- **Rails:** feature seams under `src/features/` (`outpaint`, `generate`,
  `verify`, `knowledge`, `prefs`), each with a `CLAUDE.md`. Core contracts exist
  as `types.ts`: `OutpaintRecord`, `ExtendEngine`, `SeamVerdict`. Zero logic yet.
- **Knowledge:** `knowledge/{composition,lighting,seam-quality}.md` — the prompt
  guidance + the verifier rubric.
- **Plan:** `docs/PLAN.md` is the build order a coding agent executes against.

**Setup step done — Paper & Ink global styles ported, captured as a clean
baseline.** The look (warm paper, soft ink, one clay accent, light + dark) lives
in **`src/styles/`** as a self-contained, portable unit — see
[`docs/STYLE.md`](docs/STYLE.md) for the contract and port recipe.

- **`src/styles/`** — `tokens.css` (the design contract: colors/fonts/scales,
  light + dark), `base.css` (html/body), `typography.css` (house-* roles +
  `.prose` reading layer + `.compact`), `index.css` (entry: Tailwind import +
  the `@theme inline` bridge that re-exposes tokens as theme-aware utilities like
  `bg-surface` / `text-muted` / `font-serif`). One source of truth: reskin by
  editing `tokens.css`. `@tailwindcss/typography` was dropped — `.prose` is the
  single reading source of truth.
- **Fonts** (chosen for this site, not sandbox's): **IBM Plex Sans** headers/UI,
  **Martel** serif reading body, Space Mono code. Loaded via `<link>` in
  `__root.tsx`, which also runs a pre-paint theme script (saved pref, else OS
  `prefers-color-scheme`).
- **The rule:** feature styles never go in `src/styles/` — they're token-based
  Tailwind utilities in components, or a co-located `features/<x>/<x>.module.css`.
  Keeps the baseline grabbable. (See STYLE.md.)
- **Theme toggle:** a global sun/moon switch (`src/components/theme-toggle.tsx`,
  rendered once in `__root.tsx`) flips `data-theme` + saves to `localStorage`.
  Icon swap uses a `@custom-variant dark` bound to `data-theme` in `index.css`
  (no hydration flash). Additive — touches no tokens.
- **Skipped on purpose:** sandbox's view-transition / curtain animations (app
  features).

**Next:** Phase 1 (the one-pass vertical). See the plan.

## Portability as a habit (soft guideline)

Not a requirement — a lens to keep on while building. This repo is public and
parts of it are meant to be lifted a la carte (the style baseline is the first
example). When a piece of work looks like something a future project would want
to grab — a visual system, a self-contained mechanism, a useful utility — pause
and ask: _could someone port just this, cleanly?_ Favor a clear seam (its own
folder/module), a stated contract, and a short note on what it depends on, over
tangling it into everything around it. Don't over-engineer for reuse that may
never come; just leave the seam where reuse is plausible.
