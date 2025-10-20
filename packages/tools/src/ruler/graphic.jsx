import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import UnitType from './unit-type';
import range from 'lodash/range';
import Unit from './unit';
import { strokeColor, fillColor } from '../style-utils';

const StyledBg = styled('rect')(({ theme }) => ({
  stroke: strokeColor(theme),
  strokeWidth: '2px',
  fill: fillColor(theme),
}));

const Bg = ({ width, height }) => <StyledBg width={width} height={height} cx={0} cy={0} />;

Bg.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export class Graphic extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    units: PropTypes.number.isRequired,
    unit: PropTypes.object.isRequired,
  };

  render() {
    const { width, height, units, unit } = this.props;
    const viewBox = `0 0 ${width} ${height}`;
    const unitWidth = width / units;
    const unitHeight = height;

    return (
      <svg viewBox={viewBox}>
        <Bg width={width} height={height} />
        <UnitType label={unit.type} />
        {range(1, units + 1).map((r) => (
          <Unit width={unitWidth} height={unitHeight} key={r} index={r} config={unit} last={r === units} />
        ))}
      </svg>
    );
  }
}

export default Graphic;
