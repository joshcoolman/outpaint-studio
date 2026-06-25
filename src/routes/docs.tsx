import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Menu, X } from 'lucide-react'

export const Route = createFileRoute('/docs')({ component: DocsPage })

// Every markdown doc in the repo, bundled at build time. Drop a file under
// docs/ or knowledge/ (or edit README/CLAUDE) and it appears here — no wiring.
const RAW: Record<string, string> = import.meta.glob(
  ['/README.md', '/CLAUDE.md', '/docs/**/*.md', '/knowledge/*.md'],
  { query: '?raw', import: 'default', eager: true },
)

type Doc = {
  id: string
  title: string
  section: string
  order: number
  content: string
}

const SECTION_ORDER = ['Start here', 'Knowledge', 'Working notes']

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function slugify(path: string): string {
  return path
    .replace(/^\//, '')
    .replace(/\.md$/i, '')
    .replace(/\//g, '-')
    .toLowerCase()
}

function classify(path: string): {
  section: string
  title: string
  order: number
} {
  const base = path.split('/').pop()!.replace(/\.md$/i, '')
  if (path === '/README.md')
    return { section: 'Start here', title: 'README', order: 0 }
  if (path === '/docs/PLAN.md')
    return { section: 'Start here', title: 'Plan', order: 1 }
  if (path === '/docs/SPEC.md')
    return { section: 'Start here', title: 'Spec', order: 2 }
  if (path === '/docs/OVERVIEW.md')
    return { section: 'Start here', title: 'Overview', order: 3 }
  if (path.startsWith('/knowledge/'))
    return {
      section: 'Knowledge',
      title: titleCase(base.replace(/-/g, ' ')),
      order: 0,
    }
  if (path === '/CLAUDE.md')
    return { section: 'Working notes', title: 'CLAUDE.md', order: 0 }
  return { section: 'Working notes', title: base, order: 1 }
}

function buildDocs(): Doc[] {
  return Object.entries(RAW)
    .map(([path, content]) => ({
      id: slugify(path),
      content,
      ...classify(path),
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

function DocsPage() {
  const docs = useMemo(buildDocs, [])

  const sections = useMemo(() => {
    const bySection = new Map<string, Doc[]>()
    for (const d of docs) {
      const list = bySection.get(d.section) ?? []
      list.push(d)
      bySection.set(d.section, list)
    }
    return SECTION_ORDER.filter((s) => bySection.has(s)).map((section) => ({
      section,
      docs: bySection.get(section) ?? [],
    }))
  }, [docs])

  const defaultId =
    docs.find((d) => d.id === 'docs-plan')?.id ?? docs[0]?.id ?? ''
  const [activeId, setActiveId] = useState(defaultId)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const fromHash = window.location.hash.replace(/^#/, '')
    if (fromHash && docs.some((d) => d.id === fromHash)) setActiveId(fromHash)
  }, [docs])

  function select(id: string) {
    setActiveId(id)
    setNavOpen(false)
    window.history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: 0 })
  }

  const active = docs.find((d) => d.id === activeId) ?? docs[0]

  if (!active) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        No documents found.
      </main>
    )
  }

  const nav = (
    <nav className="flex flex-col gap-5">
      {sections.map(({ section, docs: items }) => (
        <div key={section} className="flex flex-col gap-1">
          <p className="px-2 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {section}
          </p>
          {items.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => select(d.id)}
              className={`rounded-md px-2 py-1 text-left text-sm transition ${
                d.id === active.id
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>
      ))}
    </nav>
  )

  return (
    <main className="mx-auto flex w-full max-w-6xl gap-10 bg-zinc-950 px-4 py-10 text-zinc-100">
      <aside className="hidden w-56 shrink-0 sm:block">
        <div className="sticky top-10">{nav}</div>
      </aside>

      <article className="min-w-0 max-w-3xl flex-1">
        <div className="mb-6 flex items-center gap-3 sm:hidden">
          <button
            type="button"
            aria-label="Open docs menu"
            onClick={() => setNavOpen(true)}
            className="rounded-md border border-zinc-800 p-2 text-zinc-300"
          >
            <Menu size={16} />
          </button>
          <span className="text-sm font-medium text-zinc-200">
            {active.title}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {active.content}
          </ReactMarkdown>
        </div>
      </article>

      {navOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 sm:hidden"
          onClick={() => setNavOpen(false)}
        >
          <div
            className="h-full w-72 max-w-[80%] overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-200">Docs</span>
              <button
                type="button"
                aria-label="Close docs menu"
                onClick={() => setNavOpen(false)}
                className="rounded-md border border-zinc-800 p-2 text-zinc-300"
              >
                <X size={16} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}
    </main>
  )
}
