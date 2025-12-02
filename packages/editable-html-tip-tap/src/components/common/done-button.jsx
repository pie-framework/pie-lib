import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

export const RawDoneButton = ({ classes, onClick, doneButtonRef }) => (
  <IconButton
    aria-label="Done"
    className={classes.iconRoot}
    buttonRef={doneButtonRef}
    onClick={onClick}
    classes={{
      label: classes.label,
      root: classes.iconRoot,
    }}
  >
    <Check />
  </IconButton>
);

RawDoneButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  doneButtonRef: PropTypes.func,
};

const styles = {
  iconRoot: {
    verticalAlign: 'top',
    width: '28px',
    height: '28px',
    color: 'var(--editable-html-toolbar-check, #00bb00)',
    padding: '4px',
  },
};
export const DoneButton = withStyles(styles)(RawDoneButton);
