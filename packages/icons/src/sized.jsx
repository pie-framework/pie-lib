import React from 'react';
import { normalizeSize } from './icon-root';
import PropTypes from 'prop-types';

const Sized = ({ size, children }) => {
  size = normalizeSize(size);

  const style = {
    height: size,
    width: size,
    display: 'inline-block',
    position: 'relative'
  };

  return <div style={style}>{children}</div>;
};

Sized.propTypes = {
  size: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
export default Sized;
