/**
 * Core domain records for the extend flow. Clean, addressable, stable-ID
 * records (MCP-ready) — these never get buried in React state; they live in a
 * repo (IndexedDB) and are the shape an MCP tool would later return.
 *
 * Contracts only. The repo and the orchestration are built against docs/PLAN.md.
 */

/** A source image and its intrinsic dimensions — the original, untouched pixels. */
export type SourceImage = {
  /** Stable id for the uploaded source. */
  id: string
  /** Object URL or data URL of the original, unmodified pixels. */
  src: string
  width: number
  height: number
  mimeType: string
}

/** Target aspect ratio as the canonical "W:H" string (e.g. "21:9"). */
export type TargetRatio = `${number}:${number}`

/** Which edges to grow toward the target ratio — the spatial intent. */
export type ExtendDirection = 'left' | 'right' | 'top' | 'bottom'

export type OutpaintStatus =
  | 'draft'
  | 'generating'
  | 'verifying'
  | 'done'
  | 'failed'

/**
 * One extend job and its result — the addressable record persisted locally and
 * surfaced in the journey. `resultSrc` is the *composited* output: model-
 * generated surroundings with the original pixels guaranteed-preserved.
 */
export type OutpaintRecord = {
  id: string
  source: SourceImage
  targetRatio: TargetRatio
  directions: ExtendDirection[]
  /** Free-text steer for the extension ("continue the beach"), optional. */
  instruction?: string
  status: OutpaintStatus
  resultSrc?: string
  /** How many generate→verify passes were spent (bounded by the cap). */
  iterations: number
  createdAt: string
  error?: string
}
