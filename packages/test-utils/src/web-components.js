// Note: These helpers are for light DOM web components (no Shadow DOM)
// Standard React Testing Library queries work directly on these components

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
            'Make sure the element is registered with customElements.define().',
        ),
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
export async function renderWebComponent(tagName, attributes = {}, properties = {}, container = document.body) {
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
export function dispatchCustomEvent(element, eventName, detail = null, options = {}) {
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
      reject(new Error(`Event '${eventName}' not fired within ${timeout}ms`));
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
 * Check if a custom element is defined
 * Useful for verifying element registration
 *
 * @param {string} tagName - Custom element tag name
 * @returns {boolean} True if element is defined
 *
 * @example
 * if (isCustomElementDefined('pie-chart')) {
 *   // Element is ready to use
 * }
 */
export function isCustomElementDefined(tagName) {
  return typeof customElements !== 'undefined' && customElements.get(tagName) !== undefined;
}

/**
 * Helper to create and configure a custom element
 * For light DOM web components that render React
 *
 * @param {string} tagName - Custom element tag name
 * @param {Object} props - Props to pass to the element
 * @returns {HTMLElement} The custom element
 *
 * @example
 * const chart = createCustomElement('pie-chart', {
 *   data: [1, 2, 3],
 *   type: 'bar'
 * });
 * document.body.appendChild(chart);
 */
export function createCustomElement(tagName, props = {}) {
  const element = document.createElement(tagName);

  // Set properties directly on the element
  Object.entries(props).forEach(([key, value]) => {
    element[key] = value;
  });

  return element;
}
