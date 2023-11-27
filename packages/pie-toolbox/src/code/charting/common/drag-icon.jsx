import React from 'react';
import { getAdjustedX, getScale } from '../utils';

const DragIcon = ({ width, scaleValue, color }) => (
  <svg
    x={getAdjustedX(width, scaleValue)}
    y={getScale(width)?.deltay}
    color={color}
    overflow="visible"
    filter="url(#svgDropShadow)"
    style={{ overflow: 'visible !important' }}
  >
    <defs>
      <filter id="svgDropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="5" result="offsetblur" />
        <feFlood floodColor="#00000033" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g
      xmlns="http://www.w3.org/2000/svg"
      filter="url(#filter0_d_2312_1804)"
      fill="currentColor"
      stroke="currentColor"
      transform={`scale(${scaleValue})`}
    >
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
