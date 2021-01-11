import PropTypes from 'prop-types';
import React from 'react';

const Readable = props => {
  return (
    <>
      {React.Children.map(props.children, child =>
        React.cloneElement(child, { 'data-pie-readable': props.false === undefined })
      )}
    </>
  );
};

Readable.propTypes = {
  children: PropTypes.node,
  false: PropTypes.bool
};

export default Readable;
