import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const AlertDialog = ({ text, title, onClose, onConfirm, open, onCloseText, onConfirmText, classes }) => (
  <Dialog open={open} onClose={onClose}>
    {title && <DialogTitle className={classes.heading}>{title}</DialogTitle>}
    {text && (
      <DialogContent>
        <DialogContentText className={classes.subheading}>{text}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      {onClose && (
        <Button onClick={onClose} color="primary">
          {onCloseText}
        </Button>
      )}
      {onConfirm && (
        <Button autoFocus onClick={onConfirm} color="primary">
          {onConfirmText}
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

AlertDialog.defaultProps = {
  onCloseText: 'CANCEL',
  onConfirmText: 'OK',
};

AlertDialog.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  onConfirmText: PropTypes.string,
  onCloseText: PropTypes.string,
  classes: PropTypes.object,
};

const styles = () => ({
  heading: {
    '& h2': {
      fontSize: 'max(1.25rem, 18px)',
    },
  },
  subheading: {
    fontSize: 'max(1rem, 14px)',
  },
});

export default withStyles(styles)(AlertDialog);
