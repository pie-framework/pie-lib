import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import { withStyles } from 'material-ui/styles';

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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  title: PropTypes.string.isRequired
};

class Help extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
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
        <HelpButton
          color="accent"
          onClick={() => this.setState({ open: true })}
        />
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
