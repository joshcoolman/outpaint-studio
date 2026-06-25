# feature: generate

The provider adapters behind one `ExtendEngine` interface (`types.ts`).

- **Google first** (`@google/genai`, Gemini 2.5 Flash Image / "Nano Banana") —
  the brand a general audience recognizes for "image"; also powers the no-signup
  free tier on the owner's key.
- **OpenAI next** — the familiar fallback BYO-key provider.
- **FAL is deferred and invisible** — a great runtime, a boutique _brand_. If
  added later it's internal plumbing for many models, never a user-facing
  "enter your FAL key" button. See `docs/PLAN.md` → provider model.

Adapters call out through the **thin stateless Nitro proxy** (the key never
ships to the browser). The adapter returns the raw extended frame; the
pixel-preserving composite-back is the `outpaint` mechanism, not the adapter's.
