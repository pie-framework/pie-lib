import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Markdown from 'markdown-to-jsx';

export class ChangelogDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    activePackage: PropTypes.object
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    const { classes, onClose, open, activePackage } = this.props;

    return activePackage ? (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{activePackage.pkg.name}</DialogTitle>

        <DialogContent>
          <Markdown className={classes.md}>{activePackage.nextChangelog}</Markdown>
          <hr />
          <Markdown className={classes.md}>{activePackage.changelog}</Markdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    ) : null;
  }
}

const styles = () => ({
  md: {
    fontFamily: 'sans-serif'
  }
});
export default withStyles(styles)(ChangelogDialog);
