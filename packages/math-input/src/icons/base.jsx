import React from 'react';
import PropTypes from 'prop-types';

export const defaultColor = 'var(--math-input-calculator, #1A9CFF)';

const Base = ({ children }) => (
  <svg
    x="0px"
    y="0px"
    width="100%"
    height="100%"
    viewBox="0 0 58 58"
    style={{ enableBackground: 'new 0 0 58 58' }}
  >
    {children}
  </svg>
);

Base.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
export default Base;

export const styles = {
  root: {
    fill: 'none',
    stroke: defaultColor,
    strokeWidth: 2,
    strokeMiterlimit: 10
  },
  fillOnly: {
    fill: defaultColor,
    stroke: 'none'
  },
  textIcon: {
    color: defaultColor,
    fontSize: '35px',
    fontWeight: '300',
    lineHeight: '48px'
  }
};
