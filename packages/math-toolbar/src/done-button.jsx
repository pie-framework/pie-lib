import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const RawDoneButton = ({ classes, onClick, hideBackground }) => (
  <IconButton
    aria-label="Done"
    className={classes.iconRoot}
    onClick={onClick}
    classes={{
      label: classes.label,
      root: classNames(classes.iconRoot, { [classes.hideBackground]: hideBackground }),
    }}
  >
    <Check />
  </IconButton>
);

RawDoneButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

const styles = (theme) => ({
  iconRoot: {
    verticalAlign: 'top',
    width: '28px',
    height: '28px',
    color: '#00bb00',
  },
  hideBackground: {
    backgroundColor: theme.palette.common.white,

    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  label: {
    position: 'absolute',
    top: '2px',
  },
});
export const DoneButton = withStyles(styles)(RawDoneButton);
