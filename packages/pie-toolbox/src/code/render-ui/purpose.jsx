import PropTypes from 'prop-types';
import React from 'react';

const Purpose = (props) => {
  return (
    <>
      {React.Children.map(props.children, (child) => React.cloneElement(child, { 'data-pie-purpose': props.purpose }))}
    </>
  );
};

Purpose.propTypes = {
  children: PropTypes.node,
  purpose: PropTypes.string,
};

export default Purpose;
