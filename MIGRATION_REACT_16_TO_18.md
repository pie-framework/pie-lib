# React 16 to React 18 Migration Guide

## Overview
This guide documents the migration from React 16.8.x to React 18.2.0 across the pie-lib monorepo, including necessary test configuration updates.

## Package Changes

### Core Dependencies

**Before:**
```json
"react": "^16.8.6",
"react-dom": "^16.8.6"
```

**After:**
```json
"react": "^18.2.0",
"react-dom": "^18.2.0"
```

### Testing Library Updates

**Before:**
```json
"enzyme": "^3.10.0",
"enzyme-adapter-react-16": "^1.14.0",
"enzyme-to-json": "^3.3.5"
```

**After:**
```json
"@testing-library/react": "^16.3.0",
"@testing-library/jest-dom": "^5.16.5",
"@testing-library/dom": "^10.4.1",
"@testing-library/react-hooks": "^8.0.1"
```

**Note:** React 18 is not officially supported by Enzyme. Migration to React Testing Library is required.

## Breaking Changes

### 1. ReactDOM.render → createRoot

**Before (React 16):**
```javascript
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

**After (React 18):**
```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. ReactDOM.hydrate → hydrateRoot

**Before (React 16):**
```javascript
import ReactDOM from 'react-dom';

ReactDOM.hydrate(<App />, document.getElementById('root'));
```

**After (React 18):**
```javascript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

### 3. Unmounting

**Before (React 16):**
```javascript
ReactDOM.unmountComponentAtNode(container);
```

**After (React 18):**
```javascript
root.unmount();
```

## New Features in React 18

### 1. Automatic Batching
React 18 automatically batches state updates in promises, setTimeout, native event handlers, etc.

**Example:**
```javascript
// React 18 automatically batches these
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end
}, 1000);
```

If you need to opt-out of automatic batching:
```javascript
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(c => c + 1);
});
// React has updated the DOM by now
flushSync(() => {
  setFlag(f => !f);
});
```

### 2. Transitions
Use `useTransition` or `startTransition` for non-urgent updates:

```javascript
import { useTransition } from 'react';

function Component() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);

    // Mark expensive state update as transition
    startTransition(() => {
      setList(generateLargeList(e.target.value));
    });
  };

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending ? <Spinner /> : <List items={list} />}
    </>
  );
}
```

### 3. useDeferredValue
Defer re-rendering non-urgent parts of the tree:

```javascript
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);

  // This will use the deferred value
  return <ExpensiveList query={deferredQuery} />;
}
```

### 4. useId
Generate unique IDs that work with SSR:

```javascript
import { useId } from 'react';

function PasswordField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>Password:</label>
      <input id={id} type="password" />
    </>
  );
}
```

## Component API Changes

### StrictMode

React 18's StrictMode adds new checks:
- Components are double-invoked in development to detect side effects
- Effects are mounted → unmounted → remounted to ensure cleanup

**Impact:** You may see effects fire twice in development. This is intentional.

**Example:**
```javascript
useEffect(() => {
  // This runs twice in development (StrictMode)
  // But once in production
  console.log('Effect ran');

  return () => {
    console.log('Cleanup ran');
  };
}, []);
```

### Suspense

Suspense for data fetching is now stable:

```javascript
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <DataComponent />
</Suspense>
```

## Testing Migration (Enzyme → React Testing Library)

### Setup Changes

#### Remove Enzyme Setup

**Remove from `jest.setup.js`:**
```javascript
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
```

#### Add React Testing Library Setup

**Add to `jest.setup.js`:**
```javascript
import '@testing-library/jest-dom';

// Optional: add custom matchers
expect.extend({
  // custom matchers here
});

// Mock window.matchMedia (if needed for MUI components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Test Pattern Migration

#### 1. Component Rendering

**Before (Enzyme):**
```javascript
import { shallow, mount } from 'enzyme';

describe('Component', () => {
  it('renders', () => {
    const wrapper = shallow(<Component />);
    expect(wrapper.find('.class-name')).toHaveLength(1);
  });
});
```

**After (React Testing Library):**
```javascript
import { render, screen } from '@testing-library/react';

describe('Component', () => {
  it('renders', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

#### 2. Finding Elements

**Before (Enzyme):**
```javascript
wrapper.find('.button');
wrapper.find(Button);
wrapper.find('#id');
```

**After (React Testing Library):**
```javascript
screen.getByRole('button');
screen.getByText('Click me');
screen.getByLabelText('Username');
screen.getByTestId('custom-element');
```

**Query Priority (Prefer in this order):**
1. `getByRole` - Best for accessibility
2. `getByLabelText` - Forms
3. `getByPlaceholderText` - Forms (less preferred)
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

#### 3. Simulating Events

**Before (Enzyme):**
```javascript
wrapper.find('button').simulate('click');
wrapper.find('input').simulate('change', {
  target: { value: 'new value' }
});
```

**After (React Testing Library):**
```javascript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(screen.getByRole('button'));
await user.type(screen.getByRole('textbox'), 'new value');
```

**Or using fireEvent (for simple cases):**
```javascript
import { fireEvent } from '@testing-library/react';

fireEvent.click(screen.getByRole('button'));
fireEvent.change(screen.getByRole('textbox'), {
  target: { value: 'new value' }
});
```

#### 4. Checking Component Props/State

**Before (Enzyme):**
```javascript
expect(wrapper.prop('disabled')).toBe(true);
expect(wrapper.state('count')).toBe(5);
```

**After (React Testing Library):**
```javascript
// Test behavior and output, not implementation details
const button = screen.getByRole('button');
expect(button).toBeDisabled();

// Instead of checking state, test what the user sees
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

#### 5. Async Testing

**Before (Enzyme):**
```javascript
const wrapper = mount(<AsyncComponent />);
await waitFor(() => wrapper.update());
expect(wrapper.find('.loaded')).toHaveLength(1);
```

**After (React Testing Library):**
```javascript
render(<AsyncComponent />);
const loadedElement = await screen.findByText('Loaded');
expect(loadedElement).toBeInTheDocument();

// Or using waitFor:
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

#### 6. Testing Hooks

**Before (custom solution or enzyme):**
```javascript
// Complex setup required
```

**After (React Testing Library):**
```javascript
import { renderHook } from '@testing-library/react';

test('useCounter', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

#### 7. Testing with Context/Providers

**Before (Enzyme):**
```javascript
const wrapper = mount(
  <ThemeProvider theme={theme}>
    <Component />
  </ThemeProvider>
);
```

**After (React Testing Library):**
```javascript
function renderWithProviders(ui, options = {}) {
  const { theme = defaultTheme, ...renderOptions } = options;

  function Wrapper({ children }) {
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Usage:
renderWithProviders(<Component />);
```

### Common Test Patterns

#### Waiting for elements to appear:
```javascript
// Wait for element to appear
const element = await screen.findByText('Loaded');

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
```

#### Testing error states:
```javascript
// Use queryBy for elements that might not exist
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// After error occurs
await waitFor(() => {
  expect(screen.getByText('Error occurred')).toBeInTheDocument();
});
```

#### Debugging tests:
```javascript
import { screen } from '@testing-library/react';

// Print the current DOM
screen.debug();

// Print a specific element
screen.debug(screen.getByRole('button'));
```

## Jest Configuration Updates

### Update jest.config.js

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@babel/runtime|@emotion|@testing-library)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ]
};
```

## TypeScript Changes

### Update @types packages

```json
"@types/react": "^18.2.0",
"@types/react-dom": "^18.2.0"
```

### Type Changes

#### Function Components

**Before:**
```typescript
import React, { FC } from 'react';

const Component: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
```

**After (FC no longer includes children by default):**
```typescript
import React from 'react';

// Option 1: Explicitly add children to props
interface Props {
  children?: React.ReactNode;
}

const Component = ({ children }: Props) => {
  return <div>{children}</div>;
};

// Option 2: Use PropsWithChildren
import { PropsWithChildren } from 'react';

const Component = ({ children }: PropsWithChildren<Props>) => {
  return <div>{children}</div>;
};
```

## Next.js Specific Changes

### Update next.config.js

For Next.js 15 with React 18:

```javascript
module.exports = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for faster builds

  // If using CSS modules
  webpack: (config) => {
    // Custom webpack config
    return config;
  }
};
```

### Update _app.js

```javascript
import { useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createEmotionCache from '../lib/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
```

## Common Issues and Solutions

### Issue: "Warning: ReactDOM.render is no longer supported"
**Solution:** Update to use `createRoot` from 'react-dom/client'

### Issue: "Warning: useLayoutEffect does nothing on the server"
**Solution:** Create a custom hook:
```javascript
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
```

### Issue: Tests failing with "Not wrapped in act(...)"
**Solution:** Use async utilities from Testing Library:
```javascript
// Use findBy queries which wait automatically
await screen.findByText('Loaded');

// Or wrap in waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Issue: "Cannot find module '@testing-library/react'"
**Solution:** Ensure you've updated your jest.config.js transformIgnorePatterns

### Issue: Enzyme tests completely broken
**Solution:** Migrate to React Testing Library. Enzyme doesn't support React 18.

## Concurrent Features (Optional)

React 18 enables concurrent features, but they're opt-in:

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'), {
  // Enable concurrent features
  unstable_strictMode: true,
  unstable_concurrentUpdatesByDefault: true
});

root.render(<App />);
```

## Migration Checklist

- [ ] Update React and ReactDOM to 18.2.0
- [ ] Update @types/react and @types/react-dom if using TypeScript
- [ ] Replace ReactDOM.render with createRoot
- [ ] Replace ReactDOM.hydrate with hydrateRoot (if using SSR)
- [ ] Update jest.config.js for new testing library
- [ ] Remove Enzyme dependencies
- [ ] Install React Testing Library packages
- [ ] Update jest.setup.js to remove Enzyme, add RTL
- [ ] Migrate all Enzyme tests to React Testing Library
- [ ] Test in StrictMode - fix any warnings
- [ ] Update Next.js configuration (if applicable)
- [ ] Review and utilize new React 18 features where beneficial

## Resources

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js 15 Documentation](https://nextjs.org/docs)
