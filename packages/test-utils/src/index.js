import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

/**
 * Default MUI theme for testing
 */
const defaultTheme = createTheme();

/**
 * Render a component with MUI ThemeProvider
 *
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @param {Object} options.theme - Custom MUI theme (optional)
 * @param {Object} options.renderOptions - Additional options passed to RTL render
 * @returns {Object} RTL render result
 *
 * @example
 * const { getByRole } = renderWithTheme(<Button>Click me</Button>);
 * expect(getByRole('button')).toBeInTheDocument();
 */
export function renderWithTheme(ui, options = {}) {
  const { theme = defaultTheme, ...renderOptions } = options;

  function Wrapper({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Render a component with multiple providers (Theme, etc.)
 * Useful when you need to wrap components with various context providers
 *
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @param {Object} options.theme - Custom MUI theme (optional)
 * @param {Array<React.ComponentType>} options.providers - Additional providers to wrap
 * @param {Object} options.renderOptions - Additional options passed to RTL render
 * @returns {Object} RTL render result
 *
 * @example
 * const { getByText } = renderWithProviders(
 *   <MyComponent />,
 *   { providers: [ReduxProvider, RouterProvider] }
 * );
 */
export function renderWithProviders(ui, options = {}) {
  const { theme = defaultTheme, providers = [], ...renderOptions } = options;

  function Wrapper({ children }) {
    let wrapped = <ThemeProvider theme={theme}>{children}</ThemeProvider>;

    // Wrap with additional providers (from innermost to outermost)
    providers.forEach((Provider) => {
      wrapped = <Provider>{wrapped}</Provider>;
    });

    return wrapped;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Create a custom theme for testing
 * Useful for testing components with specific theme configurations
 *
 * @param {Object} themeOptions - MUI theme options
 * @returns {Object} MUI theme
 *
 * @example
 * const darkTheme = createTestTheme({ palette: { mode: 'dark' } });
 * renderWithTheme(<Component />, { theme: darkTheme });
 */
export function createTestTheme(themeOptions = {}) {
  return createTheme(themeOptions);
}

/**
 * Wait for an element to be removed from the DOM
 * Wrapper around waitForElementToBeRemoved for convenience
 *
 * @example
 * await waitForRemoval(() => screen.queryByText('Loading...'));
 */
export { waitForElementToBeRemoved as waitForRemoval } from '@testing-library/react';

/**
 * Re-export all of @testing-library/react for convenience
 * This allows consumers to import everything from one place
 */
export * from '@testing-library/react';

/**
 * Re-export userEvent as a named export for convenience
 */
export { default as userEvent } from '@testing-library/user-event';

/**
 * Re-export jest-dom matchers (they're automatically added in jest.setup.js,
 * but we export them here for TypeScript support)
 */
export * from '@testing-library/jest-dom';

/**
 * Keyboard helpers for testing keyboard interactions
 * Especially useful for components checking event.keyCode
 */
export {
  Keys,
  pressKey,
  typeAndSubmit,
  clearAndType,
  navigateWithKeys,
} from './keyboard';

/**
 * Web component testing utilities
 * For testing light DOM custom elements (no Shadow DOM)
 */
export {
  waitForCustomElement,
  renderWebComponent,
  dispatchCustomEvent,
  waitForEvent,
  isCustomElementDefined,
  createCustomElement,
} from './web-components';

