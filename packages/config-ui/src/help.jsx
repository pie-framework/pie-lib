import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { styled } from '@mui/material/styles';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    color: theme.palette.grey[300],
  },
}));

export const HelpButton = ({ onClick }) => (
  <StyledIconButton onClick={onClick} size="large">
    <HelpIcon />
  </StyledIconButton>
);

HelpButton.propTypes = {
  onClick: PropTypes.func,
};

export const HelpDialog = ({ open, onClose, children, title }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{children}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

HelpDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  title: PropTypes.string.isRequired,
};

class Help extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const { children, title } = this.props;

    return (
      <div>
        <HelpButton color="accent" onClick={() => this.setState({ open: true })} />

        <HelpDialog open={this.state.open} title={title} onClose={() => this.setState({ open: false })}>
          {children}
        </HelpDialog>
      </div>
    );
  }
}

export default Help;
