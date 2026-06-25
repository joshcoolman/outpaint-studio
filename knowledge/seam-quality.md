# Seam quality — the verifier's rubric

This is what the vision verifier judges against. It inspects the composited
result, focusing on the band where original meets generated, and returns a
`SeamVerdict` (JSON). Each failure mode below maps to one `SeamIssueKind`; cite
the kind and the affected region (`left` / `right` / `top` / `bottom`).

A result **passes** when there are no `high`-severity issues. `low`-severity
issues may remain (extension is allowed to be imperfect, not pasted-looking).

## What to flag

- **`seam_line`** — a visible edge, line, or abrupt change in sharpness,
  brightness, or texture exactly where the original ends. The single most
  important thing to catch.
- **`lighting_discontinuity`** — shadow direction, length, or hardness changes
  across the seam; key light appears to move; highlights don't match.
- **`texture_repeat`** — the extension tiles or stamps an obvious repeating
  pattern (cloned clouds, copy-pasted grass, mirrored foliage).
- **`perspective_break`** — a horizon, leading line, or vanishing point that
  steps, tilts, or re-angles at the seam; scale of added elements inconsistent
  with the original's depth.
- **`new_subject`** — the extension invented a focal element (a person, animal,
  building, sign, object) that competes with the original subject. Background is
  allowed; new _content_ is not.
- **`color_drift`** — white balance, saturation, contrast, black level, or grain
  in the extension doesn't match the original (a warm scene turning neutral, a
  clean region beside a grainy one).

## How to report

For each issue: the `kind`, the `region`, a `severity` (`low` / `medium` /
`high`), and a one-line `note` specific enough to drive a re-generation of that
region ("shadow under the rock falls left; original light is from the right").

If the seam is clean and the extension obeys `composition.md` and `lighting.md`,
return `pass: true` with an empty issue list. Don't invent problems — a quiet,
believable extension is the goal, not a busy one.
