import React from 'react';

const IncorrectSVG = ({ scale, x, y }) => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2"
    x={scale.x(x) - 7}
    y={scale.y(y) - 7}
    style={{ pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.705 7.705l-1.41-1.41L12 10.59 7.705 6.295l-1.41 1.41L10.59 12l-4.295 4.295 1.41 1.41L12 13.41l4.295 4.295 1.41-1.41L13.41 12l4.295-4.295z"></path>
  </svg>
);

export default IncorrectSVG;
