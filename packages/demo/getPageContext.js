'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = getPageContext;

var _jss = require('jss');

var _styles = require('@material-ui/core/styles');

/* eslint-disable no-underscore-dangle */
var theme = (0, _styles.createMuiTheme)({});

function createPageContext() {
  return {
    theme: theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new _jss.SheetsRegistry(),
    // The standard class name generator.
    generateClassName: (0, _styles.createGenerateClassName)(),
  };
}

function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  // eslint-disable-next-line
  if (!process.browser) {
    return createPageContext();
  } // Reuse context on the client-side.

  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
//# sourceMappingURL=getPageContext.js.map
