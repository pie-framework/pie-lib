import React from 'react';
import { withStyles } from '@material-ui/core/styles';

export const Chevron = (props) => {
  const { direction, style } = props;
  const rotate = (() => {
    switch (direction) {
      case 'down':
        return 90;
      case 'up':
        return -90;
      case 'left':
        return 180;
      default:
        return 0;
    }
  })();

  return (
    <svg
      style={{
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
    </svg>
  );
};

export const GripIcon = ({ style }) => (
  <span style={style}>
    <svg
      style={{
        margin: '0 -16px',
      }}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 3H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-16h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    </svg>
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-16h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    </svg>
  </span>
);

const styles = (theme) => ({
  icon: {
    fontFamily: 'Cerebri Sans !important',
    fontSize: theme.typography.fontSize,
    fontWeight: 'bold',
    lineHeight: '14px',
    position: 'relative',
    top: '7px',
    width: '110px',
    height: '28px',
    whiteSpace: 'nowrap',
  },
});

export const ToolbarIcon = withStyles(styles)(({ classes }) => <div className={classes.icon}>+ Response Area</div>);
