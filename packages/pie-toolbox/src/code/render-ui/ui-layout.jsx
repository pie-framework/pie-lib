import React from 'react';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppendCSSRules from './append-css-rules';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'inherit',
  },
  palette: {
    action: {
      disabled: 'rgba(0, 0, 0, 0.54);',
    },
  },
  overrides: {
    MuiTypography: {
      root: { fontFamily: 'inherit' },
    },
    MuiRadio: {
      root: {
        '&$checked': {
          color: '#3f51b5 !important',
        },
      },
    },
    MuiCheckbox: {
      root: {
        '&$checked': {
          color: '#3f51b5 !important',
        },
      },
    },
    MuiTabs: {
      root: {
        borderBottom: '1px solid #eee',
      },
    },
    MuiSwitch: {
      root: {
        '&$checked': {
          color: '#3f51b5 !important',
          '& + $bar': {
            backgroundColor: '#3f51b5 !important',
            opacity: 0.5,
          },
        },
      },
    },
  },
});

class UiLayout extends AppendCSSRules {
  static propTypes = {
    classes: PropTypes.object,
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
    const { children, className, classes, fontSizeFactor, ...rest } = this.props;

    const finalClass = classNames(className, classes.extraCSSRules, classes.uiLayoutContainer);
    const { extraCSSRules, ...restProps } = rest;
    const style = this.computeStyle(fontSizeFactor);

    return (
      <MuiThemeProvider theme={theme}>
        <div className={finalClass} {...restProps} {...(style && { style })}>
          {children}
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  extraCSSRules: {},
  // need this because some browsers set their own style on table
  uiLayoutContainer: {
    '& table, th, td': {
      fontSize: 'inherit' /* Ensure table elements inherit font size */,
    },
  },
};

const Styled = withStyles(styles)(UiLayout);

export default Styled;
