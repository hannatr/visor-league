# Plan 002: Bump mongoose past the 9.7.1 prototype-pollution fix

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 48a323f..HEAD -- package.json package-lock.json config/database.js models utils/requests.js`
> If any in-scope or adjacent mongoose-using file changed since this plan was
> written, compare the "Current state" excerpts against the live code before
> proceeding; on a mismatch for `package.json` mongoose line or for model APIs
> this plan assumes, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (independent of `plans/001-bump-nextjs.md`)
- **Category**: migration / security
- **Planned at**: commit `48a323f`, 2026-08-07

## Why this matters

The lockfile resolves `mongoose@9.6.2`. `npm audit` reports moderate advisory `GHSA-664h-wqgq-64gw` for mongoose `>=9.0.0 <9.7.2` (prototype pollution in update casting via `__proto__`-prefixed dotted paths). Fix is in-range for the declared `^9.6.2` caret, but the lockfile has not been refreshed to a patched release. All persistence in this app goes through mongoose (`config/database.js`, `models/*`, server actions in `utils/requests.js`). Bumping the locked version to ≥ `9.7.2` (prefer current latest 9.x) closes the advisory without a major-version migration.

## Current state

- `package.json` — `"mongoose": "^9.6.2"` (caret already allows 9.7+/9.9+).
- `package-lock.json` — currently resolves `mongoose@9.6.2`.
- Usage pattern (read-only recon — do **not** change these files in this plan unless install/build proves a breaking API change, which should STOP):

```js
// config/database.js
import mongoose from "mongoose";
await mongoose.connect(process.env.MONGODB_URI);
```

```js
// models/*.js pattern — Schema / model / models from mongoose
import { Schema, model, models } from "mongoose";
// DFSResult also: import mongoose from "mongoose"; model(..., "dfs-results")
```

```js
// utils/requests.js — typical write style (mutate document + save), not dotted updateOne
const existingLeague = await DFSResult.findById(league._id);
existingLeague.players = league.players.map(...);
await existingLeague.save();
// Also: Result.find, Player.find, Tournament.find / findOne, Admin.findOne, bcrypt login
```

- At plan time, `npm view mongoose version` → `9.9.1`.
- No test suite. Verification = install + lint + build; optional smoke against local Mongo if available.
- Commit message style for deps: short phrases like `update deps`, `updates deps, eslint`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Drift check | `git diff --stat 48a323f..HEAD -- package.json package-lock.json` | empty or only plan 001 Next bumps (OK) |
| Latest mongoose | `npm view mongoose version` | a 9.x version ≥ 9.7.2 |
| Update lock | `npm update mongoose` **or** `npm install mongoose@^9.9.1` | exit 0 |
| Resolve check | `npm ls mongoose --depth=0` | mongoose@≥9.7.2 |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| Audit | `npm audit --omit=dev` | GHSA-664h-wqgq-64gw / mongoose `<9.7.2` no longer reported |

Build note: same as plan 001 — `.env.local` may be present locally; do not commit env files. Placeholder `MONGODB_URI` only if build fails solely for a missing env var.

## Scope

**In scope** (the only files you should modify):

- `package.json` (mongoose version range only, if you choose to raise the floor)
- `package-lock.json`
- `plans/README.md` (status row for 002 only)

**Out of scope**:

- Application source under `app/`, `components/`, `utils/`, `models/`, `config/` — no API refactors in this plan.
- Next.js / eslint-config-next bumps — that is `plans/001-bump-nextjs.md`.
- Switching `bcrypt` → `bcryptjs`, adding indexes, rewriting `connectDB` for serverless caching.
- Adding tests or CI.
- Committing secrets or `.env*`.

## Git workflow

- Branch: `advisor/002-bump-mongoose` (or the operator’s existing advisor branch).
- If plan 001 already landed on the same branch, commit mongoose separately so reviews stay separable.
- Commit message example: `bump mongoose past 9.7.1 security fix`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Confirm target and refresh mongoose in the lockfile

1. Run `npm view mongoose version` → record as `TARGET` (must be `9.x` and `≥ 9.7.2`).
2. From repo root, prefer the smallest change that moves the lockfile:

```bash
npm install mongoose@^9.9.1
```

   (If `TARGET` differs from 9.9.1 when you run, use `npm install mongoose@^TARGET` with that TARGET’s caret, still staying on major 9.)

3. Optionally raise the declared floor in `package.json` from `"^9.6.2"` to `"^9.9.1"` (or `"^TARGET"`) so the lockfile cannot float back below the advisory cutoff on a clean install from an old lock. **Do this** — set:

```json
"mongoose": "^9.9.1"
```

(or `^TARGET` if TARGET > 9.9.1). Keep the caret. Do not pin exact unless install forces it.

**Verify**:

```bash
node -e "console.log(require('./package.json').dependencies.mongoose)"
npm ls mongoose --depth=0
```

→ `package.json` shows `^9.9.1` (or `^TARGET`); `npm ls` shows resolved version ≥ `9.7.2` and preferably `TARGET`. Exit 0.

### Step 2: Lint and build

```bash
npm run lint
npm run build
```

**Verify**: both exit 0. Build still lists the same app routes as before (`/`, `/classic`, `/dfs`, `/history`, etc.).

If build/lint fails with a mongoose API break in app code, **STOP** — do not rewrite models to “make it work” without reporting; a 9.6 → 9.9 bump is expected to be API-compatible for `Schema` / `model` / `find` / `findById` / `findOne` / `save` / `connect`.

### Step 3: Confirm the advisory is cleared for mongoose

```bash
npm audit --omit=dev
```

**Verify**: output does not report mongoose versions `9.0.0 - 9.7.1` / `GHSA-664h-wqgq-64gw` against the installed tree. Advisories on **next** (if plan 001 not done yet) are OK and must not be fixed here.

### Step 4: Optional local smoke (skip if no Mongo)

If `.env.local` already has `MONGODB_URI` and Mongo is reachable:

```bash
npm run dev
```

Hit `/` and `/dfs` once; confirm pages render (empty data is OK). Do not create admin users or log secrets. Stop the dev server when done.

If Mongo is unavailable, skip this step — lint + build + audit are sufficient for Done criteria.

### Step 5: Commit and update the index

1. Stage only `package.json`, `package-lock.json`, `plans/README.md`.
2. Commit, e.g.:

```text
bump mongoose past 9.7.1 security fix
```

3. Set plan 002 Status to `DONE` in `plans/README.md`.

**Verify**: last commit touches only in-scope files; status row updated.

## Test plan

No automated tests exist. Required gates:

1. `npm ls mongoose --depth=0` → ≥ 9.7.2  
2. `npm run lint` → exit 0  
3. `npm run build` → exit 0  
4. `npm audit --omit=dev` → mongoose GHSA-664h-wqgq-64gw cleared  

Optional (not required for DONE): manual page load against local Mongo.

Do not add a test framework in this plan.

## Done criteria

- [ ] `package.json` `mongoose` range is `^9.9.1` or `^TARGET` with TARGET ≥ 9.7.2.
- [ ] Lockfile resolves mongoose ≥ 9.7.2 (`npm ls mongoose --depth=0`).
- [ ] `npm run lint` exits 0.
- [ ] `npm run build` exits 0.
- [ ] `npm audit --omit=dev` no longer reports GHSA-664h-wqgq-64gw for mongoose.
- [ ] No application source files modified.
- [ ] `plans/README.md` status row for 002 is `DONE`.

## STOP conditions

Stop and report back (do not improvise) if:

- `npm view mongoose version` is not 9.x ≥ 9.7.2.
- Install tries to pull mongoose 10.x or requires unrelated major upgrades.
- Lint/build fails due to mongoose API changes in `models/` or `utils/requests.js`.
- Drift shows someone already changed mongoose usage patterns so the excerpts above are wrong.
- You are about to edit Next, auth, or scoring code to “finish” the bump.

## Maintenance notes

- Prefer keeping the caret floor at ≥ 9.7.2 so future `npm install` on a fresh lock generation cannot reintroduce 9.6.x.
- Reviewer focus: lockfile resolution only; no silent model changes; audit line cleared.
- This app mostly uses document `save()` rather than dotted `updateOne` casting — exploit likelihood was already lower, but staying patched is still correct.
- Deferred: serverless `connectDB` global cache, query projections/indexes, input validation on `updateDFSLeague`.
