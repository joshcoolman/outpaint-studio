# feature: prefs

Local, single-user preferences — the BYO-key store (the palette-forge
`prefs-repo` + `settings` mirror pattern).

- **No accounts, no backend DB.** Keys live in IndexedDB, mirrored to a sync
  in-memory `settings` so render decisions ("show the OpenAI panel?") are sync.
- **What it holds:** the selected provider (Google / OpenAI), that provider's
  BYO key, and free-tier usage state (how many no-signup extends remain).
- **The funnel:** no key → the no-signup free tier (owner's key, via the proxy,
  rate-limited); cap reached → reveal the BYO-key panel. See `docs/PLAN.md` →
  provider & money model.
