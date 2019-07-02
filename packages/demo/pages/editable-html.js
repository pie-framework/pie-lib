import EditableHtml, { ALL_PLUGINS, htmlToValue, DEFAULT_PLUGINS } from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
// eslint-disable-next-line
import { findDOMNode } from 'slate-react';
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
    label: 'An image in a P tag',
    html: '<div><p><span data-type="inline_dropdown" data-index="0"></span></p></div>'
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

class MenuItemComp extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  };

  onRemoveClick = e => {
    const { onRemoveChoice } = this.props;

    e.preventDefault();
    e.stopPropagation();

    onRemoveChoice();
  };

  render() {
    const { classes, onClick, value } = this.props;

    return (
      <div className={classes.wrapper} onClick={onClick}>
        <div
          className={classes.valueHolder}
          dangerouslySetInnerHTML={{
            __html: value
          }}
        />
        <i className={classes.removeIcon} onClick={this.onRemoveClick}>
          x
        </i>
      </div>
    );
  }
}

const MenuItem = withStyles({
  wrapper: {
    background: '#fff',
    borderBottom: '1px solid black',
    boxSizing: 'border-box',
    display: 'block',
    cursor: 'pointer',
    lineHeight: '30px',
    padding: '10px 25px 10px 10px',
    position: 'relative'
  },
  removeIcon: {
    cursor: 'pointer',
    fontSize: '20px',
    fontStyle: 'normal',
    position: 'absolute',
    transform: 'translate(0, -50%)',
    top: '50%',
    right: '5px',
    zIndex: 3
  },
  valueHolder: {
    wordBreak: 'break-all'
  }
})(MenuItemComp);

class RespAreaToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    node: PropTypes.object,
    onDone: PropTypes.func,
    choices: PropTypes.array,
    onAddChoice: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    onSelectChoice: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    value: PropTypes.shape({
      change: PropTypes.func.isRequired,
      document: PropTypes.shape({
        getNextText: PropTypes.func.isRequired
      })
    })
  };

  state = {
    respAreaMarkup: ''
  };

  componentDidMount() {
    const { node } = this.props;

    let domNode;

    try {
      // eslint-disable-next-line
      domNode = findDOMNode(node.key);
    } catch (e) {
      //
    }

    if (domNode) {
      const domNodeRect = domNode.getBoundingClientRect();
      const editor = domNode.closest('[data-slate-editor]');
      const editorRect = editor.getBoundingClientRect();
      const top = domNodeRect.top - editorRect.top;
      const left = domNodeRect.left - editorRect.left;

      this.setState({
        toolbarStyle: {
          position: 'absolute',
          top: `${top + domNodeRect.height + 60}px`,
          left: `${left + 25}px`,
          width: domNodeRect.width
        }
      });
    }

    if (this.daRef) {
      this.daRef.focus();
    }
  }

  onRespAreaChange = respAreaMarkup => {
    this.setState({ respAreaMarkup });
  };

  onTemporaryChange = tempValue => {
    this.setState({ tempValue });
  };

  onAddChoice = value => {
    const { node, onAddChoice } = this.props;

    onAddChoice(node.data.get('index'), value);
  };

  onSelectChoice = (newValue, index) => {
    const { node, value, onToolbarDone, onSelectChoice } = this.props;
    const update = { ...node.data.toJSON(), value: newValue };
    const change = value.change().setNodeByKey(node.key, { data: update });

    const nextText = value.document.getNextText(node.key);

    change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);

    onToolbarDone(change, false);

    onSelectChoice(index);
  };

  onRemoveChoice = (val, index) => {
    const { node, value, onToolbarDone, onRemoveChoice } = this.props;

    if (_.isEqual(val, node.data.get('value'))) {
      const update = { ...node.data.toJSON(), value: null };
      const change = value.change().setNodeByKey(node.key, { data: update });

      onToolbarDone(change, false);
    }

    onRemoveChoice(index);
  };

  render() {
    const { classes, onDone, choices } = this.props;
    const { respAreaMarkup, toolbarStyle, tempValue } = this.state;

    return (
      <div
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6'
        }}
      >
        <div className={classes.itemBuilder}>
          <EditableHtml
            ref={ref => {
              if (ref) {
                this.daRef = ref;
              }
            }}
            autoFocus={true}
            autoSave
            className={classes.respArea}
            toolbarOpts={{
              position: 'bottom',
              alwaysVisible: false
            }}
            markup={respAreaMarkup}
            onChange={this.onRespAreaChange}
            onTemporaryChange={this.onTemporaryChange}
            onDone={onDone}
            placeholder="Add Choice"
          />
          <i
            style={{
              cursor: 'pointer',
              fontSize: '20px',
              fontStyle: 'normal',
              position: 'absolute',
              top: '50%',
              right: '15px',
              transform: 'translate(0, -50%)'
            }}
            contentEditable={false}
            onMouseDown={() => this.onAddChoice(tempValue)}
          >
            +
          </i>
        </div>
        {choices && (
          <div className={classes.choicesHolder}>
            {choices.map((label, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  console.log(label, index);
                  this.onSelectChoice(label, index);
                }}
                onRemoveChoice={() => this.onRemoveChoice(label, index)}
                value={label}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

const StyledRespAreaToolbar = withStyles({
  respArea: {
    backgroundColor: '#fff'
  },
  choicesHolder: {
    display: 'flex',
    flexDirection: 'column',
    '& > div:last-child': {
      border: 'none'
    }
  },
  itemBuilder: {
    padding: '8px',
    position: 'relative'
  }
})(RespAreaToolbar);

const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

class RteDemo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      markup: html,
      respAreaMarkup: '<div>Ciocan</div>',
      respAreaChoices: {},
      showHighlight: false,
      disableImageUpload: false,
      disabled: false,
      width: '',
      height: ''
    };
  }

  onChange = markup => {
    const { respAreaChoices } = this.state;
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll('[data-type="inline_dropdown"]');

    const allChoices = {};

    allRespAreas.forEach(el => {
      allChoices[el.dataset.index] = el.dataset.value || '';
    });

    const existingRespAreaChoices = _.reduce(
      respAreaChoices,
      (obj, choices, key) => {
        if (!_.isUndefined(allChoices[key])) {
          obj[key] = respAreaChoices[key];
        }

        return obj;
      },
      {}
    );

    const newRespAreaChoices = {};

    allRespAreas.forEach((el, index) => {
      newRespAreaChoices[index] = existingRespAreaChoices[el.dataset.index] || [];
      el.dataset.index = index;
    });

    console.log(newRespAreaChoices, domMarkup.innerHTML);

    log('onChange: ');
    this.setState({
      markup: domMarkup.innerHTML,
      respAreaChoices: newRespAreaChoices
    });
  };

  /*  onTemporaryChange = markup => {
    const { respAreaChoices } = this.state;
    const keys = Object.keys(respAreaChoices);
    const el = createElementFromHTML(markup);
    const keyMap = {};

    el.querySelectorAll('[data-type=inline_dropdown]').forEach(s => {
      const index = s.dataset.index;

      keyMap[index] = true;
    });

    keys.forEach(key => {
      if (!keyMap[key]) {
        delete respAreaChoices[key];
      }
    });

    this.setState({ respAreaChoices });
  };*/

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

  onAddChoice = (index, val) => {
    const { respAreaChoices } = this.state;

    if (!respAreaChoices[index]) {
      respAreaChoices[index] = [];
    }

    respAreaChoices[index].push(val);

    this.setState({ respAreaChoices });
  };

  onRemoveChoice = (respIndex, index) => {
    const { respAreaChoices } = this.state;

    respAreaChoices[respIndex].splice(index, 1);

    this.setState({ respAreaChoices });
  };

  onSelectChoice = selectedIndex => this.setState({ selectedIndex });

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
            type: 'inline-dropdown',
            options: {
              duplicates: true
            },
            respAreaToolbar: (node, value, onToolbarDone) => {
              const { respAreaChoices } = this.state;

              const Tb = () => (
                <StyledRespAreaToolbar
                  onAddChoice={this.onAddChoice}
                  onRemoveChoice={index => this.onRemoveChoice(node.data.get('index'), index)}
                  onSelectChoice={this.onSelectChoice}
                  node={node}
                  value={value}
                  onToolbarDone={onToolbarDone}
                  choices={respAreaChoices[node.data.get('index')]}
                />
              );

              return Tb;
            }
          }}
          markup={markup}
          onChange={this.onChange}
          onTemporaryChange={this.onTemporaryChange}
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

export default withDragContext(withRoot(withStyles(styles)(RteDemo)));
