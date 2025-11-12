// React 18 + React Testing Library setup

// Global jest-dom matchers (Jest 29+ supports this properly!)
// This means we don't need to import '@testing-library/jest-dom' in each test file
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for Jest 29 + jsdom
// Required for slate-html-serializer and other packages using encoding APIs
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia (required for MUI components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver (required for many modern components)
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver (may be needed by some components)
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
  takeRecords() {
    return [];
  }
};

// Mock MutationObserver (required for components that observe DOM changes)
global.MutationObserver = class MutationObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  takeRecords() {
    return [];
  }
};

// Mock scrollIntoView (not implemented in jsdom)
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = jest.fn();
}

// Mock createRange (required for @testing-library/user-event)
if (!document.createRange) {
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
    cloneContents: () => document.createDocumentFragment(),
    cloneRange: () => document.createRange(),
    collapse: () => {},
    compareBoundaryPoints: () => 0,
    comparePoint: () => 0,
    createContextualFragment: (html) => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.childNodes[0];
    },
    deleteContents: () => {},
    detach: () => {},
    extractContents: () => document.createDocumentFragment(),
    getBoundingClientRect: () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }),
    getClientRects: () => [],
    insertNode: () => {},
    intersectsNode: () => true,
    isPointInRange: () => false,
    selectNode: () => {},
    selectNodeContents: () => {},
    setEndAfter: () => {},
    setEndBefore: () => {},
    setStartAfter: () => {},
    setStartBefore: () => {},
    surroundContents: () => {},
    toString: () => '',
  });
}

// Mock getSelection (required for @testing-library/user-event)
if (!document.getSelection) {
  document.getSelection = () => ({
    addRange: () => {},
    removeAllRanges: () => {},
    removeRange: () => {},
    getRangeAt: () => document.createRange(),
    toString: () => '',
    rangeCount: 0,
    isCollapsed: true,
    type: 'None',
    anchorNode: null,
    anchorOffset: 0,
    focusNode: null,
    focusOffset: 0,
  });
}

// Mock XMLHttpRequest for speech-rule-engine locale loading
// This prevents errors when speech-rule-engine tries to load locale files
const originalXHR = global.XMLHttpRequest;
global.XMLHttpRequest = class XMLHttpRequestMock extends originalXHR {
  constructor() {
    super();
    // Ensure document and URL are available
    if (!this._ownerDocument) {
      Object.defineProperty(this, '_ownerDocument', {
        value: { URL: 'http://localhost' },
        writable: true,
      });
    }
  }

  open(method, url) {
    // Prevent loading external locale files in tests
    if (url && url.includes('/locales/')) {
      this.mockResponse = true;
      return;
    }
    try {
      return super.open(method, url);
    } catch (e) {
      // Swallow errors for locale file loading
      this.mockResponse = true;
    }
  }

  send() {
    if (this.mockResponse) {
      // Mock successful empty response for locale files
      setTimeout(() => {
        Object.defineProperty(this, 'status', { value: 200 });
        Object.defineProperty(this, 'response', { value: '{}' });
        Object.defineProperty(this, 'responseText', { value: '{}' });
        if (this.onload) this.onload();
      }, 0);
      return;
    }
    try {
      return super.send();
    } catch (e) {
      // Swallow errors
    }
  }
};

// Suppress console errors/warnings in tests (optional - comment out if you want to see them)
// const originalError = console.error;
// const originalWarn = console.warn;
// beforeAll(() => {
//   console.error = jest.fn((...args) => {
//     // Only show errors that are not React warnings
//     if (typeof args[0] === 'string' && args[0].includes('Warning:')) return;
//     originalError.call(console, ...args);
//   });
//   console.warn = jest.fn();
// });
// afterAll(() => {
//   console.error = originalError;
//   console.warn = originalWarn;
// });
