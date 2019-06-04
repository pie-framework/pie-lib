import React from 'react';
import PropTypes from 'prop-types';

export const ArrowHead = ({ size, transform }) => (
  <polygon points={`0,0 ${size},${size / 2} 0,${size}`} transform={transform} />
);
ArrowHead.propTypes = {
  size: PropTypes.number,
  transform: PropTypes.string
};
ArrowHead.defaultProps = {
  size: 10,
  transform: ''
};
