# feature: knowledge

The loader that makes `/knowledge/*.md` available to the app. To build (the
palette-forge pattern, ~15 lines):

```ts
const files = import.meta.glob('/knowledge/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
export function getKnowledge(name: string): string {
  /* ... */
}
```

Knowledge feeds output in two places, exactly as the umbrella vision states:

1. It **guides the extension prompt** (`composition.md`, `lighting.md`) — what to
   generate into the new space.
2. It **is the rubric the verifier judges against** (`seam-quality.md`).

The files are plain markdown a non-coder can rewrite — that's the
knowledge-as-extension-surface bet. Mechanism stays in code; taste stays here.
