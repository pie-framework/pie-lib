import EditableHtml, { DEFAULT_PLUGINS } from '@pie-lib/editable-html';
import React from 'react';
import _ from 'lodash';
import debug from 'debug';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import withRoot from '../src/withRoot';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

const log = debug('@pie-lib:editable-html:demo');
const puppySrc = `https://bit.ly/23yROY8`;

/**
 * Note: See core schema rules - it normalizes so you can only have blocks or inline and text in a block.
 */
// const html = `<div><div>hi</div><img src="${puppySrc}"></img></div>`;
// const html = `<span data-mathjax="">\\frac{1}{2}</span>`;
// const html = `<ul><li><span>apple<span></li></ul>`;
// const html = `<div>
//   <img src="${puppySrc}"></img>
// </div>`;

const html = `<div>
<div>this is some text</div>
<img src="${puppySrc}"/>
</div>`;

// const j = { "kind": "value", "document": { "kind": "document", "data": {}, "nodes": [{ "kind": "block", "type": "div", "nodes": [{ "kind": "text", "leaves": [{ "kind": "leaf", "text": "a" }] }, { "kind": "block", "type": "image", "isVoid": true, "nodes": [], "data": { "src": "http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg", "width": null, "height": null } }] }] } }

class RteDemo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      markup: html,
      showHighlight: false,
      disabled: false,
      width: '',
      height: ''
    };
  }

  onChange = markup => {
    log('onChange: ');
    this.setState({ markup });
  };

  handleInputFiles = input => {
    log('[handleInputFiles] input: ', input);

    const { imageHandler } = this.state;
    if (input.files.length < 1 || !input.files[0]) {
      imageHandler.cancel();
      this.setState({ imageHandler: null });
    } else {
      const file = input.files[0];
      imageHandler.fileChosen(file);
      this.fileInput.value = '';
      const reader = new FileReader();
      reader.onload = () => {
        log('[reader.onload]');
        const dataURL = reader.result;
        setTimeout(() => {
          imageHandler.done(null, dataURL);
          this.setState({ imageHandler: null });
        }, 2000);
      };
      log('call readAsDataUrl...', file);
      let progress = 0;
      imageHandler.progress(progress);
      _.range(1, 100).forEach(n => {
        setTimeout(() => {
          imageHandler.progress(n);
        }, n * 20);
      });
      reader.readAsDataURL(file);
    }
  };

  handleFileSelect = event => {
    log('[handleFileSelect] event: ', event);
    //disable the check cancelled call
    this.setState({ checkCancelled: false }, () => {
      this.handleInputFiles(event.target);
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.insertImage !== nextState.insertImage) {
      console.log('skip update if the insertImageCallback has changed');
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (this.fileInput) {
      this.fileInput.addEventListener('change', this.handleFileSelect);
    }
  }

  componentWillUnmount() {
    this.fileInput.removeEventListener('change', this.handleFileSelect);
  }

  addImage = imageHandler => {
    log('[addImage]', imageHandler);
    this.setState({ imageHandler });
    this.fileInput.click();

    /**
     * There's no way to know if 'cancel' was clicked,
     * instead we have to listen for a focus on body,
     * then call handleInputFiles if checkCancelled is true.
     * It's set to false if a 'change' event is fired.
     */
    document.body.onfocus = e => {
      log('focus document...', this.fileInput.files);
      document.body.onfocus = null;
      this.setState({ checkCancelled: true }, () => {
        setTimeout(() => {
          if (this.state.checkCancelled) {
            this.handleInputFiles(this.fileInput);
          }
        }, 200);
      });
    };
  };

  onDeleteImage = (url, done) => {
    log('delete image src: ', url);
    done();
  };

  render() {
    const { classes } = this.props;
    const {
      markup,
      showHighlight,
      disabled,
      width,
      height,
      mounted
    } = this.state;
    const imageSupport = {
      add: this.addImage,
      delete: this.onDeleteImage
    };

    log('this.state', this.state);

    //activePlugins={['bold', 'bulleted-list', 'numbered-list']}
    return mounted ? (
      <div>
        <Typography variant="title">EditableHtml</Typography>
        <Typography variant="body1">
          A rich text editor with a material design look.
        </Typography>
        <br />

        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={showHighlight}
                onChange={event =>
                  this.setState({ showHighlight: event.target.checked })
                }
              />
            }
            label="show highlight"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={disabled}
                onChange={event =>
                  this.setState({ disabled: event.target.checked })
                }
              />
            }
            label="disabled"
          />
          <TextField
            className={classes.sizeInput}
            placeholder={'width'}
            value={width}
            onChange={event => this.setState({ width: event.target.value })}
          />
          <TextField
            className={classes.sizeInput}
            placeholder={'height'}
            value={height}
            onChange={event => this.setState({ height: event.target.value })}
          />
        </FormGroup>
        <EditableHtml
          markup={markup}
          onChange={this.onChange}
          imageSupport={imageSupport}
          onBlur={this.onBlur}
          disabled={disabled}
          highlightShape={showHighlight}
          width={width}
          height={height}
        />
        <input type="file" hidden ref={r => (this.fileInput = r)} />
        <br />
        <br />
        <h4>markup</h4>
        <pre className={classes.prettyPrint}>{markup}</pre>
        <hr />
        <Typography variant="subheading">Issues</Typography>
        <ol>
          <li>
            <a
              href="https://github.com/ianstormtaylor/slate/blob/master/packages/slate/src/constants/core-schema-rules.js#L39"
              target="_blank"
            >
              Slate's core schema
            </a>{' '}
            only allows for either block or inline and text in a block node. If
            it finds an invalid node it just removes any invalid nodes within
            it. This could be problematic for us when handling incoming content
            of unknown provenance.
          </li>
        </ol>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const styles = theme => ({
  sizeInput: {
    width: '60px',
    paddingLeft: theme.spacing.unit * 2
  },
  prettyPrint: {
    whiteSpace: 'normal',
    width: '100%'
  }
});

export default withRoot(withStyles(styles)(RteDemo));
