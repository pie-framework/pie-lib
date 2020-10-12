import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const log = debug('@pie-lib:editable-html:plugins:media:dialog');

const matchYoutubeUrl = url => {
  const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
};

const matchVimeoUrl = url =>
  /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/.test(
    url
  );

const matchSoundCloudUrl = url => {
  const regexp = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
  return url.match(regexp) && url.match(regexp)[2];
};

const makeApiRequest = async url => {
  const response = await fetch(`https://soundcloud.com/oembed?format=json&url=${url}`);
  const json = await response.json();
  const d = document.createElement('div');

  d.innerHTML = json.html;

  const iframe = d.querySelector('iframe');

  return iframe.src;
};

const typeMap = {
  video: 'Video',
  audio: 'Audio'
};

export class MediaDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    disablePortal: PropTypes.bool,
    handleClose: PropTypes.func,
    type: PropTypes.string
  };

  state = {
    ends: 0,
    url: null,
    height: 315,
    invalid: false,
    starts: 0,
    title: '',
    width: 560
  };

  urlChange = async e => {
    const { value } = e.target || {};

    if (matchSoundCloudUrl(value)) {
      const url = await makeApiRequest(value);

      log('is audio');

      this.setState({
        url,
        invalid: false
      });

      return;
    }

    if (matchYoutubeUrl(value)) {
      const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = value.match(regExp);
      const id = match[2];
      const url = `https://youtube.com/embed/${id}`;

      log('is youtube');

      this.setState({
        url,
        invalid: false
      });

      return;
    }

    if (matchVimeoUrl(value)) {
      const id = value.replace(/.*vimeo.com\/(.*)/g, '$1');
      const url = `https://player.vimeo.com/video/${id}`;

      log('is vimeo');

      this.setState({
        url,
        invalid: false
      });

      return;
    }

    this.setState({
      url: null,
      invalid: true
    });
  };

  changeHandler = type => e => this.setState({ [type]: e.target.value });

  handleDone = val => {
    const { handleClose } = this.props;

    if (!val) {
      handleClose(val);
    } else {
      const { ends, height, title, url, starts, width } = this.state;

      handleClose(val, {
        ends,
        height,
        starts,
        title,
        width,
        src: url
      });
    }
  };

  render() {
    const { classes, open, disablePortal, type } = this.props;
    const { ends, height, invalid, starts, title, width, url } = this.state;

    return (
      <Dialog
        classes={{
          paper: classes.paper
        }}
        disablePortal={disablePortal}
        open={open}
        onClose={() => this.handleDone(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Insert {typeMap[type]}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {type === 'video' ? 'Insert YouTube or Vimeo URL' : 'Insert SoundCloud URL'}
          </DialogContentText>
          <TextField
            autoFocus
            error={invalid}
            helperText="Invalid URL"
            margin="dense"
            id="name"
            label="URL"
            placeholder={`Paste URL of ${type}...`}
            type="text"
            onChange={this.urlChange}
            fullWidth
          />
          {type === 'video' && (
            <DialogContent
              classes={{
                root: classes.properties
              }}
            >
              <DialogContentText>Video Properties</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="width"
                label="Width"
                type="number"
                placeholder="Width"
                value={width}
                onChange={this.changeHandler('width')}
              />
              <TextField
                autoFocus
                margin="dense"
                id="height"
                label="Height"
                type="number"
                placeholder="Height"
                value={height}
                onChange={this.changeHandler('height')}
              />
            </DialogContent>
          )}
          {url && (
            <iframe
              width={width}
              height={height}
              src={url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {type === 'video' && url && (
            <React.Fragment>
              <DialogContent
                classes={{
                  root: classes.properties
                }}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Video Title"
                  type="text"
                  placeholder="Video Title"
                  value={title}
                  onChange={this.changeHandler('title')}
                  fullWidth
                />
              </DialogContent>

              <DialogContent
                classes={{
                  root: classes.properties
                }}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  id="starts"
                  label="Starts"
                  type="number"
                  placeholder="Starts"
                  value={starts}
                  onChange={this.changeHandler('starts')}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="ends"
                  label="Ends"
                  type="number"
                  placeholder="Ends"
                  value={ends}
                  onChange={this.changeHandler('ends')}
                />
              </DialogContent>
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleDone(false)} color="primary">
            Cancel
          </Button>
          <Button
            disabled={invalid || url === null}
            onClick={() => this.handleDone(true)}
            color="primary"
          >
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = () => ({
  paper: {
    minWidth: '500px'
  },
  properties: {
    padding: 0
  }
});

export default withStyles(styles)(MediaDialog);
