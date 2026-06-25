import { appMeta } from '#/app-meta'

/**
 * Intentionally empty home — the runnable shell the first vertical slice
 * replaces (see docs/PLAN.md, viewable in-app at /docs). Styled with the
 * Paper & Ink global tokens ported from the `sandbox` repo (font, light/dark,
 * base colors); it follows the light/dark theme automatically.
 */
export function Home() {
  return (
    <main className="bg-bg text-text flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="house-section">{appMeta.name}</h1>
      <a
        href="/docs"
        className="text-accent font-mono text-xs underline decoration-[var(--accent-soft)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
      >
        read the plan →
      </a>
    </main>
  )
}
