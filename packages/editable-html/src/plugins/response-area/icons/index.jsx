import React from 'react';
import ChevronRight from '@material-ui/icons/ChevronRight';
import MoreVert from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';

const getRotate = direction => {
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
};

export const Chevron = ({ direction, style }) => {
  const rotate = getRotate(direction);

  return (
    <ChevronRight
      style={{
        transform: `rotate(${rotate}deg)`,
        ...style
      }}
    />
  );
};

export const GripIcon = ({ style }) => {
  return (
    <span style={style}>
      <MoreVert
        style={{
          margin: '0 -16px'
        }}
      />
      <MoreVert />
    </span>
  );
};

export const ToolbarIcon = withStyles({
  fontFamily: 'Cerebri Sans',
  fontSize: '14px',
  lineHeight: '14px',
  position: 'relative',
  top: '7px',
  width: '110px',
  height: '28px'
})(({ classes }) => <div className={classes.icon}>+ Response Area</div>);
