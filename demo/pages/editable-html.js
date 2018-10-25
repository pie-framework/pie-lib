import EditableHtml, {
  DEFAULT_PLUGINS,
  htmlToValue
} from '@pie-lib/editable-html';
import React from 'react';
import _ from 'lodash';
import debug from 'debug';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import withRoot from '../src/withRoot';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputChooser from '../src/editable-html/input-chooser';
import katex from 'katex';
require('katex/dist/katex.css');

const log = debug('@pie-lib:editable-html:demo');
const puppySrc = `https://bit.ly/23yROY8`;

let renderMathInElement = () => {};

if (typeof window !== 'undefined') {
  //Auto render requires the katex global
  window.katex = katex;
  renderMathInElement = require('katex/dist/contrib/auto-render.min');
}

const renderOpts = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ]
};

/**
 * Note: See core schema rules - it normalizes so you can only have blocks or inline and text in a block.
 */
const inputOptions = [
  {
    label: 'An image in a P tag',
    html: `<div><p><img src="${puppySrc}" style="width:170px;height:151px"/> bar</p></div>`
  },
  {
    label: 'Latex \\(..\\)',
    html: '<div><span data-latex="">\\(\\frac{1}{2}\\)</span></div>'
  },
  {
    label: 'Latex $..$',
    html: '<div><span data-latex="">$\\frac{1}{2}$</span></div>'
  },
  {
    label: 'Latex \\displaystyle',
    html:
      '<div><span data-latex="">\\(\\displaystyle - \\frac{36}{55}\\)</span></div>'
  },
  {
    label: 'Nested div w/ image',
    html: '<div>​<div><img src="foo.com/img.png"/></div>​</div>'
  },
  {
    label: 'Nested div w/ text',
    html: '<div>​<div>hi</div>​</div>'
  },
  {
    label: 'Table',
    html: '<table border="1"><tr><td>a</td><td>b</td></tr></table>'
  },
  {
    label: 'Table Complex',
    html:
      '<table cellspacing="0" cellpadding="4" class="borderall"> <tbody> <tr> <td style="width:140px" class="center bold">Trial</td> <td style="width:140px" class="center bold">Mass NH<sub>3</sub></td> <td style="width:140px" class="center bold">Mass HCl</td> <td style="width:140px" class="center bold">Mass NH<sub>4</sub>Cl</td> </tr> <tr> <td class="center">1</td> <td class="center">3.40 g</td> <td class="center">7.30 g</td> <td class="center">10.70 g</td> </tr> <tr> <td class="center">2</td> <td class="center">?</td> <td class="center">?</td> <td class="center">32.10 g</td> </tr> </tbody></table>'
  }
];

const html = inputOptions[0].html;

class RawMarkupPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    markup: PropTypes.string.isRequired
  };

  componentDidUpdate() {
    if (this.preview) {
      renderMathInElement(this.preview, renderOpts);
    }
  }

  componentDidMount() {
    if (this.preview) {
      renderMathInElement(this.preview, renderOpts);
    }
  }

  render() {
    const { markup, classes } = this.props;
    return (
      <div>
        <Typography variant="title">Markup</Typography>
        <div
          ref={r => (this.preview = r)}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        <hr />
        <Typography variant="subheading">Raw</Typography>
        <pre className={classes.prettyPrint}>{markup}</pre>
        <hr />
      </div>
    );
  }
}
const MarkupPreview = withStyles(() => ({
  prettyPrint: {
    whiteSpace: 'normal',
    width: '100%'
  }
}))(RawMarkupPreview);

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

  updateEditorMarkup = () => {
    this.setState({ markup: this.state.userHtml });
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
        <InputChooser
          inputOptions={inputOptions}
          onChange={markup => this.setState({ markup })}
        />
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
        <MarkupPreview markup={markup} />
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
  }
});

export default withRoot(withStyles(styles)(RteDemo));
