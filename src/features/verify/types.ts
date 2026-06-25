/**
 * The seam verifier's structured verdict — the agent-first core as a typed
 * contract. The vision model emits this as JSON; a schema-validated parse turns
 * untrusted model text into one of these (the palette-forge `parseModelName`
 * discipline, upgraded from a regex to a schema).
 *
 * `regionsToRegenerate` IS the next action: the verdict drives the loop. The
 * rubric the model judges against lives in `knowledge/seam-quality.md`, and the
 * `SeamIssueKind` values map 1:1 to its headings.
 */

import type { ExtendDirection } from '#/features/outpaint/types'

export type SeamIssueKind =
  | 'seam_line'
  | 'lighting_discontinuity'
  | 'texture_repeat'
  | 'perspective_break'
  | 'new_subject'
  | 'color_drift'

export type SeamSeverity = 'low' | 'medium' | 'high'

export type SeamIssue = {
  kind: SeamIssueKind
  region: ExtendDirection
  severity: SeamSeverity
  /** One line — shown in the feed and fed into the regenerate prompt. */
  note: string
}

export type SeamVerdict = {
  /** True when no high-severity issues remain — the loop's exit condition. */
  pass: boolean
  issues: SeamIssue[]
  /** Edges to regenerate next; empty when `pass` is true. */
  regionsToRegenerate: ExtendDirection[]
}
