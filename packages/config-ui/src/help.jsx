import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const RawHelpButton = ({ onClick, classes }) => (
  <IconButton
    classes={{
      label: classes.icon
    }}
    onClick={onClick}
  >
    <HelpIcon />
  </IconButton>
);
RawHelpButton.propTypes = {
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired
};

export const HelpButton = withStyles({
  icon: {
    '&:hover': {
      color: '#ddd'
    }
  }
})(RawHelpButton);

export const HelpDialog = ({ open, onClose, children, title }) => (
  <Dialog open={open} onRequestClose={onClose}>
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
  title: PropTypes.string.isRequired
};

class Help extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { children, title } = this.props;
    return (
      <div>
        <HelpButton color="accent" onClick={() => this.setState({ open: true })} />
        <HelpDialog
          open={this.state.open}
          title={title}
          onClose={() => this.setState({ open: false })}
        >
          {children}
        </HelpDialog>
      </div>
    );
  }
}

export default Help;
