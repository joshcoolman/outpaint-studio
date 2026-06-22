# outpaint-studio

> An image and a target ratio in, a seam-aware extension out — "I have this, I need it at 21:9 for the hero."

**Status: planned** — scaffolded and runnable, but development begins after [palette-forge](https://github.com/joshcoolman/palette-forge) ships. One shipped tile beats three planned ones. Built in public; this repo holds the shape while the flagship proves the pattern.

---

## What this will be

A focused, **agent-first**, BYO-key utility that extends an image to a new aspect ratio so the new region looks intentional, not pasted. The agent-first version closes the loop with **vision as the verifier**: generate → look at the seam → regenerate the bad region → repeat, under a hard iteration cap.

The distinctive bet: **`/knowledge` is plain markdown you can read and rewrite.** A photographer's outpainter and an architect's outpainter share the same mechanism and differ only in `/knowledge`. This is the best showcase of knowledge-as-extension-surface.

Full brief: [`docs/SPEC.md`](docs/SPEC.md) · umbrella vision: [`docs/OVERVIEW.md`](docs/OVERVIEW.md).

## Boundary (the lane is welded)

Does: add believable surrounding content (sky, ground, background) to reach the ratio; repair the seam. Does NOT: generate from scratch, edit content inside the original, remove objects, restyle, or upscale.

## Stack

TanStack Start (Vite-plugin model) · React 19 · TypeScript (strict) · Tailwind v4 · Vitest · ESLint + Prettier · pnpm. Deploys to Vercel.

## Local development

```bash
pnpm install
pnpm dev      # http://localhost:3001
pnpm build    # production build
pnpm test     # vitest
pnpm lint
```
