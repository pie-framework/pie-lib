import React from 'react';
import PropTypes from 'prop-types';

const Base = ({ children, className }) => (
  <svg
    x="0px"
    y="0px"
    width="100%"
    height="100%"
    viewBox="0 0 58 58"
    className={className}
    style={{ enableBackground: 'new 0 0 58 58' }}
  >
    {children}
  </svg>
);

Base.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  className: PropTypes.string
};

export default Base;

export const styles = theme => {
  const defaultColor = `var(--math-input-icon, ${
    theme.palette.secondary.main
  })`;
  return {
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
};
