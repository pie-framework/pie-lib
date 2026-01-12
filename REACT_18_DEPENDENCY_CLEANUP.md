# React 18 Dependency Cleanup Summary

After migrating all packages to React 18, the following dependencies have been identified for removal or update:

## ✅ Removed Dependencies

### 1. `@testing-library/react-hooks` (Root package.json)

- **Status**: ✅ REMOVED
- **Reason**: Deprecated in React 18. React Testing Library v13+ supports hooks testing directly via `renderHook` in `@testing-library/react`.
- **Location**: `/package.json` (devDependencies)

### 2. `react-jss`

- **Status**: ✅ REMOVED
- **Reason**: Not used in codebase. All packages have migrated to MUI (Material-UI) which uses Emotion for styling.
- **Locations**:
  - `/packages/editable-html/package.json`
  - `/packages/demo/package.json`

### 3. `@material-ui/codemod` (Root package.json)

- **Status**: ✅ REMOVED
- **Reason**: Deprecated migration tool. Material-UI → MUI migration is complete, so this codemod tool is no longer needed.
- **Location**: `/package.json` (dependencies)

## ⚠️ Dependencies Requiring Code Changes

### 4. `react-portal`

- **Status**: ⚠️ NEEDS CODE CHANGES BEFORE REMOVAL
- **Reason**: React 18 has built-in portal support via `ReactDOM.createPortal`. The `react-portal` package is redundant.
- **Current Usage**:
  - `/packages/tools/src/rotatable.jsx` - Uses `<Portal>` component from `react-portal`
  - `/packages/editable-html/package.json` - Listed as dependency (but may not be actively used)
  - `/packages/demo/package.json` - Listed as dependency (but may not be actively used)
- **Action Required**:
  1. Replace `<Portal>` usage in `rotatable.jsx` with `ReactDOM.createPortal`
  2. Check if `react-portal` is actually used in editable-html and demo packages
  3. Remove from package.json files after code migration

### Migration Example for react-portal:

```jsx
// Before (using react-portal)
import { Portal } from 'react-portal';
<Portal>
  <Component />
</Portal>;

// After (using React 18 built-in)
import ReactDOM from 'react-dom';
ReactDOM.createPortal(<Component />, document.body);
```

## 📋 Summary

- **Removed**: 4 dependencies:
  - `@testing-library/react-hooks` (root)
  - `react-jss` (editable-html, demo)
  - `@material-ui/codemod` (root)
- **Needs Migration**: 1 dependency (`react-portal` - requires code changes)

## ✅ Verification

All package.json files in `/packages/*` have been checked:

- ✅ All React versions are correctly set to `^18.2.0`
- ✅ All React-DOM versions are correctly set to `^18.2.0` (where applicable)
- ✅ No old Material-UI dependencies found (all migrated to MUI)
- ✅ No React 16/17 dependencies found

All React and React-DOM versions are correctly set to `^18.2.0` across all packages.
