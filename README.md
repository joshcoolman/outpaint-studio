# outpaint-studio

> An image and a target ratio in, a seam-aware extension out — "I have this, I need it at 21:9 for the hero."

**Status: planned, scaffolded, and runnable.** A full build plan is in place
([`docs/PLAN.md`](docs/PLAN.md)); the app is a runnable shell with the
architecture, contracts, and knowledge layer laid down, ready for the first
vertical slice. Built in public alongside [palette-forge](https://github.com/joshcoolman/palette-forge).

---

## What this will be

A focused, **agent-first**, BYO-key utility that extends an image to a new aspect ratio so the new region looks intentional, not pasted. The agent-first version closes the loop with **vision as the verifier**: generate → look at the seam → regenerate the bad region → repeat, under a hard iteration cap.

The distinctive bet: **`/knowledge` is plain markdown you can read and rewrite.** A photographer's outpainter and an architect's outpainter share the same mechanism and differ only in `/knowledge`. This is the best showcase of knowledge-as-extension-surface.

**Read the plan:** [`docs/PLAN.md`](docs/PLAN.md) (the concrete build plan) · brief: [`docs/SPEC.md`](docs/SPEC.md) · umbrella vision: [`docs/OVERVIEW.md`](docs/OVERVIEW.md). All of these are also viewable in-app at **`/docs`**.

## Boundary (the lane is welded)

Does: add believable surrounding content (sky, ground, background) to reach the ratio; repair the seam. Does NOT: generate from scratch, edit content inside the original, remove objects, restyle, or upscale.

## Stack

TanStack Start (Vite-plugin model) · React 19 · TypeScript (strict) · Tailwind v4 · Vitest · ESLint + Prettier · pnpm. Deploys to Vercel.

Image/AI libraries in place (unused until the build): `@google/genai` (Gemini 2.5 Flash Image), `@anthropic-ai/sdk` (vision verifier), `sharp` (the seam mechanism), `react-markdown` + `remark-gfm` (the docs viewer).

## Local development

```bash
pnpm install
pnpm dev      # http://localhost:3000  (home shell + /docs viewer)
pnpm build    # production build
pnpm test     # vitest
pnpm lint
```
