import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { color } from '../../../render-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

const log = debug('@pie-lib:editable-html:plugins:dialog');

export class CustomDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    customContent: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const { customContent } = props;

    this.state = {
      customContent: customContent || '<p>TEST</p>',
    };
  }

  handleStateChange = (newState) => this.setState(newState);

  changeHandler = (type) => (e) => this.handleStateChange({ [type]: e.target.value });

  handleDone = (val) => {
    const { customContent } = this.state;

    this.props.handleClose(val, { customContent });
  };

  render() {
    const { classes, open, disablePortal, edit } = this.props;
    const { customContent } = this.state;
    const submitIsDisabled = customContent.length === 0;

    return (
      <Dialog
        classes={{
          paper: classes.paper,
        }}
        disablePortal={disablePortal}
        open={open}
        onClose={() => this.handleDone(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Insert Text</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="customContent"
              label="customContent"
              placeholder="Custom Content"
              value={customContent}
              onChange={this.changeHandler('customContent')}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleDone(false)} color="primary">
            Cancel
          </Button>
          <Button disabled={submitIsDisabled} onClick={() => this.handleDone(true)} color="primary">
            {edit ? 'Update' : 'Insert'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  paper: {
    minWidth: '500px',
  },
  properties: {
    padding: 0,
  },
  row: {
    display: 'flex',
    flexDirection: 'space-between',
  },
  rowItem: {
    marginRight: theme.spacing.unit * 1.5,
    cursor: 'pointer',
  },
  active: {
    color: color.primary(),
    borderBottom: `2px solid ${color.primary()}`,
  },
  uploadInput: {
    marginTop: theme.spacing.unit * 1.5,
  },
  error: {
    marginTop: theme.spacing.unit * 1.5,
    color: theme.palette.error.main,
  },
  deleteIcon: {
    marginLeft: theme.spacing.unit * 1.5,
  },
});

export default withStyles(styles)(CustomDialog);
