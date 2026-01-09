# Complete Dependency Analysis - @pie-lib Monorepo

**Generated:** $(date)  
**Analysis Scope:** All packages + Root package.json

---

## 📊 Executive Summary

### Critical Issues Found:
1. **react-draggable version inconsistency** across packages
2. **Major version updates available** for d3 packages (d3-scale, d3-selection)
3. **@dnd-kit packages** have major updates available
4. **Root package.json** contains very outdated dev dependencies
5. **@material-ui/codemod** is deprecated (should be removed)

### Quick Wins:
- MUI packages can be updated from `7.3.4` → `7.3.7` (patch update)
- Several minor/patch updates available

---

## 🔴 Critical Issues

### 1. react-draggable Version Inconsistency
**Issue:** Different versions used across packages

| Package | Version | Status |
|---------|---------|--------|
| charting | `^3.1.1` | ⚠️ Outdated |
| plot | `^3.1.1` | ⚠️ Outdated |
| demo | `^3.1.1` | ⚠️ Outdated |
| graphing | `^3.3.0` | ✅ Current |
| graphing-solution-set | `^3.3.0` | ✅ Current |

**Recommendation:** Update all to `^3.3.0` for consistency

---

### 2. d3 Packages Major Version Behind

#### d3-scale
- **Current:** `^2.1.2` (used in: charting, plot, graphing, graphing-solution-set, demo)
- **Latest:** `4.0.2`
- **Status:** ⚠️ Major version update available (v2 → v4)
- **Note:** Check @visx compatibility before upgrading

#### d3-selection
- **Current:** `^1.3.2` (used in: charting, plot, graphing, graphing-solution-set, demo)
- **Latest:** `3.0.0`
- **Status:** ⚠️ Major version update available (v1 → v3)
- **Note:** Check @visx compatibility before upgrading

---

### 3. @dnd-kit Packages Major Updates Available

#### @dnd-kit/core
- **Current:** `6.1.0` (used in: drag, editable-html)
- **Latest:** `6.3.1`
- **Status:** ⚠️ Minor update available

#### @dnd-kit/sortable
- **Current:** `8.0.0` (used in: drag, graphing, graphing-solution-set)
- **Latest:** `10.0.0`
- **Status:** ⚠️ Major version update available (v8 → v10)

---

### 4. @mapbox/point-geometry Major Update Available
- **Current:** `^0.1.0` (used in: charting, demo, graphing, graphing-solution-set, graphing-utils, plot, tools)
- **Latest:** `1.1.0`
- **Status:** ⚠️ Major version update available (v0 → v1)

---

## 🟡 Minor Updates Available

### MUI Packages (Safe Patch Updates)
- **@mui/material:** `7.3.4` → `7.3.7` (all packages)
- **@mui/icons-material:** `7.3.4` → `7.3.7` (all packages)
- **Status:** ✅ Safe to update (patch version)

---

## 📦 Root Package.json Analysis

### 🔴 Critical Issues in Root

#### 1. @material-ui/codemod (Deprecated)
- **Current:** `^1.1.0`
- **Latest:** `4.5.1`
- **Status:** ⚠️ **DEPRECATED** - Should be removed (Material-UI → MUI migration complete)

#### 2. Very Outdated Dev Dependencies

| Package | Current | Latest | Status |
|---------|---------|--------|--------|
| @babel/cli | ^7.2.3 | ^7.26.0 | ⚠️ Major behind |
| @babel/core | ^7.3.3 | ^7.26.0 | ⚠️ Major behind |
| @babel/preset-env | ^7.3.1 | ^7.26.0 | ⚠️ Major behind |
| @babel/preset-react | ^7.0.0 | ^7.26.0 | ⚠️ Major behind |
| @babel/polyfill | ^7.2.5 | ⚠️ **DEPRECATED** | Remove (use core-js) |
| eslint | ^5.12.0 | ^9.15.0 | ⚠️ Major behind |
| eslint-plugin-react | ^7.12.3 | ^7.37.0 | ⚠️ Major behind |
| webpack | ^4.28.4 | ^5.95.0 | ⚠️ Major behind |
| webpack-cli | ^3.2.1 | ^6.0.0 | ⚠️ Major behind |
| webpack-dev-server | ^3.1.14 | ^5.1.0 | ⚠️ Major behind |
| prettier | ^1.15.3 | ^3.4.2 | ⚠️ Major behind |
| husky | ^4.2.5 | ^9.1.7 | ⚠️ Major behind |
| lint-staged | ^8.1.5 | ^15.2.11 | ⚠️ Major behind |
| chalk | ^2.4.2 | ^5.3.0 | ⚠️ Major behind |
| chokidar | ^3.4.2 | ^4.0.3 | ⚠️ Major behind |
| jsdom | ^16.4.0 | ^25.0.1 | ⚠️ Major behind |
| lerna | ^3.11.0 | ^8.1.8 | ⚠️ Major behind |
| @zeit/next-css | ^1.0.2-canary.2 | ⚠️ **DEPRECATED** | Remove (built into Next.js) |

#### 3. Up-to-Date Root Dependencies
- ✅ `jest`: `^29.7.0` (latest)
- ✅ `babel-jest`: `^29.7.0` (latest)
- ✅ `@testing-library/react`: `^16.3.0` (latest)
- ✅ `@testing-library/user-event`: `^14.5.2` (latest)
- ✅ `react`: `^18.2.0` (latest)
- ✅ `react-dom`: `^18.2.0` (latest)
- ✅ `next`: `^15.4.6` (latest)

---

## 📋 Package-by-Package Analysis

### categorize
- ✅ **Status:** Minimal dependencies, all up-to-date
- Dependencies: `debug`, `lodash`

### charting
- ⚠️ **react-draggable:** `^3.1.1` → should be `^3.3.0`
- ⚠️ **d3-scale:** `^2.1.2` → latest `4.0.2` (major update)
- ⚠️ **d3-selection:** `^1.3.2` → latest `3.0.0` (major update)
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mapbox/point-geometry:** `^0.1.0` → `1.1.0` (major update)

### config-ui
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **assert:** `^1.4.1` → latest `2.1.0` (major update)
- ⚠️ **mathjs:** `^7.0.1` → check latest version
- ⚠️ **react-measure:** `^2.2.2` → check latest version

### controller-utils
- ✅ **Status:** Minimal dependencies, all up-to-date

### correct-answer-toggle
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **react-transition-group:** `^4.4.5` → check latest version

### demo
- ⚠️ **@dnd-kit/core:** `^6.3.1` → latest `6.3.1` (check if update available)
- ⚠️ **react-draggable:** `^3.1.1` → `^3.3.0`
- ⚠️ **d3-scale:** `^2.1.2` → latest `4.0.2` (major update)
- ⚠️ **d3-selection:** `^1.3.2` → latest `3.0.0` (major update)
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mapbox/point-geometry:** `^0.1.0` → `1.1.0` (major update)
- ⚠️ **slate packages:** All on `^0.36.2` - check if v1.x available
- ⚠️ **change-case:** `^3.0.2` → latest `5.4.4` (major update)
- ⚠️ **i18next:** `^22.5.0` → latest `25.7.4` (major update)

### drag
- ⚠️ **@dnd-kit/core:** `6.1.0` → `6.3.1`
- ⚠️ **@dnd-kit/sortable:** `8.0.0` → `10.0.0` (major update)
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`

### editable-html
- ⚠️ **@dnd-kit/core:** `6.1.0` → `6.3.1`
- ⚠️ **@dnd-kit/modifiers:** `9.0.0` → check latest
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **slate packages:** All on `^0.36.2` - check if v1.x available
- ⚠️ **change-case:** `^3.0.2` → latest `5.4.4` (major update)
- ⚠️ **react-jss:** `^8.6.1` → check latest version
- ⚠️ **react-portal:** `^4.2.0` → check latest version

### feedback
- ✅ **Status:** No dependencies

### graphing
- ⚠️ **@dnd-kit/sortable:** `8.0.0` → `10.0.0` (major update)
- ⚠️ **react-draggable:** `^3.3.0` ✅ (already updated)
- ⚠️ **d3-scale:** `^2.1.2` → latest `4.0.2` (major update)
- ⚠️ **d3-selection:** `^1.3.2` → latest `3.0.0` (major update)
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mapbox/point-geometry:** `^0.1.0` → `1.1.0` (major update)
- ⚠️ **redux:** `^4.0.1` → check latest version
- ⚠️ **redux-undo:** `beta` → check if stable version available

### graphing-solution-set
- ⚠️ **Same issues as graphing** (identical dependencies)

### graphing-utils
- ⚠️ **@mapbox/point-geometry:** `^0.1.0` → `1.1.0` (major update)

### icons
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`

### mask-markup
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **slate packages:** All on `^0.36.2` - check if v1.x available

### math-evaluator
- ✅ **Status:** Dependencies look up-to-date

### math-input
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`

### math-rendering
- ✅ **Status:** Dependencies look up-to-date
- ⚠️ **mathjax-full:** `3.2.2` → check latest version

### math-rendering-accessible
- ✅ **Status:** Dependencies look up-to-date

### math-toolbar
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`

### plot
- ⚠️ **react-draggable:** `^3.1.1` → `^3.3.0`
- ⚠️ **d3-scale:** `^2.1.2` → latest `4.0.2` (major update)
- ⚠️ **d3-selection:** `^1.3.2` → latest `3.0.0` (major update)
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mapbox/point-geometry:** `^0.1.0` → `1.1.0` (major update)
- ⚠️ **assert:** `^1.4.1` → latest `2.1.0` (major update)
- ⚠️ **redux:** `^4.0.1` → check latest version

### render-ui
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **react-transition-group:** `^4.4.5` → check latest version

### rubric
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@hello-pangea/dnd:** `^18.0.1` → check latest version

### scoring-config
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`

### style-utils
- ✅ **Status:** No dependencies

### test-utils
- ✅ **Status:** Dependencies look up-to-date

### text-select
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **natural:** `^0.6.3` → check latest version

### tools
- ⚠️ **@mui/material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mui/icons-material:** `^7.3.4` → `^7.3.7`
- ⚠️ **@mapbox/point-geometry:** `^0.1.0` → `1.1.0` (major update)
- ⚠️ **assert:** `^1.4.1` → latest `2.1.0` (major update)
- ⚠️ **react-portal:** `^4.2.0` → check latest version

### translator
- ⚠️ **i18next:** `^22.5.0` → latest `25.7.4` (major update)

---

## 🎯 Recommended Action Plan

### Phase 1: Quick Wins (Low Risk)
1. ✅ Update all MUI packages: `7.3.4` → `7.3.7`
2. ✅ Standardize `react-draggable`: Update charting, plot, demo to `^3.3.0`
3. ✅ Remove deprecated packages from root:
   - `@material-ui/codemod`
   - `@babel/polyfill`
   - `@zeit/next-css`

### Phase 2: Medium Risk Updates
1. ⚠️ Update `@dnd-kit/core`: `6.1.0` → `6.3.1`
2. ⚠️ Evaluate `@dnd-kit/sortable`: `8.0.0` → `10.0.0` (test thoroughly)
3. ⚠️ Update `@mapbox/point-geometry`: `0.1.0` → `1.1.0` (test thoroughly)

### Phase 3: Major Updates (Requires Testing)
1. ⚠️ **d3-scale & d3-selection:** Check @visx compatibility before upgrading
2. ⚠️ **Root dev dependencies:** Plan major updates (Babel, ESLint, Webpack, etc.)
3. ⚠️ **Slate packages:** Evaluate v1.x migration if available
4. ⚠️ **i18next:** `22.5.0` → `25.7.4` (major update)

### Phase 4: Root Package.json Modernization
1. ⚠️ Update Babel to latest v7.x
2. ⚠️ Migrate ESLint to v9.x (breaking changes)
3. ⚠️ Migrate Webpack to v5.x (breaking changes)
4. ⚠️ Update Prettier to v3.x
5. ⚠️ Update Husky to v9.x
6. ⚠️ Update Lerna to v8.x

---

## 📝 Notes

- **@pie-lib dependencies:** All using exact versions (no caret) - ✅ Correct for monorepo
- **React 18:** All packages using `^18.2.0` - ✅ Up-to-date
- **Emotion:** All packages using `^11.14.0` - ✅ Up-to-date
- **@visx packages:** All using `^3.0.0` - ✅ Up-to-date

---

## 🔍 Version Consistency Matrix

| Dependency | charting | plot | graphing | demo | Status |
|------------|---------|------|----------|------|--------|
| react-draggable | ^3.1.1 | ^3.1.1 | ^3.3.0 | ^3.1.1 | ⚠️ Inconsistent |
| d3-scale | ^2.1.2 | ^2.1.2 | ^2.1.2 | ^2.1.2 | ✅ Consistent |
| d3-selection | ^1.3.2 | ^1.3.2 | ^1.3.2 | ^1.3.2 | ✅ Consistent |
| @mui/material | ^7.3.4 | ^7.3.4 | ^7.3.4 | ^7.3.4 | ✅ Consistent |
| @mapbox/point-geometry | ^0.1.0 | ^0.1.0 | ^0.1.0 | ^0.1.0 | ✅ Consistent |

---

**End of Analysis**
