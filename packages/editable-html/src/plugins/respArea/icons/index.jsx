import React from 'react';
import PropTypes from 'prop-types';
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

export const Chevron = props => {
  const { direction, style } = props;
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

Chevron.propTypes = {
  direction: PropTypes.string,
  style: PropTypes.object
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

GripIcon.propTypes = {
  style: PropTypes.object
};

export const ToolbarIcon = withStyles({
  icon: {
    fontFamily: 'Cerebri Sans !important',
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '14px',
    position: 'relative',
    top: '7px',
    width: '110px',
    height: '28px',
    whiteSpace: 'nowrap'
  }
})(({ classes }) => <div className={classes.icon}>+ Response Area</div>);
