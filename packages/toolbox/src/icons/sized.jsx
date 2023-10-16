import React from 'react';
import PropTypes from 'prop-types';

export const normalizeSize = (size) => {
  return typeof size === 'string' ? size : typeof size === 'number' ? `${size}px` : '30px';
};

const Sized = ({ size, children }) => {
  size = normalizeSize(size);

  const style = {
    height: size,
    width: size,
    display: 'inline-block',
    position: 'relative',
  };

  return <div style={style}>{children}</div>;
};

Sized.propTypes = {
  size: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
export default Sized;
