import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiTabs from '@material-ui/core/Tabs';
import MuiTab from '@material-ui/core/Tab';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ActionDelete from '@material-ui/icons/Delete';

const log = debug('@pie-lib:editable-html:plugins:media:dialog');

const matchYoutubeUrl = (url) => {
  if (!url) {
    return false;
  }

  const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
};

const matchVimeoUrl = (url) =>
  url &&
  /(http|https)?:\/\/(www\.)?(player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(video\/)?(\d+)(?:|\/\?)/.test(
    url,
  );

const matchSoundCloudUrl = (url) => {
  if (!url) {
    return false;
  }

  const regexp = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
  return url.match(regexp) && url.match(regexp)[2];
};

const makeApiRequest = (url) => {
  return new Promise((resolve) => {
    try {
      fetch(`https://soundcloud.com/oembed?format=json&url=${url}`)
        .then((response) => response.json())
        .then((json) => {
          const d = document.createElement('div');

          d.innerHTML = json.html;

          const iframe = d.querySelector('iframe');

          resolve(iframe.src);
        })
        .catch((err) => {
          resolve('');
          log(err);
        });
    } catch (err) {
      resolve('');
    }
  });
};

const typeMap = {
  video: 'Video',
  audio: 'Audio',
};

export class MediaDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    edit: PropTypes.bool,
    disablePortal: PropTypes.bool,
    handleClose: PropTypes.func,
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func,
      delete: PropTypes.func,
    }),
    type: PropTypes.string,
    src: PropTypes.string,
    url: PropTypes.string,
    urlToUse: PropTypes.string,
    starts: PropTypes.number,
    ends: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const { src, starts, ends, height, url, urlToUse, width } = props;

    this.state = {
      ends: ends || 0,
      url: url,
      urlToUse: urlToUse,
      formattedUrl: src,
      height: height || 315,
      invalid: false,
      starts: starts || 0,
      width: width || 560,
      tabValue: 0,
      fileUpload: {
        loading: false,
        url: '',
        error: null,
      },
    };
  }

  componentDidMount() {
    if (this.props.url) {
      this.urlChange({
        target: {
          value: this.props.url,
        },
      });
    }
  }

  formatUrl = () => {
    const { url, urlToUse, starts, ends } = this.state;
    const isYoutube = matchYoutubeUrl(url);
    const isVimeo = matchVimeoUrl(url);
    let formattedUrl = urlToUse;

    if ((isYoutube || isVimeo) && urlToUse) {
      const params = [];

      let paramName;
      let paramStart;

      switch (true) {
        case isVimeo:
          paramName = 't';
          paramStart = '#';
          break;
        case isYoutube:
          paramName = 'start';
          paramStart = '?';
          break;
        default:
          paramName = 'start';
          paramStart = '?';
      }

      if (starts) {
        params.push(`${paramName}=${starts}`);
      }

      if (ends) {
        params.push(`end=${ends}`);
      }

      formattedUrl = `${urlToUse}${params.length ? paramStart : ''}${params.join('&')}`;
    }

    const callback = () => this.setState({ formattedUrl, updating: false });

    this.setState({ formattedUrl: null, updating: true }, callback);
  };

  handleStateChange = (newState) => this.setState(newState, this.formatUrl);

  urlChange = (e) => {
    const { value } = e.target || {};
    const { type } = this.props;

    if (type && type === 'audio') {
      if (matchSoundCloudUrl(value)) {
        makeApiRequest(value)
          .then((urlToUse) => {
            this.handleStateChange({
              urlToUse,
              invalid: !urlToUse,
              url: value,
            });
          })
          .catch(log);

        return;
      }
    } else if (type && type === 'video') {
      if (matchYoutubeUrl(value)) {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = value.match(regExp);
        const id = match[2];
        const urlToUse = `https://youtube.com/embed/${id}`;

        log('is youtube');

        this.handleStateChange({
          urlToUse,
          url: value,
          invalid: false,
        });

        return;
      }

      if (matchVimeoUrl(value)) {
        const id = value.replace(/.*vimeo.com\/(.*)/g, '$1');
        const urlToUse = `https://player.vimeo.com/video/${id}`;

        log('is vimeo');

        this.handleStateChange({
          urlToUse,
          url: value,
          ends: null,
          invalid: false,
        });

        return;
      }
    }

    this.handleStateChange({
      urlToUse: null,
      url: null,
      invalid: true,
    });
  };

  changeHandler = (type) => (e) => this.handleStateChange({ [type]: e.target.value });

  handleDone = (val) => {
    const { handleClose } = this.props;
    const { tabValue, fileUpload } = this.state;
    const isInsertURL = tabValue === 0;

    if (!val) {
      if (fileUpload.url) {
        this.handleRemoveFile();
      }

      handleClose(val);
    } else if (isInsertURL) {
      const { ends, height, url, urlToUse, formattedUrl, starts, width } = this.state;

      handleClose(val, {
        tag: 'iframe',
        ends,
        height,
        starts,
        width,
        url,
        urlToUse,
        src: formattedUrl,
      });
    } else {
      handleClose(val, {
        tag: 'audio',
        src: fileUpload.url,
      });
    }
  };

  handleUploadFile = async (e) => {
    e.preventDefault();

    this.setState({
      fileUpload: {
        ...this.state.fileUpload,
        error: null,
        loading: true,
      },
    });

    const fileChosen = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const dataURL = reader.result;

      this.setState({
        fileUpload: {
          ...this.state.fileUpload,
          url: dataURL,
        },
      });
    };
    reader.readAsDataURL(fileChosen);

    this.props.uploadSoundSupport.add({
      fileChosen,
      done: (err, src) => {
        log('done: err:', err);
        if (err) {
          //eslint-disable-next-line
          console.log(err);
          this.setState({
            fileUpload: {
              ...this.state.fileUpload,
              loading: false,
              error: err,
            },
          });
        } else {
          this.setState({
            fileUpload: {
              ...this.state.fileUpload,
              loading: false,
              url: src,
            },
          });
        }
      },
    });
  };

  handleRemoveFile = async () => {
    this.props.uploadSoundSupport.delete(this.state.fileUpload.url, (err) => {
      if (err) {
        //eslint-disable-next-line
        console.log(err);
        this.setState({
          fileUpload: {
            ...this.state.fileUpload,
            error: err,
          },
        });
      }
    });

    // we should put it inside uploadSoundSupport.delete but we can leave it here for testing purposes
    this.setState({
      fileUpload: {
        ...this.state.fileUpload,
        loading: false,
        url: '',
      },
    });
  };

  render() {
    const { classes, open, disablePortal, type, edit, uploadSoundSupport } = this.props;
    const { ends, height, invalid, starts, width, url, formattedUrl, updating, tabValue, fileUpload } = this.state;
    const isYoutube = matchYoutubeUrl(url);
    const isInsertURL = tabValue === 0;
    const isUploadMedia = tabValue === 1;
    const submitIsDisabled = isInsertURL ? invalid || url === null || url === undefined : !fileUpload.url;

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
        <DialogTitle id="form-dialog-title">Insert {typeMap[type]}</DialogTitle>
        <DialogContent>
          <div>
            <div className={classes.row}>
              <MuiTabs
                indicatorColor="primary"
                value={tabValue}
                onChange={(event, value) => {
                  this.setState({ tabValue: value });
                }}
              >
                <MuiTab label={type === 'video' ? 'Insert YouTube or Vimeo URL' : 'Insert SoundCloud URL'} />
                {uploadSoundSupport?.add && uploadSoundSupport?.delete && type !== 'video' ? (
                  <MuiTab label="Upload file" />
                ) : null}
              </MuiTabs>
            </div>
            {isInsertURL && (
              <div>
                <TextField
                  autoFocus
                  error={invalid}
                  helperText={invalid ? 'Invalid URL' : ''}
                  margin="dense"
                  id="name"
                  label="URL"
                  placeholder={`Paste URL of ${type}...`}
                  type="text"
                  onChange={this.urlChange}
                  value={url}
                  fullWidth
                />
                {type === 'video' && (
                  <DialogContent
                    classes={{
                      root: classes.properties,
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
                {formattedUrl && (
                  <iframe
                    width={width}
                    height={height}
                    src={formattedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {type === 'video' && (formattedUrl || updating) && !invalid && (
                  <React.Fragment>
                    <DialogContent
                      classes={{
                        root: classes.properties,
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
                      {isYoutube && (
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
                      )}
                    </DialogContent>
                  </React.Fragment>
                )}
              </div>
            )}
            {isUploadMedia && (
              <div className={classes.uploadInput}>
                <div>
                  {fileUpload.url ? (
                    <>
                      <div className={classes.row}>
                        <audio controls="controls">
                          <source type="audio/mp3" src={fileUpload.url} />
                        </audio>
                        <IconButton aria-label="delete" className={classes.deleteIcon} onClick={this.handleRemoveFile}>
                          <ActionDelete />
                        </IconButton>
                      </div>
                      {fileUpload.loading ? <Typography variant="subheading">Loading...</Typography> : null}
                    </>
                  ) : !fileUpload.loading ? (
                    <input accept="audio/*" className={classes.input} onChange={this.handleUploadFile} type="file" />
                  ) : null}
                  {!!fileUpload.error && (
                    <Typography className={classes.error} variant="caption">
                      {fileUpload.error}
                    </Typography>
                  )}
                </div>
              </div>
            )}
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

const styles = () => ({
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
    marginRight: '12px',
    cursor: 'pointer',
  },
  active: {
    color: color.primary(),
    borderBottom: `2px solid ${color.primary()}`,
  },
  uploadInput: {
    marginTop: '12px',
  },
  error: {
    marginTop: '12px',
    color: 'red',
  },
  deleteIcon: {
    marginLeft: '12px',
  },
});

export default withStyles(styles)(MediaDialog);
