import React from 'react';
import PropTypes from 'prop-types';

export const Section = ({ name, children }) => (
  <div>
    <h1>{name}</h1>
    <div>{children}</div>
  </div>
)

Section.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Section;