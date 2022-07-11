import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';

import { MarkButton } from '../toolbar/toolbar-buttons';

const log = debug('@pie-lib:editable-html:plugins:image:image-toolbar');

const AlignmentButton = ({ alignment, active, onClick }) => {
  return (
    <MarkButton active={active} onToggle={() => onClick(alignment)} label={alignment}>
      {alignment}
    </MarkButton>
  );
};

AlignmentButton.propTypes = {
  alignment: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export class ImageToolbar extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  onAltTextChange = alt => {
    this.props.onChange({ alt });
  };

  onAlignmentClick = alignment => {
    log('[onAlignmentClick]: alignment:', alignment);
    this.props.onChange({ alignment });
  };

  closePopOver = () => {
    const prevPopOvers = document.querySelectorAll('#text-dialog');

    prevPopOvers.forEach(function(s) {
      return s.remove();
    });
  };

  renderPopOver = () => {
    const { alt } = this.props;
    const popoverEl = document.createElement('div');

    ReactDOM.render(
      <Dialog
        hideBackdrop
        onClose={this.closePopOver}
        open
        id={'text-dialog'}
        disableEnforceFocus
        style={{ pointerEvents: 'none' }}
        PaperProps={{ style: { pointerEvents: 'auto' } }}
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
              value={alt}
              onChange={event => this.onAltTextChange(event.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closePopOver}>Done</Button>
        </DialogActions>
      </Dialog>,
      popoverEl
    );
  };

  render() {
    const { classes, alignment } = this.props;

    return (
      <div className={classes.holder}>
        <AlignmentButton
          alignment={'left'}
          active={alignment === 'left'}
          onClick={this.onAlignmentClick}
        />
        <AlignmentButton
          alignment={'center'}
          active={alignment === 'center'}
          onClick={this.onAlignmentClick}
        />
        <AlignmentButton
          alignment={'right'}
          active={alignment === 'right'}
          onClick={this.onAlignmentClick}
        />
        <span onMouseDown={event => this.renderPopOver(event)}>Alt text</span>
      </div>
    );
  }
}

const styles = theme => ({
  holder: {
    paddingLeft: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center'
  }
});

export default withStyles(styles)(ImageToolbar);
