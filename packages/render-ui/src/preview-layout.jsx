import React from 'react';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

class PreviewLayout extends React.Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    classes: PropTypes.object,
    role: PropTypes.string,
  };

  render() {
    const { children, classes, ariaLabel, role } = this.props;
    const accessibility = ariaLabel ? { 'aria-label': ariaLabel, role } : {};

    return (
      <div className={classes.container} {...accessibility}>
        {children}
      </div>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    action: {
      disabled: 'rgba(0, 0, 0, 0.54);',
    },
  },
  overrides: {
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

const Styled = withStyles(styles)(PreviewLayout);

const RootElem = (props) => (
  <MuiThemeProvider theme={theme}>
    <Styled {...props} />
  </MuiThemeProvider>
);

export default RootElem;
