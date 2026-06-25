# feature: outpaint

The domain core. Owns the addressable records (`types.ts`) and, when built, the
orchestration seam that ties a source + target ratio through generate → verify →
composite into a finished `OutpaintRecord`.

- **Records, not React state.** Persist `OutpaintRecord`s in a repo (IndexedDB,
  the palette-forge `palette-repo` pattern). Stable IDs — MCP-ready.
- **The orchestrator is thin.** It sequences the other features (`generate`,
  `verify`, the `sharp` composite-back mechanism); it holds no provider or
  vision logic itself. That separation is the welded boundary made legible.

Build order and the full contract: `docs/PLAN.md`.
