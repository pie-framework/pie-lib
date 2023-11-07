import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const AlertDialog = ({ text, title, onClose, onConfirm, open, onCloseText, onConfirmText }) => (
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
  text: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  onConfirmText: PropTypes.string,
  onCloseText: PropTypes.string,
};

export default AlertDialog;
