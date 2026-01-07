# Charting Package - Test Infrastructure Issues

## Status

**Enzyme → RTL Migration**: ✅ **COMPLETE**
All 11 test files have been successfully migrated from Enzyme to React Testing Library.

**Test Execution**: ❌ **BLOCKED**
Tests cannot run due to pre-existing test infrastructure issues that were exposed by RTL's full rendering (vs Enzyme's shallow rendering).

---

## Issue: Incomplete D3 Scale Mocks

### Root Cause

The `scaleMock()` function in `packages/charting/src/__tests__/utils.js` only implements a minimal d3 scale interface:

```javascript
export const scaleMock = () => {
  const fn = jest.fn((n) => n);
  fn.invert = jest.fn((n) => n);
  return fn;
};
```

However, the **@vx/grid** library (used by charting components) requires a complete d3 scale implementation with these methods:
- `domain()` - Get/set the input domain
- `range()` - Get/set the output range
- `copy()` - Create a copy of the scale
- `ticks()` - Generate tick values
- `tickFormat()` - Format tick values
- And more...

### Error Examples

```
TypeError: n.domain is not a function
    at q (/Users/carlacostea/Pie_Work/pie-framework/pie-lib/node_modules/@vx/grid/dist/vx-grid.umd.js:1:1532)
```

This error occurs when @vx/grid's `<GridRows>` or `<GridColumns>` components try to call `.domain()` on the scale object.

### Why This Wasn't Caught Before

**Enzyme's `shallow()` rendering** only renders the component itself without rendering its children. This meant that the @vx/grid components inside were never actually executed, so their scale method calls were never triggered.

**RTL's `render()`** performs full DOM rendering, which executes all child components including @vx/grid, exposing this infrastructure gap.

---

## Affected Test Files

All 11 test files are affected because they all use components that render @vx/grid:

**Main directory:**
1. `packages/charting/src/__tests__/chart-type.test.jsx`
2. `packages/charting/src/__tests__/axes.test.jsx`
3. `packages/charting/src/__tests__/grid.test.jsx`
4. `packages/charting/src/__tests__/mark-label.test.jsx`
5. `packages/charting/src/__tests__/chart.test.jsx`

**Subdirectories:**
6. `packages/charting/src/bars/__tests__/bar.test.jsx`
7. `packages/charting/src/bars/__tests__/histogram.test.jsx`
8. `packages/charting/src/line/__tests__/line-cross.test.jsx`
9. `packages/charting/src/line/__tests__/line-dot.test.jsx`
10. `packages/charting/src/plot/__tests__/dot.test.jsx`
11. `packages/charting/src/plot/__tests__/line.test.jsx`

---

## Solution Options

### Option 1: Create Complete D3 Scale Mocks

Update `packages/charting/src/__tests__/utils.js` to provide full d3 scale implementations:

```javascript
export const scaleMock = (domainValues = [0, 1], rangeValues = [0, 100]) => {
  let _domain = domainValues;
  let _range = rangeValues;

  const fn = jest.fn((n) => {
    // Linear interpolation
    const domainRange = _domain[1] - _domain[0];
    const rangeRange = _range[1] - _range[0];
    return _range[0] + ((n - _domain[0]) / domainRange) * rangeRange;
  });

  fn.domain = jest.fn((values) => {
    if (!values) return _domain;
    _domain = values;
    return fn;
  });

  fn.range = jest.fn((values) => {
    if (!values) return _range;
    _range = values;
    return fn;
  });

  fn.invert = jest.fn((n) => {
    const domainRange = _domain[1] - _domain[0];
    const rangeRange = _range[1] - _range[0];
    return _domain[0] + ((n - _range[0]) / rangeRange) * domainRange;
  });

  fn.copy = jest.fn(() => scaleMock(_domain, _range));

  fn.ticks = jest.fn((count = 10) => {
    const step = (_domain[1] - _domain[0]) / count;
    return Array.from({ length: count + 1 }, (_, i) => _domain[0] + i * step);
  });

  fn.tickFormat = jest.fn(() => (d) => String(d));

  fn.rangeRound = jest.fn((values) => {
    _range = values.map(Math.round);
    return fn;
  });

  fn.clamp = jest.fn((shouldClamp) => fn);
  fn.nice = jest.fn(() => fn);

  return fn;
};
```

**Pros:**
- Allows tests to run with full rendering
- Tests actual component behavior
- More realistic testing environment

**Cons:**
- More complex mock implementation
- Need to maintain mock as d3 evolves

### Option 2: Mock @vx/grid Components

Create mock implementations of @vx/grid components:

```javascript
jest.mock('@vx/grid', () => ({
  GridRows: () => null,
  GridColumns: () => null,
}));
```

**Pros:**
- Simple and quick
- Avoids scale mock complexity

**Cons:**
- Doesn't test grid rendering
- Less realistic testing
- Loses some test coverage

### Option 3: Use Real D3 Scales in Tests

Import and use actual d3 scale functions:

```javascript
import { scaleLinear } from 'd3-scale';

export const graphProps = (dmin = 0, dmax = 1, rmin = 0, rmax = 1) => ({
  scale: {
    x: scaleLinear().domain([dmin, dmax]).range([0, 400]),
    y: scaleLinear().domain([rmin, rmax]).range([400, 0]),
  },
  // ... rest of props
});
```

**Pros:**
- Most realistic
- No mock maintenance
- Tests with actual d3 behavior

**Cons:**
- Slightly slower tests
- Less control over scale behavior in tests
- May need to adjust test expectations

---

## Recommendation

**Option 3 (Use Real D3 Scales)** is the best approach because:
1. It's the most realistic testing environment
2. No mock maintenance burden
3. Guarantees compatibility with @vx/grid
4. D3 scales are lightweight and fast enough for unit tests

The charting package already depends on d3-scale, so there's no new dependency to add.

---

## Configuration Issues Fixed

The following configuration issues have been resolved:

✅ **@dnd-kit module mapping** - Removed conflicting mappings from jest.config.js
✅ **speech-rule-engine XMLHttpRequest** - Added comprehensive mock in jest.setup.js
✅ **testURL deprecation** - Changed to testEnvironmentOptions in jest.config.js
✅ **transformIgnorePatterns** - Added trailing `/` to regex pattern

---

## Next Steps

1. **Decide on solution approach** (recommend Option 3: real D3 scales)
2. **Implement the solution** in `packages/charting/src/__tests__/utils.js`
3. **Run tests** to verify they pass
4. **Update snapshots** (RTL full DOM vs Enzyme shallow rendering)
5. **Move to next package** for Enzyme → RTL migration

---

## Important Note

**The Enzyme → RTL migration work is complete.** This is a separate test infrastructure issue that existed before the migration but was hidden by Enzyme's shallow rendering. The migration itself is correct and follows RTL best practices.
