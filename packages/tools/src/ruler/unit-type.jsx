import React from 'react';
import PropTypes from 'prop-types';
import { noSelect, strokeColor } from '../style-utils';
import { withStyles } from '@material-ui/core/styles';

export const UnitType = props => {
  const { classes, label, x, y, textAlign, fill, fontSize, stroke } = props;

  return (
    <text
      className={classes.unitType}
      x={x}
      y={y}
      textAnchor={textAlign}
      stroke={stroke}
      fill={fill}
      fontSize={fontSize}
    >
      {label}
    </text>
  );
};

UnitType.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  textAlign: PropTypes.string,
  fill: PropTypes.string,
  fontSize: PropTypes.number,
  stroke: PropTypes.string
};

UnitType.defaultProps = {
  textAnchor: 'start',
  fontSize: 11,
  stroke: 'none',
  x: 8,
  y: 14
};

export default withStyles(theme => ({
  unitType: { ...noSelect(), fill: strokeColor(theme) }
}))(UnitType);
