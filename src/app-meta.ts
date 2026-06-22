/**
 * Per-app identity for the scaffold's status landing + document title.
 * This is the ONLY file that differs between the three sibling repos
 * (palette-forge, outpaint-studio, prompt-smith) at scaffold stage —
 * the component, routes, and config are identical.
 */

export type AppStatus = 'scaffolding' | 'planned' | 'building' | 'live'

export type AppMeta = {
  name: string
  tagline: string
  status: AppStatus
  statusNote: string
  repo: string
}

export const appMeta: AppMeta = {
  name: 'outpaint-studio',
  tagline:
    'An image and a target ratio in, a seam-aware extension out — make this hero 21:9.',
  status: 'planned',
  statusNote: 'Planned — begins after palette-forge ships. Scaffold only.',
  repo: 'https://github.com/joshcoolman/outpaint-studio',
}
