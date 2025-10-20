import React from 'react';
import PropTypes from 'prop-types';
import { noSelect, strokeColor } from '../style-utils';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
  ...noSelect(),
  fill: strokeColor(theme),
}));

export const UnitType = (props) => {
  const { label, x, y, textAlign, fill, fontSize, stroke } = props;

  return (
    <StyledText
      x={x}
      y={y}
      textAnchor={textAlign}
      stroke={stroke}
      fill={fill}
      fontSize={fontSize}
    >
      {label}
    </StyledText>
  );
};

UnitType.propTypes = {
  label: PropTypes.string.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  textAlign: PropTypes.string,
  fill: PropTypes.string,
  fontSize: PropTypes.number,
  stroke: PropTypes.string,
};

UnitType.defaultProps = {
  textAnchor: 'start',
  fontSize: 11,
  stroke: 'none',
  x: 8,
  y: 14,
};

export default UnitType;
