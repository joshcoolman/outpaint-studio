# feature: verify

The vision verifier — the reason this is agent-first, not agent-added. Delete it
and there's no loop, just a one-shot outpainter.

- **Vision in, JSON out.** Send the composited result to a vision model (Claude,
  `@anthropic-ai/sdk` — genzen's AD feature is the proven pattern) with
  `knowledge/seam-quality.md` as the rubric. It returns a `SeamVerdict`
  (`types.ts`), schema-validated at the boundary.
- **The verdict is the next action.** `regionsToRegenerate` re-runs only the
  flagged edges; the loop repeats under a **hard iteration cap** (image gen
  isn't free).
- **It is itself an evaluable AI feature.** Its verdicts are tested two ways —
  deterministic invariants (objective: did the original survive? is the output
  the requested ratio?) and an LLM-judge over a harvested fixture set. See
  `docs/PLAN.md` → the eval harness.
