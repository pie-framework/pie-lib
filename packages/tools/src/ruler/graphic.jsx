import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import UnitType from './unit-type';
import range from 'lodash/range';
import Unit from './unit';
import { strokeColor, fillColor } from '../style-utils';

const Bg = ({ width, height, className }) => (
  <rect width={width} height={height} cx={0} cy={0} className={className} />
);

Bg.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired
};

export class Graphic extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    units: PropTypes.number.isRequired,
    unit: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  render() {
    const { width, height, classes, units, unit } = this.props;
    const viewBox = `0 0 ${width} ${height}`;
    const unitWidth = width / units;
    const unitHeight = height;

    return (
      <svg viewBox={viewBox}>
        <Bg width={width} height={height} className={classes.bg} />
        <UnitType label={unit.type} />
        {range(1, units + 1).map(r => (
          <Unit
            width={unitWidth}
            height={unitHeight}
            key={r}
            index={r}
            config={unit}
            last={r === units}
          />
        ))}
      </svg>
    );
  }
}
const styles = theme => ({
  bg: {
    stroke: strokeColor(theme),
    strokeWidth: '2px',
    fill: fillColor(theme)
  }
});

export default withStyles(styles)(Graphic);
