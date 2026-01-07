# Test-Utils Enhancement Plan: Central RTL Re-exports + Web Components

## Current State Analysis

### ✅ What's Already Good

The `@pie-lib/test-utils` package already:
- Re-exports all RTL utilities (`render`, `screen`, `waitFor`, etc.)
- Re-exports `userEvent` and `jest-dom`
- Provides `renderWithTheme()` for MUI components
- Provides `renderWithProviders()` for multiple providers
- Has comprehensive documentation

### ❌ Current Gaps

1. **Inconsistent Usage Across Codebase**
   - Config-ui: **0 test files** use `@pie-lib/test-utils`
   - Charting: **Some tests** use it, many don't
   - **Result:** Duplicate imports, no centralized testing patterns

2. **No Web Component Support**
   - Web components require special handling in tests
   - Shadow DOM queries need custom utilities
   - No helpers for custom element testing

3. **Jest 24 Limitation**
   - Still requiring explicit `import '@testing-library/jest-dom'` in every file
   - Should be globally available

4. **Missing Common Test Patterns**
   - No helper for keyboard event testing (keyDown, keyCode)
   - No custom event dispatcher for web components
   - No drag-and-drop helpers
   - No clipboard simulation

## Proposed Enhancements

### Enhancement 1: Enforce Central Import Pattern

**Goal:** All tests should import from `@pie-lib/test-utils` instead of direct RTL imports.

**Benefits:**
- ✅ Single source of truth for test utilities
- ✅ Easy to add project-wide test helpers
- ✅ Consistent testing patterns across packages
- ✅ Easier to upgrade RTL in future (change one place)

**Before:**
```javascript
// Every test file does this:
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
```

**After:**
```javascript
// One import to rule them all:
import { render, screen, userEvent } from '@pie-lib/test-utils';
// jest-dom matchers are already global (after Jest 29 upgrade)
```

### Enhancement 2: Add Web Component Testing Utilities

**Problem:** Web components use Shadow DOM, which requires special queries.

**Solution:** Add web component helpers to test-utils:

```javascript
/**
 * Query within a shadow root
 * @param {HTMLElement} element - The custom element with shadow root
 * @param {Function} query - RTL query function (e.g., screen.getByRole)
 * @param {...any} args - Arguments to pass to query
 */
export function withinShadow(element, query, ...args) {
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) {
    throw new Error('Element does not have a shadow root');
  }
  return within(shadowRoot).query(...args);
}

/**
 * Wait for a custom element to be defined
 * @param {string} tagName - Custom element tag name
 * @param {number} timeout - Timeout in ms
 */
export async function waitForCustomElement(tagName, timeout = 3000) {
  if (customElements.get(tagName)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Custom element ${tagName} not defined within ${timeout}ms`));
    }, timeout);

    customElements.whenDefined(tagName).then(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/**
 * Render a web component and wait for it to be ready
 * @param {string} tagName - Custom element tag name
 * @param {Object} attributes - Attributes to set on the element
 */
export async function renderWebComponent(tagName, attributes = {}) {
  await waitForCustomElement(tagName);

  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (typeof value === 'function') {
      element.addEventListener(key, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  document.body.appendChild(element);

  // Wait for component to render (custom elements are async)
  await new Promise(resolve => setTimeout(resolve, 0));

  return element;
}

/**
 * Dispatch a custom event on an element
 * Useful for web component events
 */
export function dispatchCustomEvent(element, eventName, detail = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true,
  });
  element.dispatchEvent(event);
}
```

### Enhancement 3: Add Keyboard Event Helpers

**Problem:** Many components use `keyCode` checks, and userEvent doesn't always work.

**Solution:** Add keyboard helpers:

```javascript
/**
 * Simulate keyboard event with keyCode
 * Useful for legacy components checking event.keyCode
 * @param {HTMLElement} element - Target element
 * @param {number} keyCode - Key code (13 for Enter, 27 for Escape, etc.)
 * @param {string} type - Event type (keydown, keyup, keypress)
 */
export function pressKey(element, keyCode, type = 'keydown') {
  const event = new KeyboardEvent(type, {
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

/**
 * Common key codes as constants
 */
export const Keys = {
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  TAB: 9,
  BACKSPACE: 8,
  DELETE: 46,
};

/**
 * Type and press Enter (common pattern)
 */
export async function typeAndSubmit(element, text) {
  const user = userEvent.setup();
  await user.type(element, text);
  pressKey(element, Keys.ENTER);
}
```

### Enhancement 4: Add Drag and Drop Helpers

**Problem:** DnD testing is complex and repetitive.

**Solution:**

```javascript
/**
 * Simulate drag and drop operation
 * @param {HTMLElement} source - Element to drag
 * @param {HTMLElement} target - Element to drop on
 */
export async function dragAndDrop(source, target) {
  const user = userEvent.setup();

  // Simulate drag start
  fireEvent.dragStart(source);

  // Simulate drag over target
  fireEvent.dragEnter(target);
  fireEvent.dragOver(target);

  // Simulate drop
  fireEvent.drop(target);
  fireEvent.dragEnd(source);
}
```

### Enhancement 5: Add Form Testing Helpers

**Problem:** Form testing is common but repetitive.

**Solution:**

```javascript
/**
 * Fill a form with values
 * @param {Object} values - Object with field labels/names and their values
 */
export async function fillForm(values) {
  const user = userEvent.setup();

  for (const [label, value] of Object.entries(values)) {
    const field = screen.getByLabelText(label) || screen.getByRole('textbox', { name: label });
    await user.clear(field);
    await user.type(field, String(value));
  }
}

/**
 * Submit a form by clicking the submit button
 */
export async function submitForm(buttonText = /submit/i) {
  const user = userEvent.setup();
  const submitButton = screen.getByRole('button', { name: buttonText });
  await user.click(submitButton);
}
```

### Enhancement 6: Add Accessibility Helpers

**Problem:** Should encourage accessibility testing.

**Solution:**

```javascript
/**
 * Check if an element is accessible
 * Requires jest-axe to be installed
 */
export async function expectAccessible(container) {
  const { axe } = await import('jest-axe');
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Check if element has proper ARIA attributes
 */
export function expectAriaLabel(element, expectedLabel) {
  const label = element.getAttribute('aria-label') ||
                element.getAttribute('aria-labelledby');
  expect(label).toBeTruthy();
  if (expectedLabel) {
    expect(label).toBe(expectedLabel);
  }
}
```

## Implementation Plan

### Step 1: Update test-utils Package

Add new utilities to `packages/test-utils/src/index.js`:

```javascript
// Existing imports and re-exports...
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export * from '@testing-library/jest-dom';

// Add new utility categories
export * from './web-components';
export * from './keyboard';
export * from './drag-drop';
export * from './forms';
export * from './accessibility';
```

Create separate files:
- `src/web-components.js` - Web component utilities
- `src/keyboard.js` - Keyboard event helpers
- `src/drag-drop.js` - Drag and drop helpers
- `src/forms.js` - Form testing helpers
- `src/accessibility.js` - A11y testing helpers

### Step 2: Update Documentation

Update `packages/test-utils/README.md` with:
- Web component testing examples
- Keyboard event helpers usage
- Migration guide from direct RTL imports

### Step 3: Migrate Existing Tests

Create a codemod or script to automatically update imports:

```bash
# Find all test files with direct RTL imports
find packages/ -name "*.test.js*" -exec sed -i.bak "s/from '@testing-library\/react'/from '@pie-lib\/test-utils'/g" {} \;
```

### Step 4: Add ESLint Rule (Optional)

Prevent direct RTL imports in tests:

```javascript
// .eslintrc.js
rules: {
  'no-restricted-imports': ['error', {
    patterns: [{
      group: ['@testing-library/*'],
      message: 'Import from @pie-lib/test-utils instead',
      // Allow in test-utils package itself
      allowTypeImports: true,
    }],
  }],
}
```

## Migration Strategy

### Phase 1: Enhance test-utils (1-2 days)
- Add web component utilities
- Add keyboard helpers
- Add form helpers
- Update documentation
- Add tests for new utilities

### Phase 2: Migrate One Package (0.5 days)
- Choose small package (e.g., config-ui)
- Update all imports to use test-utils
- Verify all tests pass
- Document any issues

### Phase 3: Migrate Remaining Packages (2-3 days)
- Run migration script
- Fix any failures
- Remove direct RTL imports

### Phase 4: Enforce Pattern (0.5 days)
- Add ESLint rule
- Update contributing docs
- Add CI check

## Benefits Summary

### For Developers

✅ **Less boilerplate** - One import instead of 3-4
✅ **Common patterns available** - No reinventing the wheel
✅ **Web component support** - Easy shadow DOM testing
✅ **Consistent testing** - Same patterns across all packages
✅ **Better DX** - Autocomplete shows all available utilities

### For Codebase

✅ **Easier refactoring** - Change test-utils, affect all tests
✅ **Easier RTL upgrades** - Update one package, not hundreds of files
✅ **Reduced duplication** - DRY test utilities
✅ **Better test quality** - Encouraged best practices built-in

### For Maintenance

✅ **Single source of truth** - All test patterns in one place
✅ **Easy to extend** - Add new helpers as needs arise
✅ **Version control** - Test-utils version tracks available features

## Web Component Specific Benefits

Since you mentioned having web components:

1. **Shadow DOM Testing Made Easy**
   ```javascript
   // Before: Complex shadow root queries
   const shadowRoot = element.shadowRoot;
   const button = shadowRoot.querySelector('button');

   // After: Clean utility
   const button = withinShadow(element, getByRole, 'button');
   ```

2. **Custom Event Testing**
   ```javascript
   // Before: Verbose custom event creation
   const event = new CustomEvent('my-event', {
     detail: { value: 'test' },
     bubbles: true,
     composed: true,
   });
   element.dispatchEvent(event);

   // After: Clean helper
   dispatchCustomEvent(element, 'my-event', { value: 'test' });
   ```

3. **Async Element Registration**
   ```javascript
   // Before: Manual waiting
   await customElements.whenDefined('my-component');
   const element = document.createElement('my-component');

   // After: One call
   const element = await renderWebComponent('my-component', {
     prop: 'value',
     onClick: jest.fn(),
   });
   ```

## Example: Before vs After

### Before (Current State)

```javascript
// config-ui/src/__tests__/my-component.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MyComponent from '../my-component';

test('handles Enter key', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();

  render(<MyComponent onSubmit={onSubmit} />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'test');

  // Have to use fireEvent for keyCode
  const { fireEvent } = require('@testing-library/react');
  fireEvent.keyDown(input, { keyCode: 13 });

  expect(onSubmit).toHaveBeenCalled();
});
```

### After (With Enhanced test-utils)

```javascript
// config-ui/src/__tests__/my-component.test.jsx
import { render, screen, userEvent, pressKey, Keys } from '@pie-lib/test-utils';
import MyComponent from '../my-component';

test('handles Enter key', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();

  render(<MyComponent onSubmit={onSubmit} />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'test');
  pressKey(input, Keys.ENTER);

  expect(onSubmit).toHaveBeenCalled();
});
```

**Improvements:**
- ✅ No jest-dom import (global after Jest 29)
- ✅ One import line instead of multiple
- ✅ Clean `pressKey` helper instead of fireEvent
- ✅ Semantic `Keys.ENTER` instead of magic number 13

## Decision: Should We Do This?

### ✅ Strong Yes - Here's Why:

1. **You already have the foundation** - test-utils exists and has good structure
2. **Low risk, high reward** - Pure additive changes, no breaking changes
3. **Solves real pain points** - Keycode events, web components, repetitive patterns
4. **Aligns with best practices** - Single source of truth for test utilities
5. **Future-proof** - Easy to add more helpers as needs arise
6. **Web component support** - Critical for your use case

### Recommended Approach:

1. **Start small** - Add web component + keyboard helpers first
2. **Test in one package** - Prove value in config-ui
3. **Gradually migrate** - Don't force immediate adoption
4. **Document well** - Make it easy for team to use
5. **Add as you go** - Add new helpers when patterns emerge

## Next Steps

If you approve this approach:

1. I can implement the keyboard helpers (pressKey, Keys, typeAndSubmit)
2. Add web component utilities
3. Update test-utils package
4. Create example usage in config-ui tests
5. Document everything

This would make your testing infrastructure much more robust and pleasant to use!
