# outpaint-studio — working notes for Claude

**Read first:** [`docs/SPEC.md`](docs/SPEC.md) (high-level sketch — flesh out during the build) and [`docs/OVERVIEW.md`](docs/OVERVIEW.md) (the umbrella vision).

## Hold the line

- **Agent-first, not agent-added.** The agent is the product; the UI serves its loop.
- **The boundary is welded.** Image + ratio in → seam-aware extension out. Adds believable surroundings and repairs the seam; does NOT generate from scratch, inpaint, remove objects, restyle, or upscale. Retune *what a good extension looks like* via `/knowledge` only.
- **Mechanism vs knowledge.** Seam-repair is domain-invariant mechanism (code). The extension prompt and the vision-check rubric live in `/knowledge` as plain, human-rewritable markdown.
- **Verifier:** vision — generate, inspect the seam, regenerate the bad region, under a hard iteration cap (image gen isn't free). Fine to start one/two-pass simple; add the loop once the basic version works.
- **Data model:** clean, addressable records with stable IDs (MCP-ready later).

## Current state

Scaffold only (TanStack Start + React 19 + TS + Tailwind v4 + Vitest). Planned — real work starts after palette-forge ships, reusing its proven patterns. Status landing in `src/components/status-landing.tsx`, driven by `src/app-meta.ts`.
