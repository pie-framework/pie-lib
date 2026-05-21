---
name: nvm-jest-v22
description: >-
  Runs Jest in this repository using Node v22 via nvm, then npx jest for specific
  test files or folders. Use when running tests in pie-lib, when Jest fails with
  a Node syntax error (e.g. optional chaining in jest-cli), or when the user asks
  to test specific files or packages with the correct Node version.
---

# nvm v22 + npx Jest (pie-lib)

## Required workflow

Use **nvm use v22** and then use **npx jest** to test specific files, folders.

Run commands from the **repository root** (`pie-lib`), where `jest.config.js` lives.

### One-off command shape

Load nvm if the shell is non-interactive (e.g. agent terminals may not source `.bashrc`):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /path/to/pie-lib
nvm use v22
npx jest <paths-or-patterns> [optional jest flags]
```

### Examples

Single test file:

```bash
npx jest packages/editable-html-tip-tap/src/components/__tests__/CharacterPicker.test.jsx
```

All tests under a package folder (Jest resolves paths under `packages/*/src` via `testRegex`):

```bash
npx jest packages/editable-html-tip-tap
```

Pattern:

```bash
npx jest --testPathPattern=MenuBar
```

Watch mode (when the user asks):

```bash
npx jest --watch packages/some-package/src/__tests__
```

## Notes

- If `nvm use v22` fails, ensure Node 22 is installed (`nvm install 22`).
- Prefer **npx jest** from repo root so the workspace `jest.config.js` and local `jest` version are used.
