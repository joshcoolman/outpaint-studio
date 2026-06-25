/**
 * Per-app identity for the document title and the home shell.
 * Kept tiny on purpose — real product surface lives in the features.
 */

export type AppMeta = {
  name: string
  tagline: string
  repo: string
}

export const appMeta: AppMeta = {
  name: 'outpaint-studio',
  tagline:
    'An image and a target ratio in, a seam-aware extension out — make this hero 21:9.',
  repo: 'https://github.com/joshcoolman/outpaint-studio',
}
