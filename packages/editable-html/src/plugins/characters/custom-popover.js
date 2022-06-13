import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  popover: {
    pointerEvents: 'none',
    zIndex: 99999
  },
  paper: {
    padding: 20,
    height: 'auto',
    width: 'auto'
  },
  typography: {
    fontSize: 50,
    textAlign: 'center'
  }
});

const CustomPopOver = withStyles(styles)(({ classes, children, ...props }) => (
  <Popover
    id="mouse-over-popover"
    open
    className={classes.popover}
    classes={{
      paper: classes.paper
    }}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left'
    }}
    disableRestoreFocus
    {...props}
  >
    <Typography classes={{ root: classes.typography }}>{children}</Typography>
  </Popover>
));

export default CustomPopOver;
