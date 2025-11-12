import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';

/**
 * Common keyboard key codes
 * Useful for legacy components that check event.keyCode
 *
 * @example
 * pressKey(input, Keys.ENTER);
 * pressKey(input, Keys.ESCAPE);
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
  HOME: 36,
  END: 35,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
};

/**
 * Simulate keyboard event with keyCode
 * Useful for legacy components checking event.keyCode
 *
 * userEvent.type() with special keys like {Enter} doesn't work well with
 * components that check event.keyCode. Use this helper instead.
 *
 * @param {HTMLElement} element - Target element
 * @param {number} keyCode - Key code (use Keys.ENTER, Keys.ESCAPE, etc.)
 * @param {string} type - Event type (keydown, keyup, keypress)
 * @param {Object} options - Additional event properties
 *
 * @example
 * // Press Enter on an input
 * const input = screen.getByRole('textbox');
 * pressKey(input, Keys.ENTER);
 *
 * @example
 * // Press Escape with keyup event
 * pressKey(dialog, Keys.ESCAPE, 'keyup');
 *
 * @example
 * // Press with additional properties
 * pressKey(input, Keys.ENTER, 'keydown', { ctrlKey: true });
 */
export function pressKey(element, keyCode, type = 'keydown', options = {}) {
  const event = new KeyboardEvent(type, {
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true,
    ...options,
  });

  fireEvent(element, event);
}

/**
 * Type text and then press Enter
 * Common pattern for form submissions
 *
 * @param {HTMLElement} element - Input element
 * @param {string} text - Text to type
 *
 * @example
 * const input = screen.getByRole('textbox');
 * await typeAndSubmit(input, 'hello world');
 * expect(onSubmit).toHaveBeenCalledWith('hello world');
 */
export async function typeAndSubmit(element, text) {
  const user = userEvent.setup();
  await user.type(element, text);
  pressKey(element, Keys.ENTER);
}

/**
 * Type text and then press a specific key
 * Flexible version of typeAndSubmit
 *
 * @param {HTMLElement} element - Input element
 * @param {string} text - Text to type
 * @param {number} keyCode - Key code to press after typing
 *
 * @example
 * // Type and press Escape
 * await typeAndPressKey(input, 'search term', Keys.ESCAPE);
 *
 * @example
 * // Type and press Tab
 * await typeAndPressKey(input, 'value', Keys.TAB);
 */
export async function typeAndPressKey(element, text, keyCode) {
  const user = userEvent.setup();
  await user.type(element, text);
  pressKey(element, keyCode);
}

/**
 * Clear input and type new text
 * Common pattern for updating form fields
 *
 * @param {HTMLElement} element - Input element
 * @param {string} text - New text to type
 *
 * @example
 * const input = screen.getByRole('textbox');
 * await clearAndType(input, 'new value');
 */
export async function clearAndType(element, text) {
  const user = userEvent.setup();
  await user.clear(element);
  await user.type(element, text);
}

/**
 * Press multiple keys in sequence
 * Useful for keyboard shortcuts
 *
 * @param {HTMLElement} element - Target element
 * @param {...number} keyCodes - Key codes to press in sequence
 *
 * @example
 * // Press Ctrl+Enter
 * pressKeys(input, Keys.ENTER, { ctrlKey: true });
 *
 * @example
 * // Navigate with arrow keys
 * pressKeys(list, Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys.ENTER);
 */
export function pressKeys(element, ...keyCodes) {
  keyCodes.forEach((keyCode) => {
    if (typeof keyCode === 'object') {
      // Last argument might be options
      return;
    }
    pressKey(element, keyCode);
  });
}

/**
 * Simulate keyboard navigation
 * Press arrow keys to navigate through a list
 *
 * @param {HTMLElement} element - List or container element
 * @param {number} steps - Number of steps to navigate (positive = down/right, negative = up/left)
 * @param {string} direction - 'vertical' or 'horizontal'
 *
 * @example
 * // Navigate down 3 items in a list
 * navigateWithKeys(listbox, 3, 'vertical');
 *
 * @example
 * // Navigate left 2 items
 * navigateWithKeys(tabs, -2, 'horizontal');
 */
export function navigateWithKeys(element, steps, direction = 'vertical') {
  const key = direction === 'vertical'
    ? (steps > 0 ? Keys.ARROW_DOWN : Keys.ARROW_UP)
    : (steps > 0 ? Keys.ARROW_RIGHT : Keys.ARROW_LEFT);

  const count = Math.abs(steps);
  for (let i = 0; i < count; i++) {
    pressKey(element, key);
  }
}

/**
 * Map of key names to key codes for convenience
 * Alternative to Keys constant with more readable names
 */
export const KeyCode = {
  Enter: 13,
  Escape: 27,
  Space: 32,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  Tab: 9,
  Backspace: 8,
  Delete: 46,
  Home: 36,
  End: 35,
  PageUp: 33,
  PageDown: 34,
};
