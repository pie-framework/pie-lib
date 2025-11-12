import { within } from '@testing-library/react';

/**
 * Query within a shadow root
 * Web components use Shadow DOM which requires special query handling
 *
 * @param {HTMLElement} element - The custom element with shadow root
 * @param {string} role - ARIA role to query for
 * @param {Object} options - Query options (name, etc.)
 * @returns {HTMLElement} The found element
 *
 * @example
 * const button = withinShadow(customElement, 'button');
 * await user.click(button);
 *
 * @example
 * const input = withinShadow(customElement, 'textbox', { name: 'Username' });
 */
export function withinShadow(element, role, options = {}) {
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) {
    throw new Error(
      `Element does not have a shadow root. ` +
      `Make sure the custom element is properly defined and attached.`
    );
  }

  return within(shadowRoot).getByRole(role, options);
}

/**
 * Query within shadow root using any RTL query
 * More flexible version of withinShadow
 *
 * @param {HTMLElement} element - The custom element with shadow root
 * @returns {Object} RTL queries scoped to shadow root
 *
 * @example
 * const { getByRole, getByText } = queryInShadow(customElement);
 * const button = getByRole('button');
 * const heading = getByText('Welcome');
 */
export function queryInShadow(element) {
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) {
    throw new Error(
      `Element does not have a shadow root. ` +
      `Make sure the custom element is properly defined and attached.`
    );
  }

  return within(shadowRoot);
}

/**
 * Wait for a custom element to be defined
 * Custom elements are registered asynchronously
 *
 * @param {string} tagName - Custom element tag name (e.g., 'my-component')
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 *
 * @example
 * await waitForCustomElement('pie-chart');
 * const chart = document.createElement('pie-chart');
 *
 * @example
 * await waitForCustomElement('my-component', 5000);
 */
export async function waitForCustomElement(tagName, timeout = 3000) {
  if (customElements.get(tagName)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `Custom element '${tagName}' not defined within ${timeout}ms. ` +
          `Make sure the element is registered with customElements.define().`
        )
      );
    }, timeout);

    customElements.whenDefined(tagName).then(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/**
 * Render a web component and wait for it to be ready
 * Handles the full lifecycle: wait for definition, create, append, wait for render
 *
 * @param {string} tagName - Custom element tag name
 * @param {Object} attributes - Attributes to set on the element
 * @param {Object} properties - Properties to set on the element
 * @param {HTMLElement} container - Container to append to (defaults to document.body)
 * @returns {Promise<HTMLElement>} The custom element
 *
 * @example
 * const chart = await renderWebComponent('pie-chart', {
 *   type: 'bar',
 *   'data-testid': 'my-chart'
 * });
 *
 * @example
 * const button = await renderWebComponent('custom-button',
 *   { 'aria-label': 'Submit' },
 *   { onClick: jest.fn() }
 * );
 */
export async function renderWebComponent(
  tagName,
  attributes = {},
  properties = {},
  container = document.body
) {
  await waitForCustomElement(tagName);

  const element = document.createElement(tagName);

  // Set attributes (strings)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  // Set properties (objects, functions, etc.)
  Object.entries(properties).forEach(([key, value]) => {
    element[key] = value;
  });

  container.appendChild(element);

  // Wait for component to render (custom elements may be async)
  await new Promise((resolve) => setTimeout(resolve, 0));

  return element;
}

/**
 * Dispatch a custom event on an element
 * Web components often use custom events for communication
 *
 * @param {HTMLElement} element - Element to dispatch event from
 * @param {string} eventName - Event name (e.g., 'change', 'custom-event')
 * @param {*} detail - Event detail data
 * @param {Object} options - Event options (bubbles, composed, etc.)
 *
 * @example
 * dispatchCustomEvent(chart, 'data-changed', { value: [1, 2, 3] });
 *
 * @example
 * dispatchCustomEvent(button, 'custom-click', null, { bubbles: false });
 */
export function dispatchCustomEvent(
  element,
  eventName,
  detail = null,
  options = {}
) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true, // Allow event to cross shadow DOM boundary
    ...options,
  });

  element.dispatchEvent(event);
  return event;
}

/**
 * Listen for a custom event and return a promise that resolves when fired
 * Useful for testing event emissions
 *
 * @param {HTMLElement} element - Element to listen to
 * @param {string} eventName - Event name to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<CustomEvent>} Promise that resolves with the event
 *
 * @example
 * const promise = waitForEvent(chart, 'data-loaded');
 * chart.loadData();
 * const event = await promise;
 * expect(event.detail).toEqual({ loaded: true });
 *
 * @example
 * await waitForEvent(component, 'ready', 5000);
 */
export function waitForEvent(element, eventName, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      element.removeEventListener(eventName, handler);
      reject(
        new Error(`Event '${eventName}' not fired within ${timeout}ms`)
      );
    }, timeout);

    const handler = (event) => {
      clearTimeout(timer);
      element.removeEventListener(eventName, handler);
      resolve(event);
    };

    element.addEventListener(eventName, handler);
  });
}

/**
 * Get all elements in shadow DOM matching a selector
 * Sometimes you need to query by CSS selector in shadow DOM
 *
 * @param {HTMLElement} element - Element with shadow root
 * @param {string} selector - CSS selector
 * @returns {Array<HTMLElement>} Array of matching elements
 *
 * @example
 * const buttons = queryAllInShadow(component, 'button');
 * expect(buttons).toHaveLength(3);
 *
 * @example
 * const inputs = queryAllInShadow(form, 'input[type="text"]');
 */
export function queryAllInShadow(element, selector) {
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) {
    throw new Error(`Element does not have a shadow root`);
  }

  return Array.from(shadowRoot.querySelectorAll(selector));
}

/**
 * Get a single element in shadow DOM matching a selector
 * Convenience wrapper around querySelector
 *
 * @param {HTMLElement} element - Element with shadow root
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} The found element or null
 *
 * @example
 * const header = queryInShadowDOM(component, '.header');
 */
export function queryInShadowDOM(element, selector) {
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) {
    throw new Error(`Element does not have a shadow root`);
  }

  return shadowRoot.querySelector(selector);
}

/**
 * Check if an element has a shadow root
 * Useful for conditional logic in tests
 *
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element has shadow root
 *
 * @example
 * if (hasShadowRoot(element)) {
 *   const button = withinShadow(element, 'button');
 * }
 */
export function hasShadowRoot(element) {
  return !!element.shadowRoot;
}

/**
 * Get the mode of a shadow root (open or closed)
 * Diagnostic utility
 *
 * @param {HTMLElement} element - Element with shadow root
 * @returns {string|null} 'open', 'closed', or null if no shadow root
 *
 * @example
 * const mode = getShadowRootMode(element);
 * expect(mode).toBe('open');
 */
export function getShadowRootMode(element) {
  if (!element.shadowRoot) {
    return null;
  }
  return element.shadowRoot.mode;
}
