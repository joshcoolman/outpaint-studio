# outpaint-studio

> A focused, BYO-key utility that extends an image to a new aspect ratio, seam-aware. Tuned for photographic/design work out of the box — its expertise lives in `/knowledge` as plain markdown you can read and rewrite.

High-level sketch. Flesh out after palette-forge.

---

## The one thing it does

Image + target ratio in → extended image where the new region looks intentional, not pasted. "I have this, I need it at 21:9 for the hero."

## What it does NOT do (the boundary)

The lane is welded. Retune _what a good extension looks like_ via `/knowledge`; don't turn it into something else.

- Does: add believable surrounding content (sky, ground, background) to reach the ratio; repair the seam.
- Does NOT: generate from scratch, edit content inside the original, remove objects (inpainting), restyle, or upscale.

## Why an agent is here (honest)

A naïve outpainter does one pass and hands you whatever comes back — visible seam, drifted light, repeated texture. The agent-first version closes the loop with **vision as the verifier**: generate → look at the seam → regenerate the bad region → repeat, under a hard iteration cap (cost ceiling; image gen isn't free).

Fine to start one-pass/two-pass simple. The verifier is what makes it agent-first; add it once the basic version works.

---

## The knowledge layer (the differentiator)

**`/knowledge` is plain, human-readable markdown. Read it and you know what this app considers a good extension. Edit it and the output changes.** Ships with solid photographic/compositional expertise out of the box. An architect could fork it, rewrite it for architectural renderings (material honesty, how light rakes a facade, human scale, entourage), and now it's a specialist tool — by hand or via their own agent. No code required.

For an image tool the knowledge lives on the **generation** side (the seam-repair mechanism is domain-invariant and stays in code). Knowledge influences output in two places:

1. It **guides the extension prompt** (what to generate into the new space).
2. It **is the rubric the vision-check judges against**.

Starter contents:

```
knowledge/
├── composition.md   # extension is background, not new content; continue horizon &
│                    # leading lines at the same angle; keep the subject anchored
├── lighting.md      # match light direction, color temperature, shadow logic, grain/grade
└── seam-quality.md  # the verifier's checklist: flag seam lines, lighting discontinuity,
                     # texture repeats, perspective/scale breaks, any new focal subject
```

**Deferred:** in-app knowledge-authoring mode. v2 at earliest. The folder is just files; a human or external agent can already edit it.

## Notes for later

- "Improves with use": log which regenerations you accept → tune toward your taste.
- Clean, addressable output records with stable IDs (MCP-readiness, same as palette-forge).
- BYO-key, browser-stored.

## Stack

TanStack Start + React + TypeScript + Tailwind, Vercel. Same defaults.
