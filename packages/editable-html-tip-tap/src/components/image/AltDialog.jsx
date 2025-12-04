import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';

export class AltDialog extends React.Component {
  static propTypes = {
    onDone: PropTypes.func.isRequired,
    alt: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const { alt } = props;

    this.state = {
      value: alt,
    };
  }

  closeDialog = () => {
    const allDialogs = document.querySelectorAll('#text-dialog');

    allDialogs.forEach(function(s) {
      return s.remove();
    });
  };

  onDone = () => {
    const { onDone } = this.props;
    const { value } = this.state;

    onDone(value);
    this.closeDialog();
  };

  handleOverflow = () => {
    document.body.style.removeProperty('overflow');
  };

  render() {
    const { value } = this.state;

    return (
      <Dialog
        open
        disablePortal
        onClose={this.closeDialog}
        id="text-dialog"
        hideBackdrop
        disableScrollLock
        onEntered={this.handleOverflow}
      >
        <DialogContent>
          <div style={{ display: 'flex' }}>
            <ArrowBackIos style={{ paddingTop: '6px' }} />
            <TextField
              multiline
              placeholder={'Enter an Alt Text description of this image'}
              helperText={
                'Users with visual limitations rely on Alt Text, since screen readers cannot otherwise describe the contents of an image.'
              }
              value={value}
              onChange={(event) => this.setState({ value: event.target.value })}
              FormHelperTextProps={{ style: { fontSize: 14 } }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onDone}>Done</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AltDialog;
