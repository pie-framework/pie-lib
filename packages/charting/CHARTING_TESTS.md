# Charting Package - Test Fixes Plan

## Current Status
- **Tests Passing**: 53/66 (80%)
- **Tests Failing**: 13 (20%)
- **Migration Status**: Enzyme to RTL migration completed for all test files

## Root Causes of Remaining Failures

### 1. Missing Mock Functions
Some utility functions are not properly mocked, causing "X is not a function" errors:
- `getScale` function in utils
- Other utility functions that depend on DOM measurements

### 2. Component Prop Validation
Tests may be failing due to:
- Missing required props after migration
- Props that changed during MUI v5 upgrade
- Props that are no longer supported

### 3. Runtime Calculation Errors
Components that calculate positions or dimensions may fail because:
- JSDOM doesn't provide real layout measurements
- Mock scales/bands need proper return values
- SVG context is limited in test environment

### 4. Interaction Testing Gaps
After removing Enzyme's `instance()` calls, some tests need proper user interaction simulation:
- Drag operations on chart elements
- Click handlers on interactive elements
- Focus/blur events

## Fix Strategy

### Phase 1: Critical Mock Setup (Priority: High)
**Goal**: Ensure all utility functions are properly mocked

Files to update:
- Mock files in `__tests__/` directories
- Ensure `getScale`, `bounds`, and other utility functions return proper values

Example fix:
```javascript
jest.mock('../../utils', () => {
  const actual = jest.requireActual('../../utils');
  return {
    ...actual,
    getScale: jest.fn(() => ({ scale: 1 })),
    bounds: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 })),
  };
});
```

### Phase 2: Prop Validation Fixes (Priority: High)
**Goal**: Ensure all components receive correct props in tests

Actions:
1. Review component prop types
2. Update test default props to match current requirements
3. Check for MUI v5 prop changes
4. Verify graphProps structure matches expectations

### Phase 3: SVG/Layout Mock Improvements (Priority: Medium)
**Goal**: Provide better mocks for layout-dependent functionality

Actions:
1. Mock SVGElement methods (getBBox, getScreenCTM, etc.)
2. Provide realistic return values for getBoundingClientRect
3. Mock d3-scale functions properly
4. Ensure xBand and yBand functions return expected values

Example:
```javascript
SVGElement.prototype.getBBox = jest.fn(() => ({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
}));
```

### Phase 4: Interaction Testing (Priority: Low)
**Goal**: Add proper user interaction tests where needed

Actions:
1. Identify tests with comments about "requires interaction"
2. Use @testing-library/user-event for drag operations
3. Consider using `fireEvent` for complex interactions
4. Add integration tests if unit tests become too complex

## Specific Test Files to Review

### 1. drag-handle.test.jsx (2 locations)
- [packages/charting/src/common/__tests__/drag-handle.test.jsx](packages/charting/src/common/__tests__/drag-handle.test.jsx)
- [packages/charting/src/line/common/__tests__/drag-handle.test.jsx](packages/charting/src/line/common/__tests__/drag-handle.test.jsx)
- Already migrated with basic mocks
- May need additional gridDraggable HOC testing

### 2. line.test.jsx
- [packages/charting/src/line/common/__tests__/line.test.jsx](packages/charting/src/line/common/__tests__/line.test.jsx)
- Tests for Line and RawLine components
- May need better xBand mock and data structure

### 3. bars.test.jsx
- [packages/charting/src/bars/common/__tests__/bars.test.jsx](packages/charting/src/bars/common/__tests__/bars.test.jsx)
- Tests for Bars and RawBar components
- Similar issues to line.test.jsx

### 4. plot.test.jsx
- [packages/charting/src/plot/common/__tests__/plot.test.jsx](packages/charting/src/plot/common/__tests__/plot.test.jsx)
- Tests for Plot and RawPlot components
- CustomBarElement prop may need attention

## Testing Approach

### Run Tests
```bash
# Run all charting tests
npx jest packages/charting/ --no-coverage

# Run specific test file
npx jest packages/charting/src/common/__tests__/drag-handle.test.jsx --no-coverage

# Update snapshots if needed (though we removed most)
npx jest packages/charting/ --no-coverage -u
```

### Debug Strategy
1. Run tests individually to isolate failures
2. Check console output for specific error messages
3. Add console.logs in components if needed
4. Use `screen.debug()` to see rendered output
5. Check mock function calls with `expect(mockFn).toHaveBeenCalledWith(...)`

## Common Issues and Solutions

### Issue: "Cannot read property 'X' of undefined"
**Solution**: Check that graphProps is properly structured with all required properties

### Issue: "getBBox is not a function"
**Solution**: Add SVGElement.prototype.getBBox mock to jest.setup.js

### Issue: "Expected element to be in document"
**Solution**: Component may not be rendering due to missing props or failed prop validation

### Issue: Drag operations not working
**Solution**: May need to simulate events or mock the drag library properly

## Next Steps
1. Run all charting tests to get current failure list
2. Group failures by error type
3. Start with Phase 1 fixes (mocks)
4. Gradually work through Phases 2-4
5. Document any new patterns discovered
6. Update this file as fixes are applied

## Success Criteria
- All 66 tests passing
- No console errors or warnings
- Tests accurately reflect component behavior
- Test code is maintainable and follows RTL best practices
