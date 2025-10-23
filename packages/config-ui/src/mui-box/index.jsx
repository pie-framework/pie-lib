import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import debug from 'debug';

const log = debug('pie-elements:config-ui:mui-box');

const StyledMuiBox = styled('div')(({ theme, focused }) => {
  const light = theme.palette.mode === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';

  log(theme.palette.primary[theme.palette.mode || 'light']);

  return {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
      backgroundColor: bottomLineColor,
    },
    '&:hover:before': {
      height: '2px',
    },
    '&:after': {
      left: 0,
      right: 0,
      bottom: 0,
      height: '2px',
      content: '""',
      position: 'absolute',
      transform: focused ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
      pointerEvents: 'none',
      backgroundColor: theme.palette.primary[theme.palette.mode], //'#304ffe'
    },
  };
});

const MuiBox = ({ children, focused }) => {
  return <StyledMuiBox focused={focused}>{children}</StyledMuiBox>;
};

MuiBox.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  focused: PropTypes.bool.isRequired,
};

export default MuiBox;
