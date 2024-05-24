import React from 'react';

const CorrectSVG = ({ scale, x, y }) => (
  <svg
    width="12px"
    height="9px"
    viewBox="0 0 12 9"
    fill="#ffffff"
    stroke="#ffffff"
    x={scale.x(x) - 6}
    y={scale.y(y) - 4.5}
    style={{ pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.1953 0.46875C10.3125 0.351562 10.5 0.351562 10.5938 0.46875L11.2734 1.125C11.3672 1.24219 11.3672 1.42969 11.2734 1.52344L4.24219 8.55469C4.125 8.67188 3.96094 8.67188 3.84375 8.55469L0.703125 5.4375C0.609375 5.32031 0.609375 5.13281 0.703125 5.03906L1.38281 4.35938C1.47656 4.26562 1.66406 4.26562 1.78125 4.35938L4.03125 6.63281L10.1953 0.46875Z"
      fill="white"
    />
  </svg>
);

export default CorrectSVG;
