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
  at `/docs` (`src/routes/docs.tsx`, react-markdown). `pnpm dev` → :3001.
- **Deps in place (unused until the build):** `@google/genai`, `@anthropic-ai/sdk`,
  `sharp`, `react-markdown` + `remark-gfm`. Native build approvals in
  `pnpm-workspace.yaml`.
- **Rails:** feature seams under `src/features/` (`outpaint`, `generate`,
  `verify`, `knowledge`, `prefs`), each with a `CLAUDE.md`. Core contracts exist
  as `types.ts`: `OutpaintRecord`, `ExtendEngine`, `SeamVerdict`. Zero logic yet.
- **Knowledge:** `knowledge/{composition,lighting,seam-quality}.md` — the prompt
  guidance + the verifier rubric.
- **Plan:** `docs/PLAN.md` is the build order a coding agent executes against.

**Next:** the first setup step is **porting the canonical global styles from the
`joshcoolman/sandbox` repo** (font, light/dark, base) — needs a session with
`sandbox` in repo scope; current styling is a neutral dark placeholder. Then
Phase 1 (the one-pass vertical). See the plan.
