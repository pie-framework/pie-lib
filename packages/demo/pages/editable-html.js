import EditableHtml, { ALL_PLUGINS, htmlToValue } from '@pie-lib/editable-html';
import grey from '@material-ui/core/colors/grey';
import React from 'react';
import _ from 'lodash';
import debug from 'debug';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import withRoot from '../src/withRoot';
import { withDragContext, DragSource } from '@pie-lib/drag';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MoreVert from '@material-ui/icons/MoreVert';
import InputChooser from '../src/editable-html/input-chooser';
import { mq } from '@pie-lib/math-input';
import { PureToolbar } from '@pie-lib/math-toolbar';
import { NewCustomToolbar } from '@pie-lib/editable-html/lib/plugins/math';
import { Value, Selection } from 'slate';
import Toolbar from '@pie-lib/editable-html/lib/plugins/toolbar/toolbar';
import MathPlugin from '@pie-lib/editable-html/lib/plugins/math';
const log = debug('@pie-lib:editable-html:demo');
const puppySrc = 'https://bit.ly/23yROY8';

const renderOpts = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ]
};

const GripIcon = ({ style }) => {
  return (
    <span style={style}>
      <MoreVert
        style={{
          margin: '0 -16px'
        }}
      />
      <MoreVert />
    </span>
  );
};

export const BlankContent = withStyles(theme => ({
  choice: {
    border: `solid 0px ${theme.palette.primary.main}`
  },
  disabled: {}
}))(props => {
  const { connectDragSource, choice, onClick } = props;

  return connectDragSource(
    <div
      style={{
        display: 'inline-flex',
        minWidth: '178px',
        minHeight: '36px',
        height: '36px',
        background: '#FFF',
        border: '1px solid #C0C3CF',
        boxSizing: 'border-box',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative',
        padding: '8px 8px 8px 35px'
      }}
      onClick={onClick}
    >
      <GripIcon
        style={{
          position: 'absolute',
          top: '6px',
          left: '15px',
          color: '#9B9B9B',
          zIndex: 2
        }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: choice.value
        }}
      />
    </div>
  );
});

const tileSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    return {
      id: props.targetId,
      value: props.choice,
      instanceId: props.instanceId
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      if (props.type === 'target') {
        props.onRemoveChoice(monitor.getItem());
      }
    }
  }
};

const DragDropTile = DragSource('drag-in-the-blank-choice', tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(BlankContent);

/**
 * Note: See core schema rules - it normalizes so you can only have blocks or inline and text in a block.
 */
const inputOptions = [
  {
    label: 'Some math',
    html: '<div><span data-latex="">\\(100\\)</span></div>'
  },
  {
    label: 'An image in a P tag',
    html: `<div><p><img src="${puppySrc}" style="width:170px;height:151px"/> bar</p><p><img src="${puppySrc}" style="width:170px;height:151px"/> bar</p></div>`
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
    html: '<div><span data-latex="">\\(\\displaystyle - \\frac{36}{55}\\)</span></div>'
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

  render() {
    const { markup, classes } = this.props;
    return (
      <div>
        <Typography variant="h6">Markup</Typography>
        <div ref={r => (this.preview = r)} dangerouslySetInnerHTML={{ __html: markup }} />
        <hr />
        <Typography variant="subtitle1">Raw</Typography>
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
      disableImageUpload: false,
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
      disableImageUpload,
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

    const activePlugins = ALL_PLUGINS;

    return mounted ? (
      <div>
        <Typography variant="h6">EditableHtml</Typography>
        <Typography variant="body2">A rich text editor with a material design look.</Typography>
        <br />
        <InputChooser inputOptions={inputOptions} onChange={markup => this.setState({ markup })} />
        <div className={classes.controls}>
          <Typography variant="headline">Runtime Options</Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showHighlight}
                  onChange={event => this.setState({ showHighlight: event.target.checked })}
                />
              }
              label="show highlight"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={disableImageUpload}
                  onChange={event => this.setState({ disableImageUpload: event.target.checked })}
                />
              }
              label="disable image upload"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={disabled}
                  onChange={event => this.setState({ disabled: event.target.checked })}
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
        </div>
        <EditableHtml
          activePlugins={activePlugins}
          toolbarOpts={{
            position: 'top',
            alwaysVisible: true
          }}
          responseAreaProps={{
            type: 'drag-in-the-blank',
            options: {
              duplicates: true
            }
          }}
          markup={markup}
          onChange={this.onChange}
          imageSupport={imageSupport}
          onBlur={this.onBlur}
          disabled={disabled}
          highlightShape={showHighlight}
          pluginProps={{
            image: {
              disabled: disableImageUpload
            }
          }}
          width={width}
          height={height}
        />
        <input type="file" hidden ref={r => (this.fileInput = r)} />
        <br />

        <DragDropTile
          targetId="0"
          choice={{
            id: '0',
            value: '<span data-latex="" data-raw="\\sqrt{4}">\\(\\sqrt{4}\\)</span>'
          }}
        />
        <MarkupPreview markup={markup} />
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const mathPlugin = MathPlugin();

class SimpleDemo extends React.Component {
  constructor(props) {
    super(props);

    let value = Value.fromJS(
      {
        schema: {
          // document: {
          //   nodes: [{ match: { type: 'div' } }]
          // },
          // document: {
          // nodes: [{ match: { type: 'math' } }, { match: { type: 'div' } }],
          // match: [{ type: 'math' }, { type: 'div' }]
          // },
          blocks: {
            div: {
              normalize: (change, error) => {
                console.log('>>> div - normalize!!', error);
              },
              nodes: [{ match: [{ object: 'text' }, { type: 'math' }] }]
            },
            normalize: (change, error) => {
              console.log('>>> normalize!!', error);
            }
          },
          inlines: {
            math: {
              parent: { type: 'div' }
            }
          }
        },
        document: {
          nodes: [
            {
              object: 'block',
              type: 'div',
              nodes: [
                {
                  object: 'text',
                  nodes: [{ object: 'leaf', text: 'a' }]
                },
                {
                  object: 'inline',
                  type: 'math',
                  data: {
                    latex: '\\frac{1}{1}'
                  }
                },
                {
                  object: 'text',
                  nodes: [{ object: 'leaf', text: 'b' }]
                }
              ]
            }
          ]
        }
      },
      { normalize: true }
    );

    const node = value.document.getInlinesByType('math').get(0);
    //.nodes.get(1);
    console.log(JSON.stringify(value.document.toJSON(), null, '  '));
    let change = value.change();
    console.log('node:', node);
    if (!node) {
      throw new Error('no node');
    }
    console.log('change:', change);
    change = change.collapseToStartOf(node);
    value = change.value;

    console.log(value.selection.toJS());
    this.state = {
      value,
      node,
      mounted: false,
      latex: '\\frac{1}{2}',
      showInput: false
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  tbChange = c => {
    this.setState({ value: c.value });
  };
  render() {
    const { mounted, value, node, showInput } = this.state;
    return mounted ? (
      <div>
        <pre style={{ width: '200px', wordWrap: 'break-word', whiteSpace: 'inherit' }}>
          {JSON.stringify(this.state)}
        </pre>
        simple
        <FormControlLabel
          control={
            <Checkbox
              checked={showInput}
              onChange={e => this.setState({ showInput: e.target.checked })}
            />
          }
          label={'Show Input'}
        />
        <Toolbar plugins={[mathPlugin]} isFocused={true} value={value} />
      </div>
    ) : (
      <div>not mounted</div>
    );
  }
}

// {showInput && (
// <NewCustomToolbar node={node} value={value} onChange={c => this.tbChange(c)} />
// <PureToolbar
//   autoFocus={true}
//   latex={latex}
//   onChange={latex => this.setState({ latex })}
// />
const styles = theme => ({
  controls: {
    backgroundColor: grey[200],
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  sizeInput: {
    width: '60px',
    paddingLeft: theme.spacing.unit * 2
  }
});

const Out = withDragContext(withRoot(withStyles(styles)(SimpleDemo)));
export default Out;
