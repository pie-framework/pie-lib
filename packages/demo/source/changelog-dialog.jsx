import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Markdown from 'markdown-to-jsx';

const StyledMarkdown = styled(Markdown)({
  fontFamily: 'sans-serif',
});

export class ChangelogDialog extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    activePackage: PropTypes.object,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    const { onClose, open, activePackage } = this.props;

    return activePackage ? (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{activePackage.pkg.name}</DialogTitle>

        <DialogContent>
          <StyledMarkdown>{activePackage.nextChangelog}</StyledMarkdown>
          <hr />
          <StyledMarkdown>{activePackage.changelog}</StyledMarkdown>
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

export default ChangelogDialog;
