import React from 'react';
import { getAdjustedX, getScale } from '../utils';

const DragIcon = ({ width, scaleValue, color, classes }) => (
  <svg
    x={getAdjustedX(width, scaleValue)}
    y={getScale(width)?.deltay}
    color={color}
    width={width}
    height={width}
    overflow="visible"
    viewBox={`0 0 ${width} ${width}`}
    className={classes.svgOverflowVisible}
  >
    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" transform={`scale(${scaleValue})`}>
      <circle cx="28.5" cy="23.5" r="22" fill="white" stroke="currentColor" />
      <path
        d="M33.5 21.25H23.4609C22.7578 21.25 22.4062 20.4297 22.9141 19.9219L27.9141 14.9219C28.2266 14.6094 28.7344 14.6094 29.0469 14.9219L34.0469 19.9219C34.5547 20.4297 34.2031 21.25 33.5 21.25Z"
        fill="currentColor"
      />
      <path
        d="M23.5 25.75L33.5391 25.75C34.2422 25.75 34.5938 26.5703 34.0859 27.0781L29.0859 32.0781C28.7734 32.3906 28.2656 32.3906 27.9531 32.0781L22.9531 27.0781C22.4453 26.5703 22.7969 25.75 23.5 25.75Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

export default DragIcon;
