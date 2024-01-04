import React from 'react';
import PropTypes from 'prop-types';
import { types } from '../plot';
import { color } from '../render-ui';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { roundNumber } from './utils';

const styles = (theme) => ({
  input: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    borderRadius: '8px',
    background: theme.palette.common.white,
    color: color.defaults.PRIMARY_DARK,
  },
  inputLabel: {
    padding: 0,
  },
});

export const getLabelPosition = (graphProps, x, y, labelLength) => {
  const { scale, domain, range } = graphProps;
  // treat corner cases for maximum and minimum
  const topShift = y === range.min ? 16 : y === range.max ? 0 : 8;
  const leftShift = 10;
  const rightEdge = scale.x(x) + labelLength + leftShift;

  if (rightEdge >= scale.x(domain.max)) {
    return {
      left: scale.x(x) - leftShift - labelLength,
      top: scale.y(y) - topShift,
    };
  }

  return {
    left: scale.x(x) + leftShift,
    top: scale.y(y) - topShift,
  };
};

export const CoordinatesLabel = ({ x, y, graphProps, classes }) => {
  const label = `(${roundNumber(x)}, ${roundNumber(y)})`;
  const labelLength = (label.length || 0) * 6;
  const labelPosition = getLabelPosition(graphProps, x, y, labelLength);

  const style = {
    position: 'absolute',
    pointerEvents: 'auto',
    width: labelLength,
    padding: 0,
    ...labelPosition,
  };

  return (
    <InputBase
      style={style}
      classes={{ input: classes.inputLabel }}
      className={classes.input}
      value={label}
      inputProps={{ ariaLabel: 'naked' }}
    />
  );
};

CoordinatesLabel.propTypes = {
  graphProps: types.GraphPropsType,
  classes: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default withStyles(styles)(CoordinatesLabel);
