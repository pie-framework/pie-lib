# Material-UI v3 to MUI v5/v7 Migration Guide

## Overview
This guide documents the migration from Material-UI v3 (`@material-ui/*`) to MUI v7 (`@mui/*`) across the pie-lib monorepo.

## Package Changes

### Dependencies to Replace

#### Remove:
```json
"@material-ui/core": "^3.8.3"
"@material-ui/icons": "^3.0.2"
"@material-ui/styles": "^3.0.0-alpha.10"
```

#### Add:
```json
"@mui/material": "^7.3.4"
"@mui/icons-material": "^7.3.4"
"@emotion/react": "^11.14.0"
"@emotion/styled": "^11.11.0"
"@emotion/style": "^0.8.0"
```

### Affected Packages
All packages that use Material-UI components need updates:
- `@pie-lib/charting`
- `@pie-lib/config-ui`
- `@pie-lib/correct-answer-toggle`
- `@pie-lib/drag`
- `@pie-lib/editable-html`
- `@pie-lib/graphing`
- `@pie-lib/graphing-solution-set`
- `@pie-lib/icons`
- `@pie-lib/mask-markup`
- `@pie-lib/math-input`
- `@pie-lib/math-toolbar`
- `@pie-lib/plot`
- `@pie-lib/render-ui`
- `@pie-lib/rubric`
- `@pie-lib/scoring-config`
- `@pie-lib/text-select`
- `@pie-lib/tools`
- `@pie-lib/demo`

## Import Changes

### Component Imports

**Before (Material-UI v3):**
```javascript
import { Button, TextField, Dialog } from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { withStyles, makeStyles } from '@material-ui/core/styles';
```

**After (MUI v7):**
```javascript
import { Button, TextField, Dialog } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
// For makeStyles, migrate to styled components or sx prop
```

## Styling Migration

### 1. `withStyles` → `styled` or `sx` prop

**Before:**
```javascript
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    padding: '10px',
    backgroundColor: 'blue'
  }
};

export default withStyles(styles)(Component);
```

**After (Option 1 - styled components):**
```javascript
import { styled } from '@mui/material/styles';

const StyledComponent = styled('div')({
  padding: '10px',
  backgroundColor: 'blue'
});

// Or for existing components:
const StyledButton = styled(Button)({
  padding: '10px',
  backgroundColor: 'blue'
});
```

**After (Option 2 - sx prop):**
```javascript
<Component sx={{
  padding: '10px',
  backgroundColor: 'blue'
}} />
```

### 2. `makeStyles` → `styled` components

**Before:**
```javascript
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    padding: '10px'
  }
});

function Component() {
  const classes = useStyles();
  return <div className={classes.root}>Content</div>;
}
```

**After:**
```javascript
import { styled } from '@mui/material/styles';

const Root = styled('div')({
  padding: '10px'
});

function Component() {
  return <Root>Content</Root>;
}
```

### 3. Theme Access Changes

**Before:**
```javascript
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    color: theme.palette.primary.main
  }
}));
```

**After:**
```javascript
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.primary.main
}));
```

## Component API Changes

### Button Component
- `color` prop: Remove custom colors, use theme colors
- Ripple effects work differently

### TextField Component
- `variant="outlined"` is now default
- Some InputProps have changed

### Dialog Component
- `onClose` signature changed
- Backdrop props structure changed

### Popper Component
- `placement` options changed slightly
- `modifiers` API updated (now uses Popper.js v2)

### Icon Components
- Import paths changed from `@material-ui/icons` to `@mui/icons-material`
- Some icon names changed

## Theme Provider Migration

**Before:**
```javascript
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#1976d2' }
  }
});

<MuiThemeProvider theme={theme}>
  <App />
</MuiThemeProvider>
```

**After:**
```javascript
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }
  }
});

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## Emotion Cache Setup (for SSR - Next.js)

For Next.js applications, you need to set up Emotion cache:

**Create `createEmotionCache.js`:**
```javascript
import createCache from '@emotion/cache';

export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
```

**Update `_app.js`:**
```javascript
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createEmotionCache from '../source/createEmotionCache';

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
```

**Update `_document.js`:**
```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../source/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
```

## Common Breaking Changes

### 1. className prop changes
MUI v5+ uses different class names. If you were targeting MUI classes with custom CSS, you'll need to update selectors.

### 2. Props renaming
Some props have been renamed or removed. Check console warnings during development.

### 3. Typography variants
Some typography variants have been deprecated or renamed.

### 4. Color system
The color system has been enhanced. `color="default"` might need updates.

### 5. Box component
The Box component now uses the `sx` prop as its primary styling method.

## Testing Updates

### Jest Configuration
You may need to update Jest config to handle Emotion:

```javascript
// jest.config.js
module.exports = {
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@babel/runtime|@emotion)/)'
  ]
};
```

### Test Utilities
Update enzyme adapters and testing library imports if using custom renderers with theme providers.

## Gradual Migration Strategy

1. **Start with leaf components** - Components that don't depend on other internal components
2. **Update imports** - Change all @material-ui imports to @mui
3. **Update styling** - Convert withStyles/makeStyles to styled components or sx prop
4. **Test thoroughly** - Ensure visual appearance and functionality remain the same
5. **Update tests** - Fix any broken tests due to class name or structure changes
6. **Move to next component** - Repeat for each component

## Helpful Resources

- [MUI Migration Guide (v4 to v5)](https://mui.com/material-ui/migration/migration-v4/)
- [Emotion Documentation](https://emotion.sh/docs/introduction)
- [MUI Styling Documentation](https://mui.com/material-ui/customization/how-to-customize/)
- [Codemod Tool](https://github.com/mui/material-ui/tree/master/packages/mui-codemod) - Can automate some changes

## Common Issues and Solutions

### Issue: "Cannot read property 'pxToRem' of undefined"
**Solution:** Ensure theme is properly provided via ThemeProvider

### Issue: SSR hydration mismatch
**Solution:** Properly set up Emotion cache for SSR (see Emotion Cache Setup section)

### Issue: Custom theme not applying
**Solution:** Verify theme structure matches MUI v5+ format and ThemeProvider is correctly placed

### Issue: Icons not rendering
**Solution:** Check icon imports are from @mui/icons-material, not @material-ui/icons
