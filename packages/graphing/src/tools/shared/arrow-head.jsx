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
export const genUid = () => {
  const v = (Math.random() * 1000).toFixed(0);
  return `arrow-${v}`;
};
export const ArrowMarker = ({ id, size, className }) => {
  return (
    <marker
      id={id}
      viewBox={`0 0 ${size} ${size}`}
      refX={size / 2}
      refY={size / 2}
      markerWidth={size}
      markerHeight={size}
      orient="auto-start-reverse"
      className={className}
    >
      <ArrowHead size={size} />
    </marker>
  );
};
ArrowMarker.propTypes = {
  id: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string
};
ArrowMarker.defaultProps = {
  size: 5
};
