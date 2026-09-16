# Plan 001: Bump Next.js to a patched 16.x release

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 48a323f..HEAD -- package.json package-lock.json`
> If either in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: migration / security
- **Planned at**: commit `48a323f`, 2026-08-07

## Why this matters

`package.json` pins `next` exactly at `16.2.6`. `npm audit --omit=dev` reports **high** advisories on that version, including Denial of Service against App Router Server Actions (`GHSA-m99w-x7hq-7vfj`). This app’s write paths (`adminLogin`, `updateScore`, `updateDFSLeague`) are Server Actions in `utils/requests.js`, so that class of issue is reachable. The exact pin also blocks a normal `npm audit fix` — the tool wants `next@16.3.0`, which is outside the stated range. Bumping Next (and aligning `eslint-config-next`) closes the published highs for this line and refreshes transitive `postcss` / `sharp` pulled through Next.

## Current state

- `package.json` — dependency manifest; `next` is an **exact** pin (no caret); `eslint-config-next` uses a caret.
- `package-lock.json` — locks `next@16.2.6` and matching tooling.
- App is Next.js App Router under `app/`; mutations live in `utils/requests.js` (`"use server"`).
- `components/NavBar.jsx` uses `next/image`.
- There is **no** `middleware.js` / `middleware.ts` / `proxy` file — middleware-specific advisories are likely N/A here; still upgrade the framework.
- No TypeScript (`jsconfig.json` only). Scripts: `dev`, `build`, `start`, `lint`. No test script.
- Recent commit style for dep work: short imperative / lowercase phrases, e.g. `updates deps, eslint`, `update deps`.

Excerpts at plan time:

```json
// package.json (relevant lines)
"dependencies": {
  "mongoose": "^9.6.2",
  "next": "16.2.6",
  "react": "^19",
  "react-dom": "^19"
},
"devDependencies": {
  "eslint": "^9.39.4",
  "eslint-config-next": "^16.2.6",
  ...
}
```

```text
# npm ls at plan time
next@16.2.6
```

```text
# npm view next version at plan time → 16.3.0
# Target: next@16.3.0 and eslint-config-next@16.3.0 (or whatever current patched 16.x
# is ≥ 16.3.0 when you execute — see Step 1).
```

Repo conventions to match:

- Keep the project JS (do not add TypeScript).
- Prefer minimal `package.json` diff: version bumps only for this plan.
- Do not change application source unless the upgrade forces a compile/lint failure that cannot be fixed by config alone — if that happens, STOP (see STOP conditions).

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Drift check | `git diff --stat 48a323f..HEAD -- package.json package-lock.json` | empty, or only unrelated if STOP |
| Latest Next | `npm view next version` | a 16.x version ≥ 16.3.0 |
| Install | `npm install` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0; compiles; lists app routes |
| Audit (Next) | `npm audit --omit=dev 2>&1 \| grep -A2 'next '` or `npm ls next` | installed next ≥ 16.3.0; Server Actions DoS on 16.2.6 no longer reported for the installed version |

Note: `npm run build` succeeds on this repo when `.env.local` exists (gitignored). Build should not require a live MongoDB because data routes use `force-dynamic`. If build fails solely for missing `MONGODB_URI`, set a placeholder for the build command only (e.g. `MONGODB_URI=mongodb://127.0.0.1:27017/visor npm run build`) — do not commit `.env` files.

## Scope

**In scope** (the only files you should modify):

- `package.json`
- `package-lock.json`
- `plans/README.md` (status row for 001 only)

**Out of scope** (do NOT touch, even though they look related):

- `utils/requests.js`, `utils/auth.js`, any `app/` or `components/` files — auth/token fixes are separate findings; this plan is version bumps only.
- `mongoose` version — that is `plans/002-bump-mongoose.md`.
- React major upgrades, Tailwind major upgrades, adding TypeScript, adding tests/CI.
- Changing `next.config.mjs` unless Step 2 verification proves the new Next **requires** a config change to build (then STOP and report the error instead of inventing config).
- Committing `.env` / `.env.local` or any secret values.

## Git workflow

- Branch: `advisor/001-bump-nextjs` (or continue on an existing advisor branch if the operator already created one for this plan).
- Commit message style (match recent history): short, lowercase/imperative, e.g. `bump next to 16.3.0 for security advisories`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Confirm target version and edit `package.json`

1. Run `npm view next version` and record the printed version as `TARGET`.
2. If `TARGET` is not a `16.x` release, or is lower than `16.3.0`, **STOP** (see STOP conditions).
3. In `package.json`:
   - Set `"next"` to `"TARGET"` as an **exact** pin (same style as today: no `^`), e.g. `"next": "16.3.0"`.
   - Set `"eslint-config-next"` to `"^TARGET"` (keep the caret, matching current style), e.g. `"eslint-config-next": "^16.3.0"`.
4. Do not change any other dependency lines in this step.

**Verify**: `node -e "const p=require('./package.json'); console.log(p.dependencies.next, p.devDependencies['eslint-config-next'])"` → prints `TARGET` and `^TARGET` (example: `16.3.0 ^16.3.0`).

### Step 2: Refresh the lockfile

Run from the repo root:

```bash
npm install
```

**Verify**:

```bash
npm ls next eslint-config-next --depth=0
```

→ `next@TARGET` and `eslint-config-next@TARGET` (or a 16.x patch ≥ TARGET allowed by the caret on eslint-config-next). Exit 0. No `invalid` / `UNMET` peer errors that block install.

### Step 3: Lint and build

```bash
npm run lint
npm run build
```

**Verify**:

- `npm run lint` → exit 0.
- `npm run build` → exit 0; banner shows `Next.js TARGET` (or the installed 16.x); routes still include `/`, `/classic`, `/dfs`, `/dfs/admin`, `/history`, `/login`, `/rules`.

If lint/build fails with an actionable error confined to `package.json` / lockfile (e.g. peer range), fix only those files and re-run once. If the failure requires editing application source or Next config, **STOP**.

### Step 4: Confirm advisories for the old pin are gone

```bash
npm ls next --depth=0
npm audit --omit=dev
```

**Verify**:

- `npm ls next` shows version ≥ 16.3.0.
- Audit output no longer lists the installed `next` at `16.2.6`. Remaining advisories on **other** packages (e.g. mongoose until plan 002) are OK and must not be “fixed” in this plan.

### Step 5: Commit and update the index

1. Stage only: `package.json`, `package-lock.json`, and `plans/README.md` (status).
2. Commit with a message in the repo style, e.g.:

```text
bump next to 16.3.0 for security advisories
```

3. In `plans/README.md`, set plan 001 Status to `DONE`.

**Verify**: `git status` → clean for in-scope files; `git log -1 --oneline` shows the bump commit; `git diff --name-only HEAD~1` lists only the in-scope files (plus README status).

## Test plan

This repo has **no test runner**. Behavioral verification for this plan is:

1. `npm run lint` (exit 0).
2. `npm run build` (exit 0).
3. Optional manual smoke (if a local Mongo + `.env.local` is available — do not invent secrets):
   - `npm run dev` loads `/` without a Next crash.
   - `/login` still renders.
   - Do **not** commit any credentials used during smoke.

Do not add a test framework in this plan.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `package.json` has `next` exact pin ≥ `16.3.0` and `eslint-config-next` caret aligned to the same major.minor (or full TARGET).
- [ ] `npm ls next --depth=0` reports that version; exit 0.
- [ ] `npm run lint` exits 0.
- [ ] `npm run build` exits 0 and reports the new Next version.
- [ ] `npm audit --omit=dev` does not report the installed next as `16.2.6`.
- [ ] No files outside the in-scope list are modified (`git status` / last commit file list).
- [ ] `plans/README.md` status row for 001 is `DONE`.

## STOP conditions

Stop and report back (do not improvise) if:

- Drift check shows `package.json` / `package-lock.json` already changed in a conflicting way (e.g. someone already bumped Next differently).
- `npm view next version` is not a 16.x ≥ 16.3.0 (wrong major, unpublished, or registry failure).
- Install introduces peer dependency conflicts that require upgrading React major or other out-of-scope packages.
- `npm run lint` or `npm run build` fails in a way that requires editing `app/`, `components/`, `utils/`, or `next.config.mjs`.
- You are tempted to also bump mongoose, React, or Tailwind “while you’re here” — that is out of scope (mongoose = plan 002).

## Maintenance notes

- Prefer keeping `next` on an exact pin **or** document why you switch to `^` — exact pins previously delayed security bumps; after this lands, consider `^16.3.0` in a later DX decision, but do not change pin style in this plan unless the operator asks.
- After deploy, re-smoke Server Actions: admin login, DFS league update, and score update (`SCORE_TOKEN` path). Those behaviors are unchanged by design in this plan; regressions would indicate a Next breaking change.
- Reviewer focus: lockfile-only blast radius, Next version in build banner, no accidental app code edits.
- Deferred: auth cookie hardening, SCORE_TOKEN URL removal, mongoose bump (plan 002), test baseline.
