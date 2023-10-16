import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  popover: {
    background: '#fff',
    padding: '10px',
    pointerEvents: 'none',
    zIndex: 99999,
  },
  paper: {
    padding: 20,
    height: 'auto',
    width: 'auto',
  },
  typography: {
    fontSize: 50,
    textAlign: 'center',
  },
});

const CustomPopper = withStyles(styles)(({ classes, children, ...props }) => (
  <Popper
    id="mouse-over-popover"
    open
    className={classes.popover}
    classes={{
      paper: classes.paper,
    }}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    disableRestoreFocus
    disableAutoFocus
    {...props}
  >
    <Typography classes={{ root: classes.typography }}>{children}</Typography>
  </Popper>
));

export default CustomPopper;
