# pie-lib

## What this is

A monorepo of shared React components/utilities for the **PIE (Portable Interactions & Elements)** assessment framework — math rendering/input, drag-and-drop, charting, rich-text editing, config UI, rubric/scoring UI, icons, style utils. Published under the `@pie-lib/*` npm scope.

Consumed by the sibling repo **`pie-elements`** (`../pie-elements`), which installs these as normal npm dependencies (not a local link) — `pie-elements` pins exact versions in its root `package.json` `resolutions` block.

## Repo structure

- Lerna (independent versioning, conventional-commits driven) + Yarn workspaces (`packages/*`).
- `packages/` — 28 library packages + `demo` (a Next.js app for local preview of all packages, deployed to now.sh on `develop`/`master` merges).
- Every package: `src/` (with `__tests__/`) → `lib/` (compiled output, checked in).
- No TypeScript anywhere — plain JS/JSX with PropTypes.

Notable packages: `render-ui` (most widely consumed — preview layout, feedback, collapsible, response indicators), `drag` (dnd-kit based), `math-input`/`math-rendering`/`math-toolbar` (MathQuill, mid-migration to MathLive — see `docs/mathquill-to-mathlive-migration.md`), `charting`/`plot` (visx), `config-ui`, `controller-utils`, `test-utils` (shared test helpers/mocks).

## Commands

- `npm run build` — build all packages
- `npm test` — run all tests; to test a single package: `./node_modules/.bin/jest packages/pkg-name/src/`
- `npm run lint` — ESLint
- `scripts/dev --scope $package-name` — run the demo site on localhost:3000 (`--scope` optional, defaults to all)
- `npm run release` — release + deploy (merging to `develop` → `next` dist-tag / pie-lib-next.now.sh; merging to `master` → `latest` / pie-lib.now.sh)

## Conventions

- **Conventional commits syntax** on commit messages — Lerna uses this to detect the appropriate independent version bump per package.
- Styling has migrated to MUI v7 + Emotion (older packages may still show JSS-era patterns).
- If test setup gets out of sync: `npm run build`, `rm -fr packages/test-utils/node_modules`, then retry.
- Node >=18 required; there's a known Jest/Node quirk documented in `.cursor/skills/nvm-jest-v22/SKILL.md` (use `nvm use v22` before running jest directly if you hit a syntax error).

## Working preferences

- **Do not create git commits unless explicitly asked.** The user commits their own changes — leave the working tree staged/unstaged as appropriate and let them review and commit themselves.
