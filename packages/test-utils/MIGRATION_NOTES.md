# @pie-lib/test-utils Migration Notes

## Summary

This package has been migrated from Enzyme to React Testing Library (RTL) to support React 18.

## Changes Made

### 1. package.json
- ✅ Removed `enzyme` peer dependency
- ✅ Added `@mui/material`, `@testing-library/react`, `react-dom` as peer dependencies
- ✅ Added dependencies: `@emotion/react`, `@emotion/styled`, `@testing-library/jest-dom`, `@testing-library/user-event`
- ✅ Updated description

### 2. src/index.js
- ❌ Removed `shallowChild()` Enzyme-specific utility
- ✅ Added `renderWithTheme()` - Render with MUI ThemeProvider
- ✅ Added `renderWithProviders()` - Render with multiple providers
- ✅ Added `createTestTheme()` - Create custom MUI themes
- ✅ Re-exported all RTL utilities (`render`, `screen`, `waitFor`, etc.)
- ✅ Re-exported `userEvent` for user interactions
- ✅ Re-exported `jest-dom` matchers for TypeScript support

### 3. src/__tests__/index.test.js
- Completely rewritten to test new RTL utilities
- Tests for `renderWithTheme()`, `renderWithProviders()`, `createTestTheme()`
- Tests use MUI Button component as example

### 4. README.md
- Created comprehensive documentation with examples
- Migration guide from Enzyme
- API reference
- Common patterns and best practices

## Breaking Changes

### Removed Functions
- `shallowChild(Component, defaultProps, nestLevel)` - No longer available

**Migration:** Use `renderWithTheme()` instead and test behavior/output rather than implementation details.

**Before (Enzyme):**
```javascript
import { shallowChild } from '@pie-lib/test-utils';

const render = shallowChild(MyHoC(Component), {}, 1);
const wrapper = render();
expect(wrapper.find(Component).length).toEqual(1);
```

**After (RTL):**
```javascript
import { renderWithTheme, screen } from '@pie-lib/test-utils';

renderWithTheme(<MyHoC(Component) />);
// Test the actual output users see
expect(screen.getByText('Expected content')).toBeInTheDocument();
```

## New Functions

### `renderWithTheme(ui, options)`
Renders component with MUI ThemeProvider.

```javascript
import { renderWithTheme } from '@pie-lib/test-utils';

renderWithTheme(<MyComponent />);
```

### `renderWithProviders(ui, options)`
Renders with multiple providers.

```javascript
import { renderWithProviders } from '@pie-lib/test-utils';

renderWithProviders(<MyComponent />, {
  providers: [ReduxProvider]
});
```

### `createTestTheme(themeOptions)`
Creates custom MUI theme for testing.

```javascript
import { createTestTheme } from '@pie-lib/test-utils';

const darkTheme = createTestTheme({ palette: { mode: 'dark' } });
```

## Usage in Other Packages

### Update imports in consuming packages:

**Before:**
```javascript
import { shallowChild } from '@pie-lib/test-utils';
```

**After:**
```javascript
import { renderWithTheme, screen, userEvent } from '@pie-lib/test-utils';
```

### Example Test Migration

**Before (Enzyme):**
```javascript
import { shallow } from 'enzyme';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<Button onClick={onClick}>Click</Button>);
    wrapper.find('button').simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
```

**After (RTL):**
```javascript
import { renderWithTheme, screen, userEvent } from '@pie-lib/test-utils';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    renderWithTheme(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Testing Philosophy Change

### Enzyme Approach (Implementation-focused)
- Test component internals (state, props, methods)
- Shallow rendering to isolate components
- Find elements by component type or class

### RTL Approach (User-focused)
- Test what users see and do
- Full rendering (closer to real usage)
- Find elements by role, text, label (accessibility-focused)
- Encourage testing behavior over implementation

## Validation

To verify the package is working:

1. Run tests in a package that uses test-utils
2. Check that imports resolve correctly
3. Verify MUI theme provider works
4. Test user interactions with `userEvent`

## Dependencies

The package now depends on:
- `@mui/material` (peer) - For ThemeProvider
- `@testing-library/react` (peer) - Core testing utilities
- `react` and `react-dom` (peer) - React 18
- `@emotion/react` and `@emotion/styled` - MUI styling
- `@testing-library/jest-dom` - Custom matchers
- `@testing-library/user-event` - User interaction simulation

## Next Steps

1. Update packages that depend on `@pie-lib/test-utils`
2. Remove Enzyme imports from all tests
3. Migrate tests to use RTL patterns
4. Update to use `renderWithTheme` for MUI components

## Resources

- See `/MIGRATION_REACT_16_TO_18.md` for React 18 migration guide
- See `/ENZYME_TO_RTL_CHANGES.md` for Enzyme removal details
- See `packages/test-utils/README.md` for API documentation
