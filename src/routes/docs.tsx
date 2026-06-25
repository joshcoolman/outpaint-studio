import { createFileRoute, Link } from '@tanstack/react-router'
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

// Ordering convention: an optional `NN-` filename prefix sets a doc's order and
// is stripped from the title and id (so `01-overview.md` shows as "Overview" and
// keeps a stable URL hash). No prefix → sorts after numbered docs,
// alphabetically. Reorder by renaming a file; never touch this code. A numeric
// *prefix* (not suffix) is preferred — it also self-sorts the folder on GitHub.
function parseOrder(base: string): { order: number; name: string } {
  const m = base.match(/^(\d+)[-_.]\s*(.+)$/)
  return m
    ? { order: parseInt(m[1]!, 10), name: m[2]! }
    : { order: Number.POSITIVE_INFINITY, name: base }
}

// Section comes from where a file lives, not a hardcoded per-file list — so a
// new doc lands somewhere sensible on its own.
function sectionFor(path: string): string {
  if (path.startsWith('/knowledge/')) return 'Knowledge'
  if (path === '/CLAUDE.md') return 'Working notes'
  if (path === '/README.md' || path.startsWith('/docs/')) return 'Start here'
  return 'Working notes'
}

function classify(path: string): Omit<Doc, 'content'> {
  const segs = path.split('/')
  const base = segs.pop()!.replace(/\.md$/i, '')
  const { order, name } = parseOrder(base)
  const title = /^(README|CLAUDE)$/i.test(name)
    ? name
    : titleCase(name.replace(/-/g, ' '))
  return { id: slugify([...segs, name].join('/')), section: sectionFor(path), title, order }
}

function buildDocs(): Doc[] {
  return Object.entries(RAW)
    .map(([path, content]) => ({ content, ...classify(path) }))
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

  const defaultId = sections[0]?.docs[0]?.id ?? docs[0]?.id ?? ''
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
      <main className="bg-bg text-text-muted flex min-h-screen items-center justify-center">
        No documents found.
      </main>
    )
  }

  const nav = (
    <nav className="flex flex-col gap-7">
      {sections.map(({ section, docs: items }) => (
        <div key={section} className="flex flex-col gap-0.5">
          <p className="text-text-faint mb-2 px-3 font-mono text-[11px] font-semibold tracking-[0.12em] uppercase">
            {section}
          </p>
          {items.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => select(d.id)}
              className={`block w-full rounded-md px-3 py-1.5 text-left text-[13px] transition ${
                d.id === active.id
                  ? 'bg-surface-raised text-text font-medium'
                  : 'text-text-muted hover:text-text hover:bg-surface-sunken'
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
    <main className="bg-bg text-text flex min-h-screen">
      <aside className="border-border bg-surface sticky top-0 hidden h-screen w-[272px] shrink-0 overflow-y-auto px-5 pt-9 pb-12 border-r sm:block">
        <Link
          to="/"
          className="text-text-muted hover:text-accent mb-9 block px-3 font-mono text-xs tracking-tight transition-colors"
        >
          outpaint-studio
        </Link>
        {nav}
      </aside>

      <div className="min-w-0 flex-1">
        <article className="mx-auto max-w-[760px] px-6 pt-12 pb-28 sm:px-10 sm:pt-20">
          <div className="mb-10 flex items-center gap-3 sm:hidden">
            <button
              type="button"
              aria-label="Open docs menu"
              onClick={() => setNavOpen(true)}
              className="border-border text-text-body rounded-md border p-2"
            >
              <Menu size={16} />
            </button>
            <span className="text-text text-sm font-medium">{active.title}</span>
          </div>

          <div className="prose compact">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {active.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>

      {navOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 sm:hidden"
          onClick={() => setNavOpen(false)}
        >
          <div
            className="border-border bg-surface h-full w-72 max-w-[80%] overflow-y-auto border-r p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-text text-sm font-semibold">Docs</span>
              <button
                type="button"
                aria-label="Close docs menu"
                onClick={() => setNavOpen(false)}
                className="border-border text-text-body rounded-md border p-2"
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
