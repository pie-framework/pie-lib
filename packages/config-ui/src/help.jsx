import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Button from 'material-ui/Button';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import { withStyles } from 'material-ui/styles';

const RawHelpButton = ({ onClick, classes }) => (<IconButton classes={{
  label: classes.icon
}} onClick={onClick}><HelpIcon /></IconButton>)

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
      <Button onClick={onClose} color="primary">OK</Button>
    </DialogActions>
  </Dialog>
);

class Help extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  render() {
    const { children, title } = this.props;
    return (
      <div>
        <HelpButton color="accent" onClick={() => this.setState({ open: true })} />
        <HelpDialog
          open={this.state.open}
          title={title}
          onClose={() => this.setState({ open: false })}>{children}</HelpDialog>
      </div>
    );
  }
}

export default Help;