import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const AlertDialog = ({ text, title, onClose, onConfirm, open }) => (
  <Dialog open={open} onClose={onClose}>
    {title && <DialogTitle>{title}</DialogTitle>}
    {text && (
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      {onClose && (
        <Button onClick={onClose} color="primary">
          CANCEL
        </Button>
      )}
      {onConfirm && (
        <Button autoFocus onClick={onConfirm} color="primary">
          OK
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

AlertDialog.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
};

export default AlertDialog;
