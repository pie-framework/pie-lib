/* eslint-disable no-underscore-dangle */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({});

function createPageContext() {
  return {
    theme,
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  // eslint-disable-next-line
  if (typeof window === 'undefined') {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
