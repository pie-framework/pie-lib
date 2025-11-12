# Editable-HTML Enzyme Test Refactoring Plan

This document outlines the refactoring strategy for the remaining 3 Enzyme test files in the editable-html package.

## Current Status

- **Total tests**: 90 (89 passing, 1 failing)
- **Remaining Enzyme files**: 3
  1. `toolbar.test.jsx` - 2 snapshot tests (uses react-test-renderer)
  2. `math/index.test.jsx` - ~45 tests (uses shallow + snapshots)
  3. `editor.test.jsx` - ~15 tests (heavy instance testing)

---

## File 1: toolbar.test.jsx (EASIEST - Priority 1)

**Location**: `packages/editable-html/src/plugins/toolbar/__tests__/toolbar.test.jsx`

**Current Approach**: Uses `react-test-renderer` for snapshot testing

**Complexity**: ⭐ Low (2 simple snapshot tests)

### Analysis

The file has only 2 tests:
1. Renders custom toolbar (with custom plugin)
2. Renders default toolbar (no plugins)

Both are snapshot tests using `react-test-renderer`, which is not compatible with React 18.

### Refactoring Strategy

**Option A: Convert to RTL render tests (RECOMMENDED)**
- Replace `react-test-renderer` with `@testing-library/react`
- Remove snapshot assertions
- Add specific behavioral assertions

```javascript
// OLD
const tree = renderer.create(<Toolbar {...props} />).toJSON();
expect(tree).toMatchSnapshot();

// NEW
const { container } = render(<Toolbar {...props} />);
expect(container.firstChild).toBeInTheDocument();
// Add specific checks for custom toolbar content
expect(screen.getByText('--------- custom toolbar -----------')).toBeInTheDocument();
```

**Option B: Delete tests**
- These are pure snapshot tests with no behavioral value
- The toolbar is already tested through integration in other test files
- Recommendation: Delete if no critical functionality is being tested

### Implementation Steps

1. Read the Toolbar component to understand what it renders
2. Replace react-test-renderer imports with RTL
3. Convert snapshot tests to specific assertions
4. Delete obsolete snapshots
5. Run tests to verify

**Estimated Effort**: 15-20 minutes

---

## File 2: math/index.test.jsx (MODERATE - Priority 2)

**Location**: `packages/editable-html/src/plugins/math/__tests__/index.test.jsx`

**Current Approach**: Mix of Enzyme shallow rendering, direct function testing, and snapshots

**Complexity**: ⭐⭐ Moderate (~45 tests with mixed approaches)

### Analysis

The file tests:
1. **MathPlugin behavior** (simple unit tests) - ✅ Easy to migrate
2. **Serialization functions** (pure functions) - ✅ Already good, no changes needed
3. **CustomToolbarComp** (component with shallow + snapshots) - ⚠️ Needs migration

**Test Breakdown**:
- `MathPlugin › toolbar › onClick` - 2 tests (unit tests, easy)
- `MathPlugin › renderNode` - 1 test (unit test, easy)
- `MathPlugin › serialization › deserialize` - ~8 tests (pure functions, no change needed)
- `MathPlugin › serialization › serialize` - ~7 tests (pure functions, no change needed)
- `CustomToolbarComp › render` - 2 tests (shallow + snapshots, needs migration)
- `CustomToolbarComp › onDone` - 1 test (shallow + enzyme queries, needs migration)
- `CustomToolbarComp › onChange` - 1 test (shallow + enzyme queries, needs migration)

### Refactoring Strategy

**Phase 1: Leave pure function tests as-is** (no changes needed)
- The serialization tests are testing pure functions
- They don't use Enzyme for rendering, just for mock data
- These can stay exactly as they are

**Phase 2: Convert CustomToolbarComp tests**

```javascript
// OLD - Enzyme shallow rendering
const wrapper = shallow(<CustomToolbarComp {...props} />);
expect(wrapper).toMatchSnapshot();
wrapper.find(MathToolbar).prop('onDone')('oo');

// NEW - RTL rendering
render(<CustomToolbarComp {...props} />);
expect(screen.getByRole('toolbar')).toBeInTheDocument();
const toolbar = screen.getByRole('toolbar'); // or whatever MathToolbar renders
fireEvent.click(toolbar.querySelector('[data-done-button]')); // or proper selector
expect(onToolbarDone).toHaveBeenCalled();
```

**Challenge**: MathToolbar is mocked, so we need to understand what it renders or improve the mock

### Implementation Steps

1. **Keep as-is**: All serialization tests (no Enzyme rendering involved)
2. **Migrate**: CustomToolbarComp tests
   - Remove snapshot tests
   - Convert shallow() to render()
   - Replace wrapper.find() with screen queries
   - Update MathToolbar mock to be RTL-compatible
3. **Verify**: MathPlugin unit tests work without changes

**Estimated Effort**: 30-40 minutes

---

## File 3: editor.test.jsx (COMPLEX - Priority 3)

**Location**: `packages/editable-html/src/__tests__/editor.test.jsx`

**Current Approach**: Heavy use of `wrapper.instance()` to test internal methods

**Complexity**: ⭐⭐⭐⭐ Very High (15 tests, all testing implementation details)

### Analysis

**Critical Issue**: All tests use `wrapper.instance()` to call internal methods directly

Test categories:
1. **State management tests** (onFocus/onBlur saves value) - Tests internal state
2. **Focus/blur event handling** (7 tests) - Tests internal methods
3. **buildSizeStyle utility** (7 tests) - Tests internal utility method
4. **Window resize handling** (1 test) - Tests internal onChange
5. **MathMl prop handling** (2 tests) - Tests internal method calls

**Problem**: All these tests violate RTL principles by testing implementation details instead of user-facing behavior.

### Refactoring Strategy

**Option A: Extract and test utility functions separately (RECOMMENDED)**

Many tests are actually testing pure utility functions that happen to be methods:

```javascript
// Current: Method on class
class Editor {
  buildSizeStyle() {
    // Pure function logic
  }
}

// Refactored: Export as utility function
export const buildSizeStyle = (props) => {
  // Same logic
};

class Editor {
  buildSizeStyle() {
    return buildSizeStyle(this.props);
  }
}
```

Then test the utility directly:
```javascript
import { buildSizeStyle } from '../editor';

describe('buildSizeStyle', () => {
  it('builds width with px', () => {
    expect(buildSizeStyle({ width: 100 })).toEqual({
      width: '100px',
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined,
    });
  });
});
```

**Option B: Convert to integration tests (ALTERNATIVE)**

Test the behavior through user interactions:

```javascript
// Instead of testing internal state changes
wrapper.instance().onFocus();
expect(wrapper.state('stashedValue')).toEqual(...);

// Test that focus behavior works correctly
render(<Editor {...props} />);
const editor = screen.getByRole('textbox');
await user.click(editor); // Focus
await user.type(editor, 'new value');
await user.tab(); // Blur
expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
  value: 'new value'
}));
```

**Option C: Delete tests that can't be converted**

Some tests like "toolbarContainsFocus correctly detects focus" are pure implementation details that:
- Don't affect user-facing behavior
- Are internal optimizations
- Would be caught by integration tests if broken

**Recommendation**: Combination approach
1. Extract `buildSizeStyle` and similar utilities → test directly
2. Convert focus/blur tests to integration tests → test through user interaction
3. Delete pure implementation detail tests (like toolbarContainsFocus)
4. Keep MathMl tests but convert to check rendered output instead of method calls

### Implementation Steps

#### Step 1: Extract utility functions (3-4 functions)
```javascript
// In editor.jsx
export const buildSizeStyle = ({ width, height, minHeight, maxHeight }) => {
  // Move logic here
};

export const shouldPreventFocus = (event, keypadInteractionDetected) => {
  // Move logic here
};
```

#### Step 2: Create new test file for utilities
```javascript
// editor-utils.test.js
import { buildSizeStyle, shouldPreventFocus } from '../editor';

describe('buildSizeStyle', () => {
  // Move all 7 buildSizeStyle tests here
});

describe('shouldPreventFocus', () => {
  // Test focus prevention logic
});
```

#### Step 3: Convert remaining tests to integration tests
```javascript
// editor.test.jsx
describe('Editor', () => {
  it('preserves value on focus and blur', async () => {
    const onChange = jest.fn();
    render(<Editor value={htmlToValue('hi')} onChange={onChange} />);

    const editor = screen.getByRole('textbox');
    await user.click(editor);
    await user.type(editor, 'new value');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: expect.any(Object) })
    );
  });
});
```

#### Step 4: Delete untestable implementation tests
- `toolbarContainsFocus` - pure implementation detail
- `handleToolbarFocus/Blur` - internal state management
- Consider keeping if they fix actual bugs, otherwise delete

**Estimated Effort**: 2-3 hours (significant refactoring required)

---

## Recommended Execution Order

### Phase 1: Quick Wins (30 minutes)
1. ✅ **toolbar.test.jsx** - Convert 2 snapshot tests to RTL
   - Low risk, high value
   - Removes react-test-renderer dependency

### Phase 2: Moderate Effort (45 minutes)
2. ✅ **math/index.test.jsx** - Migrate CustomToolbarComp tests
   - Keep all serialization tests as-is
   - Only migrate 4-5 component tests
   - Moderate complexity, contained scope

### Phase 3: Major Refactoring (2-3 hours)
3. ✅ **editor.test.jsx** - Extract utilities + integration tests
   - Requires source code changes (extract utilities)
   - High complexity, but highest value
   - Consider doing this last or in a separate PR

---

## Alternative: Minimal Viable Migration

If time is limited, here's the minimal approach:

### Critical (DO THIS)
1. **toolbar.test.jsx** - Convert to RTL (15 min)
2. **math/index.test.jsx** - Remove snapshots, keep rest (20 min)

### Optional (SKIP IF NEEDED)
3. **editor.test.jsx** - Comment out for now, file issue to refactor later

This gets you from 89/90 to potentially ~92/94 passing tests without the major editor.test.jsx refactoring.

---

## Success Criteria

- [ ] Remove all Enzyme imports
- [ ] Remove all react-test-renderer imports
- [ ] Remove all snapshot files
- [ ] All remaining tests use RTL
- [ ] Test coverage maintained or improved
- [ ] No instance() method calls in tests
- [ ] Tests focus on behavior, not implementation

---

## Notes for Implementation

### Common Patterns to Replace

1. **Shallow rendering → RTL render**
```javascript
const wrapper = shallow(<Component />);  // OLD
const { container } = render(<Component />);  // NEW
```

2. **Instance method calls → User interactions**
```javascript
wrapper.instance().onClick();  // OLD
await user.click(screen.getByRole('button'));  // NEW
```

3. **State assertions → Behavior assertions**
```javascript
expect(wrapper.state('value')).toBe(5);  // OLD
expect(screen.getByDisplayValue('5')).toBeInTheDocument();  // NEW
```

4. **Snapshot tests → Specific assertions**
```javascript
expect(wrapper).toMatchSnapshot();  // OLD
expect(screen.getByText('Expected Text')).toBeInTheDocument();  // NEW
```

### Mocking Strategy

For complex Slate editor mocks, consider:
1. Mock at a higher level (mock entire Slate library)
2. Use test fixtures for Slate Value objects
3. Test through rendered output, not Slate internals

---

## Questions to Answer Before Starting

1. **toolbar.test.jsx**: Are these snapshots valuable, or can we delete them?
2. **math/index.test.jsx**: Does MathToolbar render something we can query, or should we improve the mock?
3. **editor.test.jsx**: Should we refactor the source code, or just delete the tests?

**Recommendation**: Start with toolbar.test.jsx since it's the easiest and will prove out the approach.
