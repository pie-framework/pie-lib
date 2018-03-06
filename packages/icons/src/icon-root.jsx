import React from 'react';
import PropTypes from 'prop-types';
import Sized from './sized';

export const normalizeSize = (size) => {
  return typeof size === 'string' ? size : (typeof size === 'number' ? `${size}px` : '30px');
}

export const IconRoot = ({ size, children }) => (
  <Sized size={size}>
    <svg
      preserveAspectRatio="xMinYMin meet"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 44 40"
      style={{ enableBackground: 'new 0 0 44 40' }
      } > {children}</ svg>
  </Sized>
);


IconRoot.propTypes = {
  size: PropTypes.oneOf([PropTypes.string, PropTypes.number])
}


const colors = {
  green: '#4aaf46',
  white: '#f8ffe2'
}

export const getStyles = (name, fg, bg) => ({
  bg: {
    fill: `var(--icons-${name}-bg, ${bg})`
  },
  fg: {
    fill: `var(--icons-${name}-fg, ${fg})`
  }
});

export const Tick = ({ className }) => (
  <polygon
    className={className}
    points="17.4,26.9 10.1,20.6 12.8,17.5 16.3,20.5 22.3,9.7 25.9,11.7" />
)

export const SquareFeedbackBox = ({ className }) => (
  <polygon
    transform="translate(2, 0)"
    className={className}
    points="34.1,28.6 34.1,2.2 2,2.2 2,34.3 40.1,34.3" />);

export const RoundFeedbackBox = ({ className }) => (
  <path
    transform="translate(1, 0)"
    className={className}
    d="M31.2,29.1v-0.3c2.2-2.8,3.6-6.3,3.6-10.1c0-8.9-7.2-16.1-16.1-16.1c-8.8,0.1-16,7.3-16,16.2 s7.2,16.1,16.1,16.1h18.5L31.2,29.1z" />
);

export const Circle = ({ className }) => (
  <circle
    transform="translate(-3, 0)"
    className={className}
    cx="23" cy="20.4" r="16" />
)

export const Square = ({ className }) => (
  <rect
    x="3.6"
    y="4.1" className={className} width="32" height="32" />
)
