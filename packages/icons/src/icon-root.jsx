import React from 'react';
import PropTypes from 'prop-types';
import Sized from './sized';

export const normalizeSize = (size) => {
  return typeof size === 'string' ? size : typeof size === 'number' ? `${size}px` : '30px';
};

export const IconRoot = ({ size, children, sx }) => (
  <Sized size={size}>
    <svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 44 40" style={{ enableBackground: 'new 0 0 44 40', ...sx }}>
      {children}
    </svg>
  </Sized>
);

IconRoot.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  sx: PropTypes.object,
};

// Feedback / shapes
export const Tick = ({ fill }) => (
  <polygon points="17.4,26.9 10.1,20.6 12.8,17.5 16.3,20.5 22.3,9.7 25.9,11.7" fill={fill} />
);

Tick.propTypes = { fill: PropTypes.string.isRequired };

export const SquareFeedbackBox = ({ fill }) => (
  <polygon transform="translate(2, 0)" points="34.1,28.6 34.1,2.2 2,2.2 2,34.3 40.1,34.3" fill={fill} />
);
SquareFeedbackBox.propTypes = { fill: PropTypes.string.isRequired };

export const RoundFeedbackBox = ({ fill }) => (
  <path
    transform="translate(1, 0)"
    d="M31.2,29.1v-0.3c2.2-2.8,3.6-6.3,3.6-10.1c0-8.9-7.2-16.1-16.1-16.1c-8.8,0.1-16,7.3-16,16.2 s7.2,16.1,16.1,16.1h18.5L31.2,29.1z"
    fill={fill}
  />
);
RoundFeedbackBox.propTypes = { fill: PropTypes.string.isRequired };

export const Circle = ({ fill }) => <circle transform="translate(-3,0)" cx="23" cy="20.4" r="16" fill={fill} />;
Circle.propTypes = { fill: PropTypes.string.isRequired };

export const Square = ({ fill }) => <rect x="3.6" y="4.1" width="32" height="32" fill={fill} />;
Square.propTypes = { fill: PropTypes.string.isRequired };

export const getStyles = (name, fg, bg) => ({
  bg: { fill: bg },
  fg: { fill: fg },
});
