import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml, { DEFAULT_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { withStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

class MenuItemComp extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    correct: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  onRemoveClick = (e) => {
    const { onRemoveChoice } = this.props;

    e.preventDefault();
    e.stopPropagation();

    onRemoveChoice();
  };

  render() {
    const { classes, correct, onClick, value } = this.props;

    return (
      <div className={classnames(classes.wrapper, { [classes.correct]: correct })} onClick={onClick}>
        <div
          className={classes.valueHolder}
          dangerouslySetInnerHTML={{
            __html: value,
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
    position: 'relative',
  },
  correct: {
    background: '#C4DCFA',
  },
  removeIcon: {
    cursor: 'pointer',
    fontSize: '20px',
    fontStyle: 'normal',
    position: 'absolute',
    transform: 'translate(0, -50%)',
    top: '50%',
    right: '5px',
    zIndex: 3,
  },
  valueHolder: {
    wordBreak: 'break-all',
  },
})(MenuItemComp);

const findSlateNode = (key) => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');

  div.innerHTML = (htmlString || '').trim();

  return div;
};

export class RespAreaToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    node: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
    onDone: PropTypes.func,
    choices: PropTypes.array,
    onAddChoice: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    onSelectChoice: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    value: PropTypes.shape({
      change: PropTypes.func.isRequired,
      document: PropTypes.shape({
        getNextText: PropTypes.func.isRequired,
      }),
    }),
  };

  state = {
    respAreaMarkup: '',
  };

  componentDidMount() {
    const { node } = this.props;

    const domNode = findSlateNode(node.key);

    if (domNode) {
      //eslint-disable-next-line
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
          width: domNodeRect.width,
        },
      });
    }
  }

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  onRespAreaChange = (respAreaMarkup) => {
    this.setState({ respAreaMarkup });
  };

  onAddChoice = () => {
    if (this.editorRef) {
      this.editorRef.finishEditing();
    }
  };

  onDone = (val) => {
    const { node, onAddChoice } = this.props;
    const onlyText = createElementFromHTML(val).textContent.trim();

    if (!isEmpty(onlyText)) {
      onAddChoice(node.data.get('index'), val);
    }
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

    if (isEqual(val, node.data.get('value'))) {
      const update = { ...node.data.toJSON(), value: null };
      const change = value.change().setNodeByKey(node.key, { data: update });

      onToolbarDone(change, false);
    }

    onRemoveChoice(index);
  };

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.onAddChoice();
      // Cancelling event
      return false;
    }
  };

  onBlur = () => {
    if (this.clickedInside) {
      this.clickedInside = false;
      return;
    }

    const { node, choices, onCheck, onToolbarDone, value } = this.props;
    const correctResponse = (choices || []).find((choice) => choice.correct);

    this.onAddChoice();
    if (!choices || (choices && choices.length < 2) || !correctResponse) {
      onCheck(() => {
        const change = value.change();

        change.removeNodeByKey(node.get('key'));
        onToolbarDone(change, false);
      });
    }
  };

  onClickInside = () => {
    this.clickedInside = true;
  };

  focusInput = () => {
    // we need to focus the input so that math is saved even without pressing the green checkmark
    const slateEditorRef = this.editorRef && this.editorRef.rootRef && this.editorRef.rootRef.slateEditor;
    const inputRef = slateEditorRef && slateEditorRef.editorRef && slateEditorRef.editorRef.element;

    if (inputRef) {
      inputRef.focus();
    }
  };

  render() {
    const { classes, choices, spellCheck, uploadSoundSupport } = this.props;
    const { respAreaMarkup, toolbarStyle } = this.state;

    const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
      (p) => p !== 'table' && p !== 'bulleted-list' && p !== 'numbered-list',
    );
    const labelPlugins = {
      audio: { disabled: true },
      video: { disabled: true },
    };

    if (!toolbarStyle) {
      return null;
    }

    return (
      <div
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6',
        }}
        onMouseDown={this.onClickInside}
      >
        <div className={classes.itemBuilder}>
          <EditableHtml
            ref={(ref) => {
              if (ref) {
                this.editorRef = ref;
              }
            }}
            autoFocus={true}
            autoSave
            className={classes.respArea}
            toolbarOpts={{
              position: 'top',
              alwaysVisible: false,
              showDone: false,
              doneOn: 'blur',
            }}
            markup={respAreaMarkup}
            onKeyDown={this.onKeyDown}
            onChange={this.onRespAreaChange}
            onDone={this.onDone}
            placeholder="Add Choice"
            activePlugins={filteredDefaultPlugins}
            pluginProps={labelPlugins}
            onBlur={this.onBlur}
            spellCheck={spellCheck}
            uploadSoundSupport={uploadSoundSupport}
          />
          <i
            style={{
              cursor: 'pointer',
              fontSize: '20px',
              fontStyle: 'normal',
              position: 'absolute',
              top: '50%',
              right: '15px',
              transform: 'translate(0, -50%)',
            }}
            contentEditable={false}
            onMouseDown={() => this.focusInput()}
            onClick={() => this.onAddChoice()}
          >
            +
          </i>
        </div>
        {choices && (
          <div className={classes.choicesHolder}>
            {choices.map(({ label, correct }, index) => (
              <MenuItem
                key={index}
                onClick={() => this.onSelectChoice(label, index)}
                onRemoveChoice={() => this.onRemoveChoice(label, index)}
                value={label}
                correct={correct}
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
    backgroundColor: '#fff',
    '& [data-slate-editor="true"]': {
      minHeight: 'initial !important',
    },
  },
  choicesHolder: {
    display: 'flex',
    flexDirection: 'column',
    '& > div:last-child': {
      border: 'none',
    },
  },
  itemBuilder: {
    padding: '8px',
    position: 'relative',
  },
})(RespAreaToolbar);

export default StyledRespAreaToolbar;
