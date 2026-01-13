# React 16 → 18 Migration: Complete Analysis & Remaining Tasks

**Generated:** $(date)  
**Status:** Migration ~85% Complete

---

## 📊 Executive Summary

### Migration Status Overview

| Category | Status | Completion |
|----------|--------|------------|
| **Core React Upgrade** | ✅ Complete | 100% |
| **ReactDOM API Migration** | ⚠️ Partial | 90% |
| **Enzyme → RTL Migration** | ⚠️ Partial | 85% |
| **Test Infrastructure** | ✅ Complete | 100% |
| **Deprecated API Removal** | ⚠️ Partial | 70% |
| **Next.js Integration** | ✅ Complete | 100% |

---

## 🔴 Critical Issues Found

### 1. ReactDOM.findDOMNode Usage (Deprecated)

**Status:** ⚠️ **CRITICAL** - Must be fixed before React 19

**Location:**
- `packages/mask-markup/src/with-mask.jsx:34`
- `packages/demo/pages/math-input.js:59` (commented out)

**Issue:**
```javascript
// packages/mask-markup/src/with-mask.jsx
const domNode = ReactDOM.findDOMNode(this);
```

**Why it's a problem:**
- `ReactDOM.findDOMNode` is deprecated and will be removed in React 19
- It breaks component encapsulation
- Not compatible with React 18 StrictMode

**Solution:**
Replace with refs:

```javascript
// Before
componentDidUpdate(prevProps) {
  const domNode = ReactDOM.findDOMNode(this);
  const mathElements = domNode && domNode.querySelectorAll('[data-latex]');
}

// After
class WithMask extends React.Component {
  containerRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.markup !== prevProps.markup && this.containerRef.current) {
      const mathElements = this.containerRef.current.querySelectorAll('[data-latex]');
      // ... rest of logic
    }
  }

  render() {
    return (
      <div ref={this.containerRef}>
        <Mask {...this.props} />
      </div>
    );
  }
}
```

**Risk Level:** 🔴 **HIGH** - Will break in React 19

---

### 2. ReactDOM.createPortal Usage (Needs Review)

**Status:** ⚠️ **REVIEW NEEDED**

**Locations:**
- `packages/graphing/src/tools/shared/point/base-point.jsx:116`
- `packages/graphing-solution-set/src/tools/shared/point/base-point.jsx` (similar)
- Multiple other graphing tool components

**Current Usage:**
```javascript
ReactDOM.createPortal(<CoordinatesLabel />, labelNode)
```

**Analysis:**
- `ReactDOM.createPortal` is **still valid** in React 18
- However, the import pattern `import ReactDOM from 'react-dom'` should be updated
- Portals themselves are fine, but consider using `createRoot` for dynamic portals

**Recommendation:**
- ✅ Keep using `createPortal` (it's still supported)
- ⚠️ Consider refactoring to use `createRoot` for dynamically created portals (like in editable-html)

**Risk Level:** 🟡 **LOW** - Current usage is valid, but could be modernized

---

### 3. Skipped Test Suites (Enzyme Migration Incomplete)

**Status:** ⚠️ **PARTIAL** - Tests exist but are skipped

**Affected Packages:**
1. **graphing** - 3 skipped test suites
2. **graphing-solution-set** - 5+ skipped test suites
3. **charting** - Some tests skipped due to infrastructure issues

**Skipped Test Files:**

| Package | File | Reason | Tests |
|---------|------|--------|-------|
| graphing | `graph-with-controls.test.jsx` | Complex prop setup | ~10 tests |
| graphing | `tool-menu.test.jsx` | Drag-and-drop context | ~5 tests |
| graphing | `toggle-bar.test.jsx` | Drag-and-drop context | ~5 tests |
| graphing | `tools/circle/component.test.jsx` | Logic tests need migration | ~3 tests |
| graphing | `tools/polygon/component.test.jsx` | Logic tests need migration | ~8 tests |
| graphing-solution-set | `graph.test.jsx` | Instance tests | ~10 tests |
| graphing-solution-set | `toggle-bar.test.jsx` | Instance tests | ~5 tests |
| graphing-solution-set | `axis/axes.test.jsx` | Enzyme-based tests | ~8 tests |
| graphing-solution-set | `tools/polygon/component.test.jsx` | Instance tests | ~10 tests |
| graphing-solution-set | `tools/shared/line/index.test.jsx` | Instance tests | ~15 tests |
| graphing-solution-set | `tools/shared/line/with-root-edge.test.jsx` | Prop tests | ~5 tests |

**What Needs to be Done:**

1. **Convert instance-based tests to behavioral tests:**
   ```javascript
   // OLD (Enzyme)
   const wrapper = mount(<Component />);
   wrapper.instance().method();
   expect(wrapper.state('value')).toBe(5);

   // NEW (RTL)
   render(<Component />);
   await userEvent.click(screen.getByRole('button'));
   expect(screen.getByText('Expected output')).toBeInTheDocument();
   ```

2. **Set up proper test providers for drag-and-drop:**
   ```javascript
   // Need to wrap components with @dnd-kit providers
   import { DndContext } from '@dnd-kit/core';
   
   function renderWithDnd(ui) {
     return render(
       <DndContext>
         {ui}
       </DndContext>
     );
   }
   ```

**Risk Level:** 🟡 **MEDIUM** - Tests are skipped, not failing, but coverage is reduced

---

## 🟡 Medium Priority Issues

### 4. @testing-library/react-hooks Package

**Status:** ⚠️ **DEPRECATED** - Should be removed

**Current Usage:**
- Listed in `package.json` devDependencies
- Listed in migration document
- **NOT ACTUALLY USED** in codebase

**Issue:**
- `@testing-library/react-hooks` was merged into `@testing-library/react` v13.5+
- You're using `@testing-library/react` v16.3.0, which includes hook testing
- The separate package is unnecessary

**Solution:**
```javascript
// OLD (deprecated package)
import { renderHook } from '@testing-library/react-hooks';

// NEW (built into @testing-library/react)
import { renderHook } from '@testing-library/react';
```

**Action Required:**
1. Remove `@testing-library/react-hooks` from `package.json`
2. Update migration document
3. Search for any imports (likely none found)

**Risk Level:** 🟢 **LOW** - Package exists but unused, just cleanup

---

### 5. useLayoutEffect SSR Warnings

**Status:** ⚠️ **POTENTIAL ISSUE**

**Files Using useLayoutEffect:**
- `packages/mask-markup/src/components/blank.jsx`
- `packages/mask-markup/src/choices/choice.jsx`
- `packages/charting/src/mark-label.jsx`
- `packages/charting/src/chart-setup.jsx`
- `packages/editable-html/src/plugins/respArea/drag-in-the-blank/choice.jsx`
- `packages/graphing/src/mark-label.jsx`
- `packages/graphing-solution-set/src/mark-label.jsx`
- `packages/drag/src/preview-component.jsx`

**Issue:**
- `useLayoutEffect` does nothing on the server (SSR)
- Next.js uses SSR, so these hooks won't run server-side
- May cause hydration mismatches

**Solution:**
Create isomorphic hook (as mentioned in migration doc):

```javascript
// packages/test-utils/src/hooks.js (or similar)
import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```

Then update all files:
```javascript
// Before
import { useLayoutEffect } from 'react';

// After
import { useIsomorphicLayoutEffect } from '@pie-lib/test-utils';
// or create local hook
```

**Risk Level:** 🟡 **MEDIUM** - May cause hydration warnings in Next.js

---

### 6. Next.js _app.js Could Use Function Component

**Status:** 🟢 **OPTIONAL** - Current code works

**Current:**
```javascript
// packages/demo/pages/_app.js
export default class MyApp extends App {
  render() {
    // ...
  }
}
```

**Recommendation:**
Convert to function component (React 18 best practice):

```javascript
// packages/demo/pages/_app.js
export default function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  return (
    <CacheProvider value={emotionCache}>
      <Component {...pageProps} />
    </CacheProvider>
  );
}
```

**Risk Level:** 🟢 **LOW** - Purely stylistic, current code works fine

---

## ✅ Completed Tasks

### Core React Upgrade
- ✅ React upgraded to `^18.2.0`
- ✅ ReactDOM upgraded to `^18.2.0`
- ✅ All packages using React 18

### ReactDOM API Migration
- ✅ `createRoot` used in editable-html plugins (portals, dialogs)
- ✅ No `ReactDOM.render` usage found
- ✅ No `ReactDOM.hydrate` usage (Next.js handles it)

### Test Infrastructure
- ✅ Jest upgraded to 29.7.0
- ✅ `jest.setup.js` configured for RTL
- ✅ `jest.config.js` updated for React 18
- ✅ All mocks configured (matchMedia, ResizeObserver, etc.)

### Enzyme → RTL Migration
- ✅ 10/12 packages fully migrated (83%)
- ✅ test-utils package migrated
- ✅ charting package migrated
- ✅ mask-markup package migrated
- ✅ math-input package migrated
- ✅ text-select package migrated
- ✅ math-toolbar package migrated
- ✅ plot package migrated
- ✅ rubric package migrated
- ✅ scoring-config package migrated
- ✅ tools package migrated

### Next.js Integration
- ✅ Next.js 15.4.6 (compatible with React 18)
- ✅ `reactStrictMode: true` enabled
- ✅ Emotion SSR configured correctly
- ✅ `_document.js` properly set up

---

## 📚 Library & Tooling Explanation

### Old vs New Libraries

#### 1. Testing Libraries

**OLD (React 16):**
```json
{
  "enzyme": "^3.10.0",
  "enzyme-adapter-react-16": "^1.14.0",
  "enzyme-to-json": "^3.3.5"
}
```

**Why Enzyme was used:**
- Shallow rendering for fast tests
- Direct access to component instances
- Easy prop/state inspection

**Why Enzyme doesn't work with React 18:**
- No official React 18 adapter
- Relies on React internals that changed
- Breaks with concurrent features

**NEW (React 18):**
```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/dom": "^10.4.1",
  "@testing-library/user-event": "^14.5.2"
}
```

**Why React Testing Library:**
- ✅ Tests user behavior, not implementation
- ✅ Works with React 18 out of the box
- ✅ Better accessibility testing
- ✅ More maintainable tests

**Role of Each Library:**

| Library | Purpose | Why Required |
|---------|---------|--------------|
| `@testing-library/react` | Core rendering and queries | Replaces Enzyme's render/mount |
| `@testing-library/jest-dom` | DOM matchers (`toBeInTheDocument`, etc.) | Better assertions than Enzyme |
| `@testing-library/dom` | Low-level DOM utilities | Used by react library internally |
| `@testing-library/user-event` | User interaction simulation | More realistic than Enzyme's `simulate()` |

#### 2. ReactDOM API Changes

**OLD (React 16):**
```javascript
import ReactDOM from 'react-dom';

// Render
ReactDOM.render(<App />, container);

// Hydrate (SSR)
ReactDOM.hydrate(<App />, container);

// Unmount
ReactDOM.unmountComponentAtNode(container);
```

**NEW (React 18):**
```javascript
import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';

// Render
const root = createRoot(container);
root.render(<App />);

// Hydrate (SSR)
hydrateRoot(container, <App />);

// Unmount
root.unmount();
```

**Why the Change:**
- Enables concurrent features
- Better performance
- More control over rendering
- Prepares for React 19

**Your Current Usage:**
- ✅ Using `createRoot` for dynamic portals (editable-html)
- ✅ Next.js handles hydration automatically
- ⚠️ Still using `ReactDOM.createPortal` (valid, but could modernize)

#### 3. React 18 New Features (Available but Optional)

**Automatic Batching:**
- State updates in promises/timeouts are batched automatically
- No code changes needed
- Improves performance

**Transitions:**
```javascript
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();
startTransition(() => {
  // Non-urgent update
  setExpensiveState(newValue);
});
```
- Not currently used in codebase
- Useful for expensive updates

**useDeferredValue:**
```javascript
import { useDeferredValue } from 'react';

const deferredQuery = useDeferredValue(query);
```
- Not currently used
- Useful for search/filter inputs

**useId:**
```javascript
import { useId } from 'react';

const id = useId(); // Unique ID for SSR
```
- Not currently used
- Should replace manual ID generation for SSR

---

## 🎯 Remaining Tasks Checklist

### Critical (Must Fix)

- [ ] **Fix ReactDOM.findDOMNode** in `packages/mask-markup/src/with-mask.jsx`
  - Replace with refs
  - Test thoroughly
  - **Risk:** Will break in React 19

### High Priority

- [ ] **Migrate skipped test suites** (graphing, graphing-solution-set)
  - Convert instance tests to behavioral tests
  - Set up drag-and-drop providers
  - **Risk:** Reduced test coverage

- [ ] **Review useLayoutEffect usage** for SSR compatibility
  - Create isomorphic hook
  - Update all 8 files using useLayoutEffect
  - **Risk:** Hydration warnings

### Medium Priority

- [ ] **Remove @testing-library/react-hooks** from dependencies
  - It's deprecated and unused
  - **Risk:** None (cleanup only)

- [ ] **Modernize ReactDOM.createPortal usage**
  - Consider using createRoot for dynamic portals
  - **Risk:** Low (current usage works)

### Low Priority (Optional)

- [ ] **Convert Next.js _app.js to function component**
  - Purely stylistic
  - **Risk:** None

- [ ] **Adopt React 18 new features where beneficial**
  - useTransition for expensive updates
  - useDeferredValue for search inputs
  - useId for SSR-safe IDs
  - **Risk:** None (optional enhancements)

---

## 🔍 Detailed File-by-File Analysis

### Files Requiring Immediate Attention

#### 1. `packages/mask-markup/src/with-mask.jsx`

**Issue:** Uses `ReactDOM.findDOMNode(this)`

**Current Code:**
```javascript
componentDidUpdate(prevProps) {
  if (this.props.markup !== prevProps.markup) {
    const domNode = ReactDOM.findDOMNode(this);
    const mathElements = domNode && domNode.querySelectorAll('[data-latex][data-math-handled="true"]');
    // ... cleanup logic
  }
}
```

**Required Change:**
```javascript
class WithMask extends React.Component {
  containerRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.markup !== prevProps.markup && this.containerRef.current) {
      const mathElements = this.containerRef.current.querySelectorAll('[data-latex][data-math-handled="true"]');
      // ... same cleanup logic
    }
  }

  render() {
    return (
      <div ref={this.containerRef}>
        <Mask {...this.props} />
      </div>
    );
  }
}
```

**Testing Required:**
- Verify MathJax cleanup still works
- Test with different markup values
- Check for memory leaks

---

#### 2. Skipped Test Files

**graphing/src/__tests__/graph-with-controls.test.jsx**

**Current Status:** `describe.skip('Graph (legacy enzyme tests - needs migration)')`

**What Needs Migration:**
- Complex prop setup tests
- Need proper graph context providers
- Should test user interactions, not prop passing

**Estimated Effort:** 2-3 hours

---

**graphing-solution-set/src/tools/shared/line/__tests__/index.test.jsx**

**Current Status:** Multiple `describe.skip` blocks

**What Needs Migration:**
- Instance method tests (`wrapper.instance().method()`)
- State inspection tests
- Need to convert to behavioral testing

**Example Migration:**
```javascript
// OLD
it('dragComp calls onChange', () => {
  const wrapper = mount(<Component />);
  wrapper.instance().dragComp({ x: 1, y: 1 });
  expect(onChange).toHaveBeenCalled();
});

// NEW
it('dragComp calls onChange', async () => {
  const onChange = jest.fn();
  render(<Component onChange={onChange} />);
  
  const line = screen.getByRole('graphics-document');
  await userEvent.pointer([
    { keys: '[MouseLeft>]', target: line },
    { coords: { x: 1, y: 1 } },
    { keys: '[/MouseLeft]' }
  ]);
  
  expect(onChange).toHaveBeenCalled();
});
```

**Estimated Effort:** 4-6 hours per file

---

### Files Using useLayoutEffect

All these files should use isomorphic hook for SSR compatibility:

1. `packages/mask-markup/src/components/blank.jsx`
2. `packages/mask-markup/src/choices/choice.jsx`
3. `packages/charting/src/mark-label.jsx`
4. `packages/charting/src/chart-setup.jsx`
5. `packages/editable-html/src/plugins/respArea/drag-in-the-blank/choice.jsx`
6. `packages/graphing/src/mark-label.jsx`
7. `packages/graphing-solution-set/src/mark-label.jsx`
8. `packages/drag/src/preview-component.jsx`

**Action:** Create `useIsomorphicLayoutEffect` hook and update all files

---

## 📖 Migration Patterns Reference

### Pattern 1: Instance Method Testing

**Enzyme Pattern (OLD):**
```javascript
const wrapper = mount(<Component />);
wrapper.instance().someMethod();
expect(wrapper.state('value')).toBe(5);
```

**RTL Pattern (NEW):**
```javascript
render(<Component />);
// Trigger the method through user interaction
await userEvent.click(screen.getByRole('button'));
// Assert the result, not the state
expect(screen.getByText('Expected output')).toBeInTheDocument();
```

### Pattern 2: State Inspection

**Enzyme Pattern (OLD):**
```javascript
expect(wrapper.state('isOpen')).toBe(true);
```

**RTL Pattern (NEW):**
```javascript
// Test what the user sees, not internal state
expect(screen.getByRole('dialog')).toBeInTheDocument();
```

### Pattern 3: Prop Testing

**Enzyme Pattern (OLD):**
```javascript
expect(wrapper.prop('disabled')).toBe(true);
```

**RTL Pattern (NEW):**
```javascript
const button = screen.getByRole('button');
expect(button).toBeDisabled();
```

### Pattern 4: Component Instance Access

**Enzyme Pattern (OLD):**
```javascript
const instance = wrapper.instance();
instance.handleClick();
```

**RTL Pattern (NEW):**
```javascript
// Expose handler via test ID or ref if needed
render(<Component testId="component" />);
const component = screen.getByTestId('component');
// Or trigger through user interaction
await userEvent.click(screen.getByRole('button'));
```

---

## 🚨 Breaking Changes & Risks

### 1. ReactDOM.findDOMNode Removal (React 19)

**Impact:** Will break `packages/mask-markup/src/with-mask.jsx`

**Timeline:** React 19 (not yet released, but deprecated now)

**Mitigation:** Fix before React 19 upgrade

---

### 2. StrictMode Double Invocation

**Impact:** Effects may run twice in development

**Current Status:** Already enabled in Next.js (`reactStrictMode: true`)

**Risk:** Low - Intentional behavior, helps catch bugs

---

### 3. Automatic Batching

**Impact:** State updates batched automatically

**Risk:** Low - Generally improves performance

**Potential Issues:**
- If code relies on synchronous updates, may need `flushSync`
- No issues found in current codebase

---

## 📊 Migration Progress Summary

### By Package

| Package | React 18 | RTL Migration | Status |
|---------|----------|---------------|--------|
| categorize | ✅ | N/A (no tests) | ✅ Complete |
| charting | ✅ | ✅ Complete | ✅ Complete |
| config-ui | ✅ | ⚠️ Partial | ⚠️ Needs work |
| controller-utils | ✅ | N/A (no tests) | ✅ Complete |
| correct-answer-toggle | ✅ | ✅ Complete | ✅ Complete |
| demo | ✅ | N/A (demo app) | ✅ Complete |
| drag | ✅ | ✅ Complete | ✅ Complete |
| editable-html | ✅ | ⚠️ Partial | ⚠️ 3 files remaining |
| feedback | ✅ | N/A (no tests) | ✅ Complete |
| graphing | ✅ | ⚠️ Partial | ⚠️ 3 skipped suites |
| graphing-solution-set | ✅ | ⚠️ Partial | ⚠️ 5+ skipped suites |
| graphing-utils | ✅ | ✅ Complete | ✅ Complete |
| icons | ✅ | ✅ Complete | ✅ Complete |
| mask-markup | ✅ | ✅ Complete | ✅ Complete |
| math-evaluator | ✅ | ✅ Complete | ✅ Complete |
| math-input | ✅ | ✅ Complete | ✅ Complete |
| math-rendering | ✅ | ✅ Complete | ✅ Complete |
| math-rendering-accessible | ✅ | ✅ Complete | ✅ Complete |
| math-toolbar | ✅ | ✅ Complete | ✅ Complete |
| plot | ✅ | ✅ Complete | ✅ Complete |
| render-ui | ✅ | ✅ Complete | ✅ Complete |
| rubric | ✅ | ✅ Complete | ✅ Complete |
| scoring-config | ✅ | ✅ Complete | ✅ Complete |
| style-utils | ✅ | N/A (no tests) | ✅ Complete |
| test-utils | ✅ | ✅ Complete | ✅ Complete |
| text-select | ✅ | ✅ Complete | ✅ Complete |
| tools | ✅ | ✅ Complete | ✅ Complete |
| translator | ✅ | ✅ Complete | ✅ Complete |

**Overall:** 24/28 packages fully migrated (86%)

---

## 🎓 Key Learnings & Best Practices

### What Went Well

1. **Systematic Migration:** Clear migration path from Enzyme to RTL
2. **Test Infrastructure:** Jest 29 + RTL properly configured
3. **Next.js Integration:** Smooth upgrade with proper SSR handling
4. **createRoot Usage:** Correctly used for dynamic portals

### Areas for Improvement

1. **Test Coverage:** Skipped tests reduce coverage
2. **Deprecated APIs:** findDOMNode still in use
3. **SSR Compatibility:** useLayoutEffect needs isomorphic hook
4. **Documentation:** Migration doc could be updated with current status

---

## 📝 Recommendations

### Immediate Actions (This Week)

1. **Fix ReactDOM.findDOMNode** - Critical for React 19 compatibility
2. **Review skipped tests** - Prioritize high-value test suites
3. **Create useIsomorphicLayoutEffect hook** - Fix SSR warnings

### Short-term (This Month)

1. **Migrate remaining test suites** - Focus on graphing packages
2. **Remove deprecated dependencies** - Clean up package.json
3. **Update migration documentation** - Reflect current status

### Long-term (Next Quarter)

1. **Adopt React 18 features** - useTransition, useDeferredValue, useId
2. **Modernize portal usage** - Consider createRoot for all dynamic portals
3. **Convert class components** - Where it makes sense (like _app.js)

---

## 🔗 Related Documentation

- [MIGRATION_REACT_16_TO_18.md](./MIGRATION_REACT_16_TO_18.md) - Original migration guide
- [ENZYME_TO_RTL_CHANGES.md](./ENZYME_TO_RTL_CHANGES.md) - Enzyme migration patterns
- [KEY_FIXES_APPLIED.md](./KEY_FIXES_APPLIED.md) - Historical fixes
- [MIGRATION_STATUS_REPORT.md](./MIGRATION_STATUS_REPORT.md) - Package-by-package status

---

**End of Analysis**
