import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDialogTitle = styled(DialogTitle)(() => ({
  fontSize: 'max(1.25rem, 18px)',
}));

const StyledDialogContentText = styled(DialogContentText)(() => ({
  fontSize: 'max(1rem, 14px)',
}));

const AlertDialog = ({ text, title, onClose, onConfirm, open, onCloseText, onConfirmText }) => (
  <Dialog open={open} onClose={onClose}>
    {title && <StyledDialogTitle>{title}</StyledDialogTitle>}
    {text && (
      <DialogContent>
        <StyledDialogContentText>{text}</StyledDialogContentText>
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
};

export default AlertDialog;
