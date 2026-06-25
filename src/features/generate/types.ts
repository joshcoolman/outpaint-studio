/**
 * The provider seam. One `ExtendEngine` interface; concrete adapters (Google
 * first, OpenAI next, FAL deferred/invisible) implement it. The app and the
 * verifier loop depend only on this interface — swapping or adding a provider
 * never touches the loop.
 *
 * Contract only. Adapters are built against docs/PLAN.md (provider model +
 * the thin Nitro proxy that holds the key).
 */

import type { ExtendDirection, TargetRatio } from '#/features/outpaint/types'

export type Provider = 'google' | 'openai'

export type ExtendInput = {
  /** The original image as base64 (no data-URL prefix). */
  imageBase64: string
  mimeType: string
  targetRatio: TargetRatio
  directions: ExtendDirection[]
  /** The knowledge-derived extension prompt, plus any user steer. */
  prompt: string
}

export type ExtendOutput = {
  /** The model's extended frame, pre composite-back, as base64. */
  imageBase64: string
  mimeType: string
  provider: Provider
  /** Provider-reported cost in cents, when available. */
  costCents?: number
}

/** The welded boundary, in code: image + ratio in, an extended frame out. */
export interface ExtendEngine {
  readonly provider: Provider
  extend: (input: ExtendInput) => Promise<ExtendOutput>
}
