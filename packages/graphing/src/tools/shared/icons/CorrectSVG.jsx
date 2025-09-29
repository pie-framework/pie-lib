import React from 'react';

const CorrectSVG = ({ scale, x, y }) => (
  <svg
    width="11"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    stroke="#ffffff"
    x={scale.x(x) - 5}
    y={scale.y(y) - 6}
    style={{ pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.1953 2.46875C10.3125 2.35156 10.5 2.35156 10.5938 2.46875L11.2734 3.125C11.3672 3.24219 11.3672 3.42969 11.2734 3.52344L4.24219 10.5547C4.125 10.6719 3.96094 10.6719 3.84375 10.5547L0.703125 7.4375C0.609375 7.32031 0.609375 7.13281 0.703125 7.03906L1.38281 6.35938C1.47656 6.26562 1.66406 6.26562 1.78125 6.35938L4.03125 8.63281L10.1953 2.46875Z"
      fill="white"
    />
  </svg>
);

export default CorrectSVG;
