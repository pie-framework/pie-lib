import React from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppendCSSRules from './append-css-rules';

const theme = createTheme({
  typography: {
    fontFamily: 'inherit',
  },
  palette: {
    action: {
      disabled: 'rgba(0, 0, 0, 0.54);',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: { fontFamily: 'inherit' },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#3f51b5 !important',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#3f51b5 !important',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #eee',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#3f51b5 !important',
            '& + .MuiSwitch-track': {
              backgroundColor: '#3f51b5 !important',
              opacity: 0.5,
            },
          },
        },
      },
    },
  },
});

const StyledContainer = styled('div')({
  // need this because some browsers set their own style on table
  '& table, th, td': {
    fontSize: 'inherit' /* Ensure table elements inherit font size */,
  },
});

class UiLayout extends AppendCSSRules {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.array,
    extraCSSRules: PropTypes.shape({
      names: PropTypes.arrayOf(PropTypes.string),
      rules: PropTypes.string,
    }),
    fontSizeFactor: PropTypes.number,
  };

  static defaultProps = {
    extraCSSRules: {},
    fontSizeFactor: 1,
  };

  constructor(props) {
    super(props);
    this.classesSheet = document.createElement('style');
  }

  computeStyle(fontSizeFactor) {
    const getFontSize = (element) => parseFloat(getComputedStyle(element).fontSize);

    const rootFontSize = getFontSize(document.documentElement);
    const bodyFontSize = getFontSize(document.body);
    const effectiveFontSize = Math.max(rootFontSize, bodyFontSize);

    return fontSizeFactor !== 1 ? { fontSize: `${effectiveFontSize * fontSizeFactor}px` } : null;
  }

  render() {
    const { children, className, fontSizeFactor, ...rest } = this.props;

    const { extraCSSRules, ...restProps } = rest;
    const style = this.computeStyle(fontSizeFactor);

    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <StyledContainer className={className} {...restProps} {...(style && { style })}>
            {children}
          </StyledContainer>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default UiLayout;
