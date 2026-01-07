# Enzyme Removal and React Testing Library Setup

## Summary of Changes

This document describes the changes made to remove Enzyme and set up React Testing Library (RTL) for React 18 compatibility.

## Files Modified

### 1. `jest.setup.js`
**Changes:**
- ✅ Added `@testing-library/jest-dom` import
- ✅ Added `window.matchMedia` mock (required for MUI components)
- ✅ Added `ResizeObserver` mock
- ✅ Added `IntersectionObserver` mock
- ✅ Added `scrollIntoView` mock
- ✅ Removed all Enzyme configuration

### 2. `jest.config.js`
**Changes:**
- ✅ Updated `transformIgnorePatterns` to include `@mui`, `@emotion`, `@testing-library`, `@dnd-kit`, `@tiptap`
- ✅ Added `moduleNameMapper` for CSS files (using `identity-obj-proxy`)
- ✅ Added `moduleNameMapper` for image files (using custom mock)
- ✅ Replaced old `react-dnd` mappings with `@dnd-kit` mappings
- ✅ Added `collectCoverageFrom` configuration
- ✅ Kept custom resolver for `node:` protocol imports

### 3. `package.json`
**Removed packages:**
- ❌ `enzyme` (^3.10.0)
- ❌ `enzyme-adapter-react-16` (^1.14.0)
- ❌ `enzyme-to-json` (^3.3.5)
- ❌ `@types/enzyme` (^3.9.3)

**Added packages:**
- ✅ `@testing-library/user-event` (^14.5.2)
- ✅ `identity-obj-proxy` (^3.0.0)

**Already present (confirmed):**
- ✅ `@testing-library/react` (^16.3.0)
- ✅ `@testing-library/jest-dom` (^5.16.5)
- ✅ `@testing-library/dom` (^10.4.1)
- ✅ `@testing-library/react-hooks` (^8.0.1)

### 4. `__mocks__/fileMock.js` (NEW)
**Created:**
- Simple mock for static file imports (images, fonts, etc.)

## Known Warnings

After running `yarn install`, the following warnings are expected:

### 1. `@pie-lib/test-utils` still depends on Enzyme
```
warning " > @pie-lib/test-utils@0.8.0" has unmet peer dependency "enzyme@^3.8.0"
```
**Action needed:** Update `@pie-lib/test-utils` package to remove Enzyme dependency

### 2. React version mismatches
Several packages have peer dependency warnings for React 16 when React 18 is installed.
**Action needed:** These will be resolved as we update the individual packages

### 3. MUI peer dependencies
Some packages need `@mui/material` as a peer dependency.
**Action needed:** These warnings are normal during the migration

## Next Steps

### Immediate Priority
1. **Update `@pie-lib/test-utils`** - Remove Enzyme, add RTL utilities
2. **Run test suite** - See which tests fail
3. **Create test helper utilities** - For rendering with providers

### Test Migration Pattern

Use this pattern for migrating tests:

#### Before (Enzyme):
```javascript
import { shallow, mount } from 'enzyme';

describe('Component', () => {
  it('renders button', () => {
    const wrapper = shallow(<Component />);
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('handles click', () => {
    const onClick = jest.fn();
    const wrapper = mount(<Component onClick={onClick} />);
    wrapper.find('button').simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
```

#### After (React Testing Library):
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component', () => {
  it('renders button', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<Component onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Create Test Utilities

Create a file like `packages/test-utils/src/rtl-helpers.js`:

```javascript
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();

export function renderWithTheme(ui, { theme = defaultTheme, ...options } = {}) {
  function Wrapper({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

### Package Update Order

Recommended order for updating packages (start with leaf dependencies):

1. ✅ `@pie-lib/test-utils` - First! Other packages depend on this
2. `@pie-lib/icons` - Simple components, few dependencies
3. `@pie-lib/render-ui` - Core UI utilities
4. `@pie-lib/math-rendering` - Isolated functionality
5. `@pie-lib/drag` - Already migrated to @dnd-kit
6. `@pie-lib/config-ui` - Depends on render-ui
7. `@pie-lib/charting` - Complex, many dependencies
8. Continue with other packages...

## Testing the Setup

To verify the setup works:

```bash
# Run tests for a simple package
yarn test packages/icons/src/__tests__

# Or run all tests (will likely have failures to fix)
yarn test
```

## Configuration Verification

### Verify Jest can load:
```bash
node -e "console.log(require('./jest.config.js'))"
```

### Verify setup file works:
```bash
node -r ./jest.setup.js -e "console.log('Setup OK')"
```

## Common Migration Issues

### Issue: "Cannot find module '@testing-library/react'"
**Solution:** Run `yarn install` at root and in affected package

### Issue: "Not wrapped in act(...)" warnings
**Solution:** Use async utilities like `findBy*` queries or `waitFor`

### Issue: Tests timeout
**Solution:** Ensure async operations use proper awaits and findBy queries

### Issue: "Cannot find module 'identity-obj-proxy'"
**Solution:** Run `yarn install` to install the new dependency

## Documentation

See these files for detailed migration guides:
- `MIGRATION_REACT_16_TO_18.md` - Complete React 18 migration guide
- `MIGRATION_MATERIAL_UI_TO_MUI.md` - MUI v7 migration guide

## Status

- ✅ Enzyme removed from root package.json
- ✅ RTL dependencies added
- ✅ Jest configuration updated for React 18
- ✅ Test setup file configured with necessary mocks
- ⏳ Individual package test files need migration
- ⏳ @pie-lib/test-utils needs update
