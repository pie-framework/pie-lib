import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import debug from 'debug';
import classNames from 'classnames';

const log = debug('pie-elements:config-ui:mui-box');

const MuiBox = withStyles(theme => {
  const light = theme.palette.type === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';

  log(theme.palette.primary[theme.palette.type || 'light']);

  return {
    muiBox: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      position: 'relative',
      '&:before': {
        left: 0,
        right: 0,
        bottom: 0,
        height: '1px',
        content: '""',
        position: 'absolute',
        transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        pointerEvents: 'none',
        backgroundColor: bottomLineColor
      },
      '&:hover:before': {
        height: '2px'
      },
      '&:after': {
        left: 0,
        right: 0,
        bottom: 0,
        height: '2px',
        content: '""',
        position: 'absolute',
        transform: 'scaleX(0)',
        transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        pointerEvents: 'none',
        backgroundColor: theme.palette.primary[theme.palette.type] //'#304ffe'
      }
    },
    focused: {
      '&:after': {
        transform: 'scaleX(1)'
      }
    },
  }
})(({ children, classes, focused }) => {
  const names = classNames(classes.muiBox, focused && classes.focused);
  return (
    <div className={names}>
      {children}
    </div>
  )
});

MuiBox.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  focused: PropTypes.bool.isRequired
}

export default MuiBox;
