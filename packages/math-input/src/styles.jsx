import IconButton from '@material-ui/core/IconButton';
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
    padding: 0,
    width: '48px',
    height: '48px'
  },
  label: {
    display: 'block'
  }
});
