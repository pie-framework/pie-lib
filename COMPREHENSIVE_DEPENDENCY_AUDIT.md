# Comprehensive Dependency Audit - All Packages

**Date:** 2026  
**Scope:** Root package.json + All packages/\*/package.json files

---

## 🔴 CRITICAL: Deprecated Packages (Should Be Removed)

### Root package.json

| Package                | Current           | Status            | Usage Status | Action                              |
| ---------------------- | ----------------- | ----------------- | ------------ | ----------------------------------- |
| `@babel/polyfill`      | `^7.2.5`          | ⚠️ **DEPRECATED** | ❌ Not used  | Remove - use `core-js` instead      |
| `@zeit/next-css`       | `^1.0.2-canary.2` | ⚠️ **DEPRECATED** | ❌ Not used  | Remove - built into Next.js now     |
| `babel-eslint`         | `^10.0.1`         | ⚠️ **DEPRECATED** | ✅ **USED**  | Replace with `@babel/eslint-parser` |
| `now`                  | `^13.1.3`         | ⚠️ **DEPRECATED** | ✅ **USED**  | Replace with `vercel` CLI           |
| `@material-ui/codemod` | `^1.1.0`          | ⚠️ **DEPRECATED** | ❌ Not used  | Remove                              |

**Usage Details:**

- `@babel/polyfill`: Not imported anywhere - safe to remove
- `@zeit/next-css`: Not used in `next.config.js` - safe to remove (Next.js has built-in CSS support)
- `babel-eslint`: **USED** in `.eslintrc.json` as parser - must replace with `@babel/eslint-parser` first
- `now`: **USED** in `scripts/wip` - must replace with `vercel` CLI first
- `@material-ui/codemod`: Not used - safe to remove

---

## 🟠 UNUSED Dependencies (Should Be Removed)

### packages/editable-html/package.json

- **`keycode`** (`^2.2.0`) - ❌ Not imported anywhere in the codebase
- **`slate-schema-violations`** (`^0.1.39`) - ❌ Not imported anywhere in the codebase

### packages/demo/package.json

- **`immutable`** (`^4.0.0-rc.12`) - ⚠️ Only used in editable-html, not in demo itself (transitive dependency)

---

## 🟡 VERY OLD / OUTDATED Dependencies

### Release Candidate / Beta Versions

| Package      | Current        | Latest Stable | Location                        | Risk                  |
| ------------ | -------------- | ------------- | ------------------------------- | --------------------- |
| `immutable`  | `^4.0.0-rc.12` | `4.3.7`       | editable-html, demo             | ⚠️ Using RC from 2018 |
| `redux-undo` | `beta`         | `1.0.0`       | graphing, graphing-solution-set | ⚠️ Using beta version |

### Major Version Updates Available

#### d3 Packages (Major Updates)

- **d3-scale**: `^2.1.2` → Latest: `4.0.2` (v2 → v4)

  - Used in: charting, plot, graphing, graphing-solution-set, demo
  - ⚠️ **Check @visx compatibility before upgrading**

- **d3-selection**: `^1.3.2` → Latest: `3.0.0` (v1 → v3)
  - Used in: charting, plot, graphing, graphing-solution-set, demo
  - ⚠️ **Check @visx compatibility before upgrading**

#### @dnd-kit Packages

- **@dnd-kit/core**: `6.1.0` → Latest: `6.3.1`

  - Used in: drag, editable-html
  - ✅ Safe minor update

- **@dnd-kit/sortable**: `8.0.0` → Latest: `10.0.0` (v8 → v10)

  - Used in: drag, graphing, graphing-solution-set
  - ⚠️ Major update - test thoroughly

- **@dnd-kit/modifiers**: `9.0.0` → Latest: `9.0.0` ✅
- **@dnd-kit/utilities**: `3.2.2` → Latest: `3.2.2` ✅

#### @mapbox/point-geometry

- **Current**: `^0.1.0` → Latest: `1.1.0` (v0 → v1)
  - Used in: charting, demo, graphing, graphing-solution-set, graphing-utils, plot, tools
  - ⚠️ Major update - test thoroughly

#### react-draggable (Version Inconsistency)

- **charting, plot, demo**: `^3.1.1` → Should be `^3.3.0`
- **graphing, graphing-solution-set**: `^3.3.0` ✅
- **Recommendation**: Standardize all to `^3.3.0`

#### i18next

- **translator**: `^22.5.0` → Latest: `25.7.4` (v22 → v25)
  - ⚠️ Major update - check breaking changes

#### assert

- **config-ui, demo**: `^1.4.1` → Latest: `2.1.0` (v1 → v2)
  - ⚠️ Major update

---

## 🟢 Safe Minor/Patch Updates

### MUI Packages (Patch Updates)

- **@mui/material**: `^7.3.4` → `^7.3.7` (all packages)
- **@mui/icons-material**: `^7.3.4` → `^7.3.7` (all packages)
- ✅ **Safe to update** - patch version only

### Other Safe Updates

- **@emotion/react**: `^11.14.0` → Latest: `^11.14.0` ✅
- **@emotion/styled**: `^11.14.1` → Latest: `^11.14.1` ✅
- **@visx packages**: All on `^3.0.0` ✅

---

## 📦 Root package.json - Very Outdated Dev Dependencies

### Critical Outdated Packages

| Package               | Current   | Latest     | Gap      | Priority  |
| --------------------- | --------- | ---------- | -------- | --------- |
| `@babel/cli`          | `^7.2.3`  | `^7.26.0`  | ~4 years | 🔴 High   |
| `@babel/core`         | `^7.3.3`  | `^7.26.0`  | ~4 years | 🔴 High   |
| `@babel/preset-env`   | `^7.3.1`  | `^7.26.0`  | ~4 years | 🔴 High   |
| `@babel/preset-react` | `^7.0.0`  | `^7.26.0`  | ~5 years | 🔴 High   |
| `eslint`              | `^5.12.0` | `^9.15.0`  | ~6 years | 🔴 High   |
| `eslint-plugin-react` | `^7.12.3` | `^7.37.0`  | ~4 years | 🟡 Medium |
| `webpack`             | `^4.28.4` | `^5.95.0`  | ~4 years | 🔴 High   |
| `webpack-cli`         | `^3.2.1`  | `^6.0.0`   | ~5 years | 🔴 High   |
| `webpack-dev-server`  | `^3.1.14` | `^5.1.0`   | ~5 years | 🔴 High   |
| `prettier`            | `^1.15.3` | `^3.4.2`   | ~6 years | 🟡 Medium |
| `husky`               | `^4.2.5`  | `^9.1.7`   | ~5 years | 🟡 Medium |
| `lint-staged`         | `^8.1.5`  | `^15.2.11` | ~5 years | 🟡 Medium |
| `chalk`               | `^2.4.2`  | `^5.3.0`   | ~6 years | 🟡 Medium |
| `chokidar`            | `^3.4.2`  | `^4.0.3`   | ~4 years | 🟡 Medium |
| `jsdom`               | `^16.4.0` | `^25.0.1`  | ~4 years | 🟡 Medium |
| `lerna`               | `^3.11.0` | `^8.1.8`   | ~5 years | 🟡 Medium |

### Already Up-to-Date in Root

- ✅ `jest`: `^29.7.0` (latest)
- ✅ `babel-jest`: `^29.7.0` (latest)
- ✅ `@testing-library/react`: `^16.3.0` (latest)
- ✅ `@testing-library/user-event`: `^14.5.2` (latest)
- ✅ `react`: `^18.2.0` (latest)
- ✅ `react-dom`: `^18.2.0` (latest)
- ✅ `next`: `^15.4.6` (latest)

---

## 🎯 Recommended Action Plan

### Phase 1: Quick Wins (Low Risk - Do Immediately)

1. ✅ **Remove Deprecated Packages from Root (Safe to Remove):**

   - **`@babel/polyfill`** → Remove (not imported anywhere)

     - **What it is:** A polyfill package that provided JavaScript features (like Promises, Array methods) for older browsers that didn't support them natively
     - **Why deprecated:** Babel deprecated this in favor of using `core-js` directly. Modern browsers don't need most polyfills, and when needed, `core-js` is the recommended approach
     - **Used for:** Adding missing JavaScript features to older browsers (IE11, etc.)

   - **`@zeit/next-css`** → Remove (not used in next.config.js)

     - **What it is:** A Next.js plugin that enabled CSS imports (`.css` files) in Next.js applications
     - **Why deprecated:** Next.js now has built-in CSS support (since Next.js 9.2+), so this plugin is no longer needed
     - **Used for:** Importing CSS files in Next.js (e.g., `import './styles.css'`)

   - **`@material-ui/codemod`** → Remove (not used)
     - **What it is:** A codemod (code transformation tool) for migrating Material-UI code to newer versions
     - **Why deprecated:** You've already completed the Material-UI → MUI migration, so this tool is no longer needed
     - **Used for:** Automatically transforming Material-UI v3/v4 code to MUI v5+ syntax

2. ⚠️ **Replace Deprecated Packages (Requires Code Changes):**

   - **`babel-eslint`** → Replace with `@babel/eslint-parser` (used in `.eslintrc.json`)

     - **What it is:** An ESLint parser that allows ESLint to understand Babel-transformed JavaScript code (JSX, TypeScript, modern JS features)
     - **Why deprecated:** The `babel-eslint` package was renamed to `@babel/eslint-parser` and is now maintained under the Babel organization
     - **Used for:** Linting JavaScript/JSX code that uses Babel features (in your `.eslintrc.json` as the parser)
     - **Action needed:** Update `.eslintrc.json` to use `@babel/eslint-parser` instead

   - **`now`** → Replace with `vercel` CLI (used in `scripts/wip`)
     - **What it is:** The deployment CLI tool for Vercel (formerly Zeit) platform
     - **Why deprecated:** The `now` package was renamed to `vercel` when Zeit rebranded to Vercel
     - **Used for:** Deploying your Next.js demo app to Vercel hosting platform (used in `scripts/wip`)
     - **Action needed:** Update `scripts/wip` to use `vercel` command instead of `now`

3. ✅ **Remove Unused Dependencies:**

   - `keycode` from editable-html
   - `slate-schema-violations` from editable-html
   - `immutable` from demo (transitive dependency, not used directly)

4. ✅ **Safe Patch Updates:**

   - Update all MUI packages: `7.3.4` → `7.3.7`
   - Standardize `react-draggable`: Update charting, plot, demo to `^3.3.0`

5. ✅ **Minor Updates:**
   - `@dnd-kit/core`: `6.1.0` → `6.3.1`

### Phase 2: Medium Risk (Test Thoroughly)

1. ⚠️ **Update Release Candidates:**

   - **`immutable`**: `^4.0.0-rc.12` → `^4.3.7` (stable release)

     - **Where used:** `packages/editable-html/src/plugins/list/index.jsx`
     - **Usage:** `import Immutable from 'immutable';` (line 3)
     - **Code changes needed:** ⚠️ **Likely minimal** - Same major version (v4), RC → stable should be backward compatible, but test thoroughly
     - **Risk:** Low-Medium (RC to stable in same major version)

   - **`redux-undo`**: `beta` → `^1.0.0` (if stable version available)

     - **Where used:**
       - `packages/graphing/src/container/reducer.js` - `import undoable from 'redux-undo';`
       - `packages/graphing/src/container/index.jsx` - `import { ActionCreators } from 'redux-undo';`
       - `packages/graphing-solution-set/src/container/reducer.js` - `import undoable from 'redux-undo';`
       - `packages/graphing-solution-set/src/container/index.jsx` - `import { ActionCreators } from 'redux-undo';`
     - **Usage pattern:**

       ```javascript
       // reducer.js
       undoable(marks, { debug: false });

       // index.jsx
       ActionCreators.undo();
       ActionCreators.redo();
       ```

     - **Code changes needed:** ⚠️ **Possibly** - Beta → v1.0.0 is a major milestone, may have breaking changes. Check redux-undo v1.0.0 changelog for API changes
     - **Risk:** Medium-High (beta to stable v1.0.0 could have breaking changes)

2. ⚠️ **Major Updates (Require Testing):**
   - `@dnd-kit/sortable`: `8.0.0` → `10.0.0`
   - `@mapbox/point-geometry`: `^0.1.0` → `1.1.0`
   - `i18next`: `^22.5.0` → `^25.7.4`
   - `assert`: `^1.4.1` → `^2.1.0`

### Phase 3: High Risk (Requires Significant Testing)

1. ⚠️ **d3 Packages (Check @visx Compatibility First):**

   - **`d3-scale`**: `^2.1.2` → `4.0.2` (v2 → v4, major version jump)

     - **Where used:**
       - `packages/charting/src/plot/common/plot.jsx` - `import { scaleLinear } from 'd3-scale'`
       - `packages/charting/src/__tests__/utils.js` - `import { scaleLinear, scaleBand } from 'd3-scale'`
       - `packages/plot/src/graph-props.js` - `import { scaleLinear } from 'd3-scale'`
     - **Usage pattern:** Creating scales for charts/graphs (linear, band scales)
     - **Code changes needed:** ⚠️ **Possibly** - Major version jump (v2 → v4) likely has breaking API changes
     - **@visx compatibility:** ⚠️ **CRITICAL** - @visx v3.0.0 was built/tested with d3 v2/v1. Must verify @visx works with d3 v4 before upgrading
     - **Risk:** High - Could break all charting/graphing components if @visx is incompatible

   - **`d3-selection`**: `^1.3.2` → `3.0.0` (v1 → v3, major version jump)
     - **Where used:**
       - `packages/plot/src/root.jsx` - `import { select, mouse } from 'd3-selection'`
       - `packages/plot/src/grid-draggable.jsx` - `import { clientPoint } from 'd3-selection'`
       - `packages/graphing/src/bg.jsx` - `import { select, mouse } from 'd3-selection'`
       - `packages/graphing-solution-set/src/bg.jsx` - `import { select, mouse } from 'd3-selection'`
     - **Usage pattern:** DOM selection and mouse event handling for interactive graphs
     - **Code changes needed:** ⚠️ **Possibly** - Major version jump (v1 → v3) likely has breaking API changes
     - **@visx compatibility:** ⚠️ **CRITICAL** - @visx v3.0.0 was built/tested with d3 v2/v1. Must verify @visx works with d3 v3 before upgrading
     - **Risk:** High - Could break interactive features (mouse events, selections) in graphing components

   **What These Updates Mean:**

   - **d3-scale v2 → v4:** Major version jump with potential breaking changes to scale API (domain, range, ticks, etc.)
   - **d3-selection v1 → v3:** Major version jump with potential breaking changes to selection/mouse APIs
   - Both are **4+ years behind** current versions

   **@visx Compatibility Concern:**

   - You're using **@visx v3.0.0** (from 2020-2021 era)
   - @visx v3 was built and tested with **d3 v2/v1** (the versions you currently have)
   - @visx may have **hard dependencies** or **peer dependencies** on specific d3 versions
   - **Upgrading d3 without checking could break:**
     - All charting components (bars, lines, plots)
     - All graphing components (axes, grids, shapes)
     - Any component using @visx internally

   **✅ CHECKED - Findings:**

   1. **@visx v3.0.0 d3 Dependencies:**

      - **@visx/scale@3.0.0** uses: `d3-scale: ^4.0.2` ✅
      - This means **@visx v3.0.0 already supports d3-scale v4!**
      - Your current `d3-scale: ^2.1.2` is **incompatible** with what @visx expects
      - **Action:** You should upgrade `d3-scale` to `^4.0.2` to match @visx's dependency

   2. **Newer @visx Versions Available:**

      - **Latest stable:** `@visx v3.12.0` (published ~1 year ago)
      - **Latest prerelease:** `@visx v4.0.1-alpha.0`
      - **Your version:** `@visx v3.0.0` (from 2020-2021)
      - **Recommendation:** Consider upgrading @visx to `v3.12.0` (latest stable) for bug fixes and improvements

   3. **@visx v3.12.0 Changes:**

      - Uses `@visx/vendor` package instead of direct d3 dependencies
      - This bundles d3 dependencies, reducing version conflicts
      - May have better compatibility with newer d3 versions

   4. **d3-selection Status:**
      - Need to verify if @visx uses d3-selection directly or if it's only used in your code
      - Your code uses `d3-selection` directly in `plot`, `graphing` packages for mouse events
      - This is separate from @visx usage

   **Updated Recommendation:**

   1. ✅ **Upgrade d3-scale to ^4.0.2** - @visx v3.0.0 already expects this version
   2. ⚠️ **Test d3-selection upgrade** - Your code uses it directly, not through @visx
   3. ✅ **Consider upgrading @visx to v3.12.0** - Latest stable with bug fixes
   4. ⚠️ **Test thoroughly** - Run all charting/graphing tests after upgrades

2. ⚠️ **react-portal Migration:**

   - Replace `react-portal` with `ReactDOM.createPortal` in:
     - `packages/tools/src/rotatable.jsx`
     - Check `packages/editable-html` and `packages/demo` for usage
   - Remove `react-portal` from package.json files after migration
   - See `REACT_18_DEPENDENCY_CLEANUP.md` for details

### Phase 4: Root Package.json Modernization (Separate Project)

**Why "Separate Project"?**

- This phase focuses on **build tooling** (devDependencies in root), not runtime dependencies
- These updates affect the **development/build process**, not the packages themselves
- Higher risk of breaking builds/tests/linting
- Can be done independently without affecting package dependencies
- Requires thorough testing of build pipeline, test suite, and linting

**Scope:**

1. ⚠️ **Babel Updates:**

   - Update all Babel packages to latest v7.x (`^7.2.3` → `^7.26.0`)
   - Consider migration to Babel v8 when available
   - **Impact:** Build process, transpilation

2. ⚠️ **ESLint Migration:**

   - Migrate from ESLint v5 → v9 (breaking changes)
   - Update `babel-eslint` → `@babel/eslint-parser`
   - **Impact:** Linting rules, configuration format

3. ⚠️ **Webpack Migration:**

   - Migrate from Webpack v4 → v5 (breaking changes)
   - Update webpack-cli and webpack-dev-server
   - **Impact:** Build configuration, bundling

4. ⚠️ **Other Tooling:**
   - Update Prettier to v3.x (formatting changes)
   - Update Husky to v9.x (git hooks)
   - Update Lerna to v8.x (monorepo management)
   - **Impact:** Development workflow, code formatting, git hooks

**Note:** This phase should be planned as a separate initiative because:

- It requires updating build configurations (webpack.config.js, .eslintrc, etc.)
- May require fixing breaking changes in build scripts
- Needs comprehensive testing of the entire build/test pipeline
- Can be done after Phases 1-3 are complete

---

## 📋 Summary Statistics

- **Total Packages Audited:** 28 (root + 27 packages)
- **Deprecated Packages Found:** 5
- **Unused Dependencies Found:** 2
- **Very Old/RC Dependencies:** 2
- **Major Updates Available:** 8+
- **Safe Patch Updates:** MUI packages (all packages)

---

## ⚠️ Notes

1. **d3 Packages**: Major version updates available, but must check @visx compatibility first as @visx may have specific d3 version requirements.

2. **Root Dev Dependencies**: Many are 4-6 years old. Modernization would be a significant project but would improve build times, security, and developer experience.

3. **react-portal**: Still present in 3 packages. Should be replaced with `ReactDOM.createPortal` (see REACT_18_DEPENDENCY_CLEANUP.md).

---

## ✅ Verification Checklist

- [x] All React versions: `^18.2.0` ✅
- [x] All React-DOM versions: `^18.2.0` ✅
- [x] No Material-UI dependencies (all migrated to MUI) ✅
- [x] No React 16/17 dependencies ✅
- [ ] Deprecated packages removed
- [ ] Unused dependencies removed
- [ ] Safe patch updates applied
- [ ] Major updates evaluated and tested
