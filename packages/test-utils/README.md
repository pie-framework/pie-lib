# @pie-lib/test-utils

Testing utilities for pie-lib packages with React Testing Library and MUI support.

## Installation

This package is typically used as a dev dependency:

```bash
yarn add -D @pie-lib/test-utils
```

## Features

- ✅ React Testing Library utilities
- ✅ MUI Theme Provider wrapper for tests
- ✅ Multiple provider composition
- ✅ Custom theme creation for testing
- ✅ All RTL exports in one place
- ✅ userEvent and jest-dom matchers included
- ✅ **NEW:** Keyboard helpers for keyCode-based components
- ✅ **NEW:** Web component testing utilities (Shadow DOM support)

## Usage

### Basic Rendering with MUI Theme

```javascript
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import { Button } from '@mui/material';

test('renders a button', () => {
  renderWithTheme(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### Custom Theme

```javascript
import { renderWithTheme, createTestTheme } from '@pie-lib/test-utils';

test('renders with dark theme', () => {
  const darkTheme = createTestTheme({
    palette: { mode: 'dark' }
  });

  renderWithTheme(<MyComponent />, { theme: darkTheme });
  // ... assertions
});
```

### Multiple Providers

```javascript
import { renderWithProviders } from '@pie-lib/test-utils';

test('renders with multiple providers', () => {
  const ReduxProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  renderWithProviders(<MyComponent />, {
    providers: [ReduxProvider]
  });
  // ... assertions
});
```

### User Interactions

```javascript
import { renderWithTheme, screen, userEvent } from '@pie-lib/test-utils';

test('handles button click', async () => {
  const onClick = jest.fn();
  const user = userEvent.setup();

  renderWithTheme(<Button onClick={onClick}>Click</Button>);

  await user.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### Keyboard Interactions

**NEW:** Helper functions for testing keyboard events, especially useful for legacy components checking `event.keyCode`:

```javascript
import { render, screen, pressKey, Keys, typeAndSubmit } from '@pie-lib/test-utils';

test('submits on Enter key', async () => {
  const onSubmit = jest.fn();
  render(<SearchInput onSubmit={onSubmit} />);

  const input = screen.getByRole('textbox');
  await typeAndSubmit(input, 'search term');

  expect(onSubmit).toHaveBeenCalledWith('search term');
});

test('handles Escape key', () => {
  const onCancel = jest.fn();
  render(<Modal onCancel={onCancel} />);

  const modal = screen.getByRole('dialog');
  pressKey(modal, Keys.ESCAPE);

  expect(onCancel).toHaveBeenCalled();
});
```

### Async Operations

```javascript
import { renderWithTheme, screen, waitFor } from '@pie-lib/test-utils';

test('loads data', async () => {
  renderWithTheme(<AsyncComponent />);

  // Wait for element to appear
  const element = await screen.findByText('Loaded');
  expect(element).toBeInTheDocument();

  // Or use waitFor
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Web Component Testing

**NEW:** Utilities for testing custom elements with Shadow DOM:

```javascript
import { renderWebComponent, withinShadow, dispatchCustomEvent } from '@pie-lib/test-utils';

test('interacts with web component', async () => {
  const element = await renderWebComponent('my-custom-element', {
    'data-testid': 'my-element',
    value: '42'
  });

  // Query within shadow DOM
  const button = withinShadow(element, 'button');
  await user.click(button);

  // Dispatch custom events
  dispatchCustomEvent(element, 'value-changed', { newValue: '100' });
});
```

## API Reference

### React Component Rendering

### `renderWithTheme(ui, options)`

Renders a component wrapped with MUI ThemeProvider.

**Parameters:**
- `ui` - React component to render
- `options.theme` - Custom MUI theme (optional, defaults to Material-UI default)
- `options...` - Additional options passed to RTL's `render()`

**Returns:** RTL render result

### `renderWithProviders(ui, options)`

Renders a component with MUI ThemeProvider and additional custom providers.

**Parameters:**
- `ui` - React component to render
- `options.theme` - Custom MUI theme (optional)
- `options.providers` - Array of provider components to wrap (optional)
- `options...` - Additional options passed to RTL's `render()`

**Returns:** RTL render result

### `createTestTheme(themeOptions)`

Creates a MUI theme for testing.

**Parameters:**
- `themeOptions` - MUI theme configuration object

**Returns:** MUI theme object

### `renderForSnapshot(component, options)`

Renders a component for snapshot testing (use sparingly).

**Parameters:**
- `component` - React component to render
- `options` - Same as `renderWithTheme`

**Returns:** Object with `container` property

### `waitForRemoval(callback)`

Alias for `waitForElementToBeRemoved` from RTL.

### Re-exports

This package re-exports everything from:
- `@testing-library/react` (render, screen, waitFor, etc.)
- `@testing-library/user-event` (as `userEvent`)
- `@testing-library/jest-dom` (for TypeScript support)

---

## Keyboard Helpers API

### `Keys` / `KeyCode`

Constants for common keyboard key codes:

```javascript
import { Keys, KeyCode } from '@pie-lib/test-utils';

Keys.ENTER      // 13
Keys.ESCAPE     // 27
Keys.SPACE      // 32
Keys.TAB        // 9
Keys.ARROW_DOWN // 40
Keys.ARROW_UP   // 38
// ... and more
```

### `pressKey(element, keyCode, type, options)`

Simulate keyboard event with keyCode (useful for legacy components):

```javascript
import { pressKey, Keys } from '@pie-lib/test-utils';

// Press Enter
pressKey(input, Keys.ENTER);

// Press Escape with keyup event
pressKey(dialog, Keys.ESCAPE, 'keyup');

// Press Ctrl+Enter
pressKey(input, Keys.ENTER, 'keydown', { ctrlKey: true });
```

**Why?** `userEvent.type()` with `{Enter}` doesn't work well with components checking `event.keyCode`.

### `typeAndSubmit(element, text)`

Type text and press Enter (common pattern):

```javascript
import { typeAndSubmit } from '@pie-lib/test-utils';

await typeAndSubmit(input, 'search query');
// Types "search query" and presses Enter
```

### `typeAndPressKey(element, text, keyCode)`

Type text and press any key:

```javascript
import { typeAndPressKey, Keys } from '@pie-lib/test-utils';

await typeAndPressKey(input, 'value', Keys.TAB);
```

### `clearAndType(element, text)`

Clear input and type new text:

```javascript
import { clearAndType } from '@pie-lib/test-utils';

await clearAndType(input, 'new value');
```

### `navigateWithKeys(element, steps, direction)`

Navigate with arrow keys:

```javascript
import { navigateWithKeys } from '@pie-lib/test-utils';

// Navigate down 3 items
navigateWithKeys(listbox, 3, 'vertical');

// Navigate left 2 items
navigateWithKeys(tabs, -2, 'horizontal');
```

---

## Web Component Helpers API

### `withinShadow(element, role, options)`

Query within shadow DOM by ARIA role:

```javascript
import { withinShadow } from '@pie-lib/test-utils';

const button = withinShadow(customElement, 'button');
const input = withinShadow(customElement, 'textbox', { name: 'Username' });
```

### `queryInShadow(element)`

Get all RTL queries scoped to shadow root:

```javascript
import { queryInShadow } from '@pie-lib/test-utils';

const { getByRole, getByText, getAllByRole } = queryInShadow(element);
const button = getByRole('button');
const heading = getByText('Welcome');
```

### `waitForCustomElement(tagName, timeout)`

Wait for custom element to be defined:

```javascript
import { waitForCustomElement } from '@pie-lib/test-utils';

await waitForCustomElement('my-component');
await waitForCustomElement('pie-chart', 5000); // 5 second timeout
```

### `renderWebComponent(tagName, attributes, properties, container)`

Render web component and wait for it to be ready:

```javascript
import { renderWebComponent } from '@pie-lib/test-utils';

const element = await renderWebComponent('pie-chart',
  { type: 'bar', 'data-testid': 'chart' },  // attributes
  { onDataChange: jest.fn() }               // properties
);
```

### `dispatchCustomEvent(element, eventName, detail, options)`

Dispatch custom event on element:

```javascript
import { dispatchCustomEvent } from '@pie-lib/test-utils';

dispatchCustomEvent(chart, 'data-changed', { value: [1, 2, 3] });
```

### `waitForEvent(element, eventName, timeout)`

Wait for custom event to be fired:

```javascript
import { waitForEvent } from '@pie-lib/test-utils';

const promise = waitForEvent(component, 'ready');
component.initialize();
const event = await promise;
expect(event.detail).toEqual({ initialized: true });
```

### `queryAllInShadow(element, selector)`

Query shadow DOM with CSS selector:

```javascript
import { queryAllInShadow } from '@pie-lib/test-utils';

const buttons = queryAllInShadow(component, 'button');
const inputs = queryAllInShadow(form, 'input[type="text"]');
```

### `hasShadowRoot(element)`

Check if element has shadow root:

```javascript
import { hasShadowRoot } from '@pie-lib/test-utils';

if (hasShadowRoot(element)) {
  // Test shadow DOM content
}
```

## Migration from Enzyme

### Before (Enzyme)

```javascript
import { shallow } from 'enzyme';

const wrapper = shallow(<Component />);
expect(wrapper.find('button')).toHaveLength(1);
wrapper.find('button').simulate('click');
```

### After (React Testing Library)

```javascript
import { renderWithTheme, screen, userEvent } from '@pie-lib/test-utils';

renderWithTheme(<Component />);
const button = screen.getByRole('button');
expect(button).toBeInTheDocument();
await userEvent.click(button);
```

## Query Priority

Use queries in this order (best to worst):

1. **getByRole** - Best for accessibility
2. **getByLabelText** - Good for form fields
3. **getByPlaceholderText** - Forms when label not available
4. **getByText** - Non-interactive content
5. **getByDisplayValue** - Current form values
6. **getByAltText** - Images
7. **getByTitle** - When other options don't work
8. **getByTestId** - Last resort

## Common Patterns

### Testing Forms

```javascript
import { renderWithTheme, screen, userEvent } from '@pie-lib/test-utils';

test('submits form', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();

  renderWithTheme(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Username'), 'user123');
  await user.type(screen.getByLabelText('Password'), 'pass123');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    username: 'user123',
    password: 'pass123'
  });
});
```

### Testing Conditional Rendering

```javascript
test('shows error message', async () => {
  renderWithTheme(<Component />);

  // Initially not present
  expect(screen.queryByText('Error')).not.toBeInTheDocument();

  // Trigger error
  await userEvent.click(screen.getByRole('button'));

  // Now appears
  expect(await screen.findByText('Error occurred')).toBeInTheDocument();
});
```

### Testing with Custom Props

```javascript
const defaultProps = {
  title: 'Test',
  onChange: jest.fn()
};

test('renders with defaults', () => {
  renderWithTheme(<Component {...defaultProps} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});

test('renders with overrides', () => {
  renderWithTheme(<Component {...defaultProps} title="Override" />);
  expect(screen.getByText('Override')).toBeInTheDocument();
});
```

## Tips

1. **Use `screen` queries** - More readable than destructuring from render
2. **Prefer `findBy` for async** - Built-in waiting
3. **Use `queryBy` for non-existence** - Won't throw if not found
4. **Test behavior, not implementation** - Don't test internal state
5. **Use `userEvent` over `fireEvent`** - More realistic interactions

## Learn More

- [React Testing Library Docs](https://testing-library.com/react)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [MUI Testing Guide](https://mui.com/material-ui/guides/testing/)
