# outpaint-studio — build plan

> The concrete, decided build plan. `SPEC.md` is the _what/why_ sketch and
> `OVERVIEW.md` is the umbrella vision; **this is the _how_ and the build order**
> a coding agent (or a human) can execute against. Where this plan and the code
> disagree once the build starts, follow the code and amend this doc.

This plan was decided in a design session (mobile, agent-driven). It reflects
real choices, not a survey of options — where a decision was made, the
alternative and the reason are noted so a reviewer sees _why_.

---

## 1. What this is, and the welded boundary

A focused, agent-first, BYO-key utility: **an image + a target ratio in, a
seam-aware extension out** — "I have this, I need it at 21:9 for the hero."

- **Does:** add believable surrounding content (sky, ground, background) to reach
  the ratio, and make the new region look intentional — matched light, grade, and
  composition.
- **Does NOT:** generate from scratch, edit content inside the original, remove
  objects (inpainting), restyle, or upscale.

Retune _what a good extension looks like_ via `/knowledge` only. The lane is
welded; "make it your own" means rewrite the knowledge, not change the lane.

---

## 2. The decided stack

The framework was never in question — it's the proven sibling stack
(palette-forge / genzen), and this repo was scaffolded as a clone of it.

| Concern       | Choice                                                   |
| ------------- | -------------------------------------------------------- |
| Framework     | TanStack Start (React 19 + Vite + Nitro SSR)             |
| Styling       | Tailwind v4 (CSS-config) + `@tailwindcss/typography`     |
| Language      | TypeScript, strict                                       |
| Test          | Vitest                                                   |
| Deploy        | Vercel                                                   |
| Image gen     | `@google/genai` (Gemini 2.5 Flash Image / "Nano Banana") |
| Vision verify | `@anthropic-ai/sdk` (Claude, image input)                |
| Mechanism     | `sharp` (canvas build + pixel-preserving composite-back) |
| Docs viewer   | `react-markdown` + `remark-gfm`                          |

**Deliberately NOT in the stack:** Supabase, R2, Stripe, a credits system. Those
make genzen a multi-user SaaS; they're antithetical to a forkable, no-signup
utility. Storage is local (IndexedDB). **FAL is deferred** — a great runtime, a
boutique brand; if added later it's invisible internal plumbing for many models,
never a user-facing "enter your FAL key" button.

---

## 3. Architecture — the seams (legible from the file tree)

```
src/
  features/
    outpaint/   # domain records + the thin generate→verify→composite orchestrator
    generate/   # provider adapters behind one ExtendEngine interface
    verify/     # the vision verifier: image in, SeamVerdict JSON out
    knowledge/  # the /knowledge loader (import.meta.glob ?raw)
    prefs/      # BYO-key + free-tier state (IndexedDB, single user)
  routes/
    index.tsx   # the working app (empty shell today)
    docs.tsx    # in-app markdown viewer (shipped)
  lib/          # db (IndexedDB), id, the Nitro proxy client, settings mirror
knowledge/      # composition.md · lighting.md · seam-quality.md (the soul)
server/         # the thin stateless image-gen proxy (Nitro h3)
scripts/        # the eval harness (agent-runnable; see §8)
```

Each `features/*` folder has a `CLAUDE.md` stating its responsibility, and the
core contracts already exist as `types.ts` (`OutpaintRecord`, `ExtendEngine`,
`SeamVerdict`). The orchestrator is thin: it sequences the other features and
holds no provider or vision logic itself — that separation _is_ the boundary.

---

## 4. Provider & money model — the funnel

The audience is general, not AI-power-users. Decisions follow from that:

- **Brands users trust are the buttons; the runtime is invisible.** Surface a
  **Google** button and an **OpenAI** button — the two brands a general audience
  recognizes. Google leads ("image" now means Nano Banana to most people, and
  everyone has a Google account).
- **The signup tension is real.** Getting any API key is itself a signup — so
  pure BYO-key does not serve "I just need to outpaint once." Resolve with two
  tiers:
  1. **Free, no signup** — the first few extends run on the _owner's_ Google key,
     behind the proxy, rate-limited. The impulse user never sees a key field.
  2. **BYO-key to continue** — hitting the cap reveals the Google / OpenAI
     panel; paste a key (stored locally), and the user now pays their own
     provider directly.
- **There is no payment mechanism, by design.** BYO-key costs the owner $0 (the
  user pays their provider). The only owner cost is the capped free tier — a
  marketing cost, not a billing system. No Stripe, no credits, no accounts.
- **The free tier needs an abuse bound** (IP rate-limit or a lightweight signed
  token) so a scraper can't drain the owner's key. A few lines, not a system —
  named here so it isn't a surprise.

---

## 5. The server boundary

palette-forge is browser-direct (no backend) because Anthropic's SDK runs in the
browser. Image gen is the one place that needs a server:

- **A thin, stateless Nitro proxy** (`server/api/...`, the genzen `.server.ts`
  pattern stripped to the minimum). It takes the user's key (or, for the free
  tier, the owner's) + the image, calls the provider, streams the result back.
- **No database, no auth, no accounts.** Nothing persists server-side. Records
  and result blobs live in IndexedDB on the client.

This is the single intentional deviation from the palette-forge template,
justified by image gen and key handling.

---

## 6. The mechanism — instruct + composite-back

There are two ways to outpaint, and they differ in whether they honor the
boundary:

- **Mask/fill APIs** (OpenAI image-edit, FLUX Fill): pad the canvas, mark the new
  region as a mask, the model fills only the mask. Original preserved by
  construction.
- **Instruct + regenerate** (Gemini / Nano Banana): no mask param — hand it the
  image and an instruction, it returns a larger image. Simpler, content-smart,
  but it regenerates the _whole_ frame and can subtly redraw the original.

**Decision: instruct-the-model to generate, then deterministically
composite-back to protect the original.** This honors the design instinct ("give
a capable model proper instructions") _and_ the welded boundary, and it's
provider-agnostic:

1. Build a target-ratio canvas with the original placed in it (`sharp`).
2. Ask the provider to extend into the empty region (prompt from `/knowledge`).
3. **Paste the original's exact pixels back** onto their location, with a
   few-pixel feathered blend at the join (`sharp`).

After step 3 the original is guaranteed pixel-identical; the model's work
survives only in the new region and the seam. That composite-back is the _one_
piece of domain-invariant mechanism that earns its place in code (everything
else taste-related lives in `/knowledge`).

---

## 7. The verifier — vision → JSON → loop

This is what makes the tool agent-first, not agent-added. Delete the verifier and
there's no loop, just a one-shot outpainter.

- **Structured output, not prose.** The vision model (Claude, image input —
  genzen's AD feature is the proven path) returns a **`SeamVerdict`** (see
  `src/features/verify/types.ts`): `{ pass, issues[], regionsToRegenerate[] }`.
- **Schema-validated at the boundary.** Untrusted model text → a validated parse
  (the palette-forge `parseModelName` discipline, upgraded from regex to a
  schema). Bad output is rejected, not trusted.
- **The verdict is the next action.** `regionsToRegenerate` re-runs only the
  flagged edges, under a **hard iteration cap** (~2–3; image gen isn't free).
- **The rubric is `knowledge/seam-quality.md`** — the `SeamIssueKind` values map
  1:1 to its headings. Rewrite the rubric, change what "good" means.

Start one-pass simple (generate → composite → show). Add the verify loop once the
basic version works.

---

## 8. The eval harness — how we collaborate on the AI

The agent-first product needs more than "output HTML": structured AI features we
can run, inspect, and tune together. Carry forward what palette-forge proved and
add the missing rung.

What palette-forge already does (the seed):

- **A pure, tested boundary around untrusted model output** (`rename.test.ts` —
  the parse is unit-tested without calling the model).
- **Quality-as-runnable-invariants** (`simulated-variety.test.ts` — taste
  expressed as assertions).

What to add here:

- **Structured JSON output** with schema-validated parsing (the `SeamVerdict`).
- **`scripts/` — an agent-runnable eval harness** (e.g. `pnpm eval:seam <fixture>`)
  that exercises a feature outside the browser and prints the JSON verdict. This
  is the collaboration loop: run the feature, read the structured output, tune
  `/knowledge`, re-run.
- **Two eval tiers:**
  - _Deterministic invariants_ (vitest) for objective facts: did the original
    pixels survive the composite-back? is the output exactly the requested ratio?
  - _LLM-judge_ for the subjective half: is the seam believable, judged against
    `seam-quality.md`?
- **Harvested fixtures** ("gets better with use"): accepted outputs become
  labeled `(image, ratio) → expected-verdict` examples the verifier is tested
  against. The JSON verdict is what makes harvesting mechanical.

> Note on "harness": this _eval harness_ (a rig that drives one feature) is a
> different thing from the _agent harness_ (the tool-loop-rules-verify runtime
> that turns a model into an agent). outpaint-studio's verify loop is a small
> agent harness living inside the app; the eval harness is how we test it.

---

## 9. The knowledge layer

`/knowledge` is plain markdown. Ships with solid photographic expertise; a domain
expert (architect, product photographer) can fork it by rewriting prose — by
hand or by pointing their own agent at the folder.

- `composition.md` — the extension is background, not new content; continue lines
  and perspective; keep the subject anchored.
- `lighting.md` — match light direction, temperature, shadow logic, grain/grade.
- `seam-quality.md` — the verifier's checklist (the rubric).

Consumed in two places: it **guides the extension prompt** (composition +
lighting) and **is the rubric the verifier judges against** (seam-quality). A
~15-line loader (`features/knowledge`, the palette-forge `import.meta.glob`
pattern) exposes `getKnowledge(name)`.

---

## 10. The /docs viewer (shipped in this pass)

`src/routes/docs.tsx` renders every markdown file in the repo (`README`,
`CLAUDE.md`, `docs/**`, `knowledge/*`) at `/docs`, bundled at build time via
`import.meta.glob('?raw')`. Ported from palette-forge (the pragmatic
client-side, single-file version) with `prose` styling. Add a markdown file and
it appears automatically. This is how you read this plan in the running app.

---

## 11. Data model

`OutpaintRecord` (see `src/features/outpaint/types.ts`): a source image, target
ratio, directions, status, the composited result, iteration count, stable id,
timestamp. Stored in IndexedDB (the palette-forge repo pattern). Stable IDs and
clean records mean the engine can later be exposed over **MCP** in ~30 lines —
turning "an app you visit" into "a capability your agents can call."

---

## 12. Build order (phases)

- **Phase 0 — scaffold + shell + rails.** _Done._ Runnable app, deps, empty
  home, the docs viewer, feature seams + contracts, the knowledge starters, this
  plan.
- **Setup step (do first, separate session) — port Sandbox global styles.** Pull
  the canonical styles from the `joshcoolman/sandbox` repo (font stack, light/
  dark theme, base element styling) into `src/styles.css` + the root layout. The
  current styling is a neutral dark baseline placeholder. _(Needs a session with
  `sandbox` in repo scope.)_
- **Phase 1 — the first vertical (one-pass).** Upload an image → pick a ratio /
  drag extent → build canvas + call Google extend → composite-back (`sharp`) →
  show before/after. No verifier yet. This proves the mechanism and output
  quality.
- **Phase 2 — the verifier + the eval harness.** `SeamVerdict` schema + the pure
  validated parse; the `scripts/` eval harness; deterministic invariants. Run it,
  tune `seam-quality.md`.
- **Phase 3 — the loop.** Wire verify → regenerate-flagged-region under the cap.
  The thinking feed (show the verdict).
- **Phase 4 — the funnel.** The thin proxy; free tier on the owner's key + abuse
  bound; the BYO-key Google/OpenAI panel.
- **Later (optional):** OpenAI as a second BYO provider; FAL as invisible
  many-model runtime; MCP exposure; the in-app knowledge-authoring mode.

---

## 13. Open decisions (resolve during the build)

- **Direction UX:** ratio presets only, or draggable canvas handles for
  asymmetric extension ("add more to the right")? Lean: presets first, handles in
  Phase 1.5.
- **Free-tier cap shape:** count per IP/day, lower resolution, or a watermark?
- **Schema validator:** a dependency (zod) or a hand-rolled validator in the
  palette-forge style? Lean: hand-rolled to start (one schema), keep deps lean.
- **Result persistence size:** store result blobs in IndexedDB vs. keep only the
  source + re-derive. Lean: store blobs; offer download.
