import { appMeta } from '#/app-meta'

/**
 * Intentionally empty home — the runnable shell the first vertical slice
 * replaces (see docs/PLAN.md, viewable in-app at /docs). The styling here is a
 * neutral dark baseline; the canonical global styles (font, light/dark) get
 * ported from the `sandbox` repo as the first setup step — see the plan.
 */
export function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center text-zinc-100">
      <h1 className="font-mono text-2xl font-medium tracking-tight text-zinc-300">
        {appMeta.name}
      </h1>
      <a
        href="/docs"
        className="font-mono text-xs text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-zinc-300"
      >
        read the plan →
      </a>
    </main>
  )
}
