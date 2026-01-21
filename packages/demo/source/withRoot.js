import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Root from './root';

const theme = createTheme({});

export default function withRoot(Component) {
  const WithRoot = (props) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root gitInfo={process.env.gitInfo} links={process.env.links} packageInfo={process.env.packageInfo}>
        <Component {...props} />
      </Root>
    </ThemeProvider>
  );

  if (Component.getInitialProps) {
    WithRoot.getInitialProps = Component.getInitialProps;
  }

  return WithRoot;
}
