import React from 'react';

export const defaultColor = `var(--math-input-calculator, #1A9CFF)`;

export default ({ children }) => (
  <svg
    x="0px"
    y="0px"
    width="100%"
    height="100%"
    viewBox="0 0 58 58"
    style={{ enableBackground: 'new 0 0 58 58' }}>
    {children}
  </svg>
);

export const styles = {
  root: {
    fill: 'none',
    stroke: defaultColor,
    strokeWidth: 2,
    strokeMiterlimit: 10,
  },
  fillOnly: {
    fill: defaultColor,
    stroke: 'none',
  }
}
