import { Moon, Sun } from 'lucide-react'

/**
 * Global light/dark toggle. The real theme is the `data-theme` attribute on
 * <html>, set before first paint by the script in __root.tsx — this only flips
 * it and persists the choice to localStorage (key `site-theme`, the same key the
 * pre-paint script reads). Which icon shows is driven entirely by the CSS `dark:`
 * variant (see src/styles/index.css), so it is correct from first paint with no
 * hydration flash and needs no React state.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('site-theme', next)
    } catch {
      // ignore — private mode / storage disabled; theme still flips for the session
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light or dark theme"
      title="Toggle theme"
      className="border-border bg-surface text-text-muted hover:text-text hover:border-text-faint focus-visible:ring-accent fixed top-5 right-5 z-40 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <Moon size={16} className="dark:hidden" />
      <Sun size={16} className="hidden dark:block" />
    </button>
  )
}
