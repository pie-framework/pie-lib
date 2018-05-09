import IconButton from 'material-ui/IconButton';
import React from 'react';
import PropTypes from 'prop-types';

export const OverrideIconButton = props => (
  <IconButton
    tabIndex={'-1'}
    classes={{ root: props.classes.root, label: props.classes.label }}
  >
    {props.children}
  </IconButton>
);

OverrideIconButton.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export const buttonStyle = () => ({
  root: {
    borderRadius: '0',
    marginRight: '5px',
    marginBottom: '0px',
    width: '100%'
  },
  label: {
    display: 'block'
  }
});
