import { Editor as SlateEditor, findNode, getEventRange, getEventTransfer } from 'slate-react';
import SlateTypes from 'slate-prop-types';

import isEqual from 'lodash/isEqual';
import * as serialization from './serialization';
import PropTypes from 'prop-types';
import React from 'react';
import { Value, Block, Inline } from 'slate';
import { buildPlugins, ALL_PLUGINS, DEFAULT_PLUGINS } from './plugins';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';
import Plain from 'slate-plain-serializer';

import { getBase64 } from './serialization';

export { ALL_PLUGINS, DEFAULT_PLUGINS, serialization };

const log = debug('editable-html:editor');

const defaultToolbarOpts = {
  position: 'bottom',
  alignment: 'left',
  alwaysVisible: false,
  showDone: true,
  doneOn: 'blur'
};

const defaultResponseAreaProps = {
  options: {},
  respAreaToolbar: () => {},
  onHandleAreaChange: () => {}
};

const defaultLanguageCharactersProps = [];

const createToolbarOpts = toolbarOpts => {
  return {
    ...defaultToolbarOpts,
    ...toolbarOpts
  };
};

export class Editor extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    editorRef: PropTypes.func.isRequired,
    onRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    focus: PropTypes.func.isRequired,
    value: SlateTypes.value.isRequired,
    imageSupport: PropTypes.object,
    charactersLimit: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    classes: PropTypes.object.isRequired,
    highlightShape: PropTypes.bool,
    disabled: PropTypes.bool,
    spellCheck: PropTypes.bool,
    nonEmpty: PropTypes.bool,
    disableUnderline: PropTypes.bool,
    autoWidthToolbar: PropTypes.bool,
    pluginProps: PropTypes.any,
    placeholder: PropTypes.string,
    responseAreaProps: PropTypes.shape({
      type: PropTypes.oneOf([
        'explicit-constructed-response',
        'inline-dropdown',
        'drag-in-the-blank'
      ]),
      options: PropTypes.object,
      respAreaToolbar: PropTypes.func,
      onHandleAreaChange: PropTypes.func
    }),
    languageCharactersProps: PropTypes.arrayOf(
      PropTypes.shape({
        language: PropTypes.string,
        characterIcon: PropTypes.string,
        characters: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
      })
    ),
    toolbarOpts: PropTypes.shape({
      position: PropTypes.oneOf(['bottom', 'top']),
      alignment: PropTypes.oneOf(['left', 'right']),
      alwaysVisible: PropTypes.bool,
      showDone: PropTypes.bool,
      doneOn: PropTypes.string
    }),
    activePlugins: PropTypes.arrayOf(values => {
      const allValid = values.every(v => ALL_PLUGINS.includes(v));

      return (
        !allValid &&
        new Error(`Invalid values: ${values}, values must be one of [${ALL_PLUGINS.join(',')}]`)
      );
    }),
    className: PropTypes.string,
    maxImageWidth: PropTypes.number,
    maxImageHeight: PropTypes.number
  };

  static defaultProps = {
    disableUnderline: true,
    onFocus: () => {},
    onBlur: () => {},
    onKeyDown: () => {},
    toolbarOpts: defaultToolbarOpts,
    responseAreaProps: defaultResponseAreaProps,
    languageCharactersProps: defaultLanguageCharactersProps
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      toolbarOpts: createToolbarOpts(props.toolbarOpts)
    };

    this.onResize = () => {
      props.onChange(this.state.value, true);
    };

    this.handlePlugins(this.props);
  }

  handlePlugins = props => {
    const normalizedResponseAreaProps = {
      ...defaultResponseAreaProps,
      ...props.responseAreaProps
    };

    this.plugins = buildPlugins(props.activePlugins, {
      math: {
        onClick: this.onMathClick,
        onFocus: this.onPluginFocus,
        onBlur: this.onPluginBlur
      },
      image: {
        onDelete:
          props.imageSupport &&
          props.imageSupport.delete &&
          ((src, done) => {
            props.imageSupport.delete(src, e => {
              done(e, this.state.value);
            });
          }),
        insertImageRequested:
          props.imageSupport &&
          (getHandler => {
            /**
             * The handler is the object through which the outer context
             * communicates file upload events like: fileChosen, cancel, progress
             */
            const handler = getHandler(() => this.state.value);
            props.imageSupport.add(handler);
          }),
        onFocus: this.onPluginFocus,
        onBlur: this.onPluginBlur,
        maxImageWidth: this.props.maxImageWidth,
        maxImageHeight: this.props.maxImageHeight
      },
      toolbar: {
        /**
         * To minimize converting html -> state -> html
         * We only emit markup once 'done' is clicked.
         */
        disableUnderline: props.disableUnderline,
        autoWidth: props.autoWidthToolbar,
        onDone: () => {
          const { nonEmpty } = props;

          log('[onDone]');
          this.setState({ toolbarInFocus: false, focusedNode: null });
          this.editor.blur();

          if (nonEmpty && this.state.value.startText?.text?.length === 0) {
            this.resetValue(true).then(() => {
              this.onEditingDone();
            });
          } else {
            this.onEditingDone();
          }
        }
      },
      table: {
        onFocus: () => {
          log('[table:onFocus]...');
          this.onPluginFocus();
        },
        onBlur: () => {
          log('[table:onBlur]...');
          this.onPluginBlur();
        }
      },
      responseArea: {
        type: normalizedResponseAreaProps.type,
        options: normalizedResponseAreaProps.options,
        maxResponseAreas: normalizedResponseAreaProps.maxResponseAreas,
        respAreaToolbar: normalizedResponseAreaProps.respAreaToolbar,
        onHandleAreaChange: normalizedResponseAreaProps.onHandleAreaChange,
        error: normalizedResponseAreaProps.error,
        onFocus: () => {
          log('[table:onFocus]...');
          this.onPluginFocus();
        },
        onBlur: () => {
          log('[table:onBlur]...');
          this.onPluginBlur();
        }
      },
      languageCharacters: props.languageCharactersProps,
      media: {
        focus: this.focus,
        createChange: () => this.state.value.change(),
        onChange: this.onChange
      }
    });
  };

  componentDidMount() {
    // onRef is needed to get the ref of the component because we export it using withStyles
    this.props.onRef(this);

    window.addEventListener('resize', this.onResize);

    if (this.editor && this.props.autoFocus) {
      Promise.resolve().then(() => {
        if (this.editor) {
          const editorDOM = document.querySelector(
            `[data-key="${this.editor.value.document.key}"]`
          );

          this.editor.focus();

          if (editorDOM) {
            editorDOM.focus();
          }
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { toolbarOpts } = this.state;
    const newToolbarOpts = createToolbarOpts(nextProps.toolbarOpts);

    if (!isEqual(newToolbarOpts, toolbarOpts)) {
      this.setState({
        toolbarOpts: newToolbarOpts
      });
    }

    if (!isEqual(nextProps.languageCharactersProps, this.props.languageCharactersProps)) {
      this.handlePlugins(nextProps);
    }
  }

  componentDidUpdate() {
    // The cursor is on a zero width element and when that is placed near void elements, it is not visible
    // so we increase the width to at least 2px in order for the user to see it
    const zeroWidthEls = document.querySelectorAll('[data-slate-zero-width="z"]');

    Array.from(zeroWidthEls).forEach(el => {
      el.style.minWidth = '2px';
      el.style.display = 'inline-block';
    });
  }

  onPluginBlur = e => {
    log('[onPluginBlur]', e && e.relatedTarget);
    const target = e && e.relatedTarget;

    const node = target ? findNode(target, this.state.value) : null;
    log('[onPluginBlur] node: ', node);
    this.setState({ focusedNode: node }, () => {
      this.resetValue();
    });
  };

  onPluginFocus = e => {
    log('[onPluginFocus]', e && e.target);
    const target = e && e.target;
    if (target) {
      const node = findNode(target, this.state.value);
      log('[onPluginFocus] node: ', node);

      const stashedValue = this.state.stashedValue || this.state.value;
      this.setState({ focusedNode: node, stashedValue });
    } else {
      this.setState({ focusedNode: null });
    }
    this.stashValue();
  };

  onMathClick = node => {
    this.editor.change(c => c.collapseToStartOf(node));
    this.setState({ selectedNode: node });
  };

  onEditingDone = () => {
    log('[onEditingDone]');
    this.setState({ stashedValue: null, focusedNode: null });
    log('[onEditingDone] value: ', this.state.value);
    this.props.onChange(this.state.value, true);
  };

  /**
   * Remove onResize event listener
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  // Allowing time for onChange to take effect if it is called
  handleBlur = resolve => {
    const { nonEmpty } = this.props;
    const {
      toolbarOpts: { doneOn }
    } = this.state;

    this.setState({ toolbarInFocus: false, focusedNode: null });

    if (this.editor) {
      this.editor.blur();
    }

    if (doneOn === 'blur') {
      if (nonEmpty && this.state.value.startText?.text?.length === 0) {
        this.resetValue(true).then(() => {
          this.onEditingDone();
          resolve();
        });
      } else {
        this.onEditingDone();
        resolve();
      }
    }
  };

  onBlur = event => {
    log('[onBlur]');
    const target = event.relatedTarget;

    const node = target ? findNode(target, this.state.value) : null;

    log('[onBlur] node: ', node);

    return new Promise(resolve => {
      this.setState({ focusedNode: !node ? null : node }, this.handleBlur.bind(this, resolve));
      this.props.onBlur(event);
    });
  };

  handleDomBlur = e => {
    const editorDOM = document.querySelector(`[data-key="${this.state.value.document.key}"]`);

    setTimeout(() => {
      if (!this.wrapperRef) {
        return;
      }

      const editorElement =
        !editorDOM || document.activeElement.closest(`[class*="${editorDOM.className}"]`);
      const toolbarElement =
        !this.toolbarRef ||
        document.activeElement.closest(`[class*="${this.toolbarRef.className}"]`);
      const isInCurrentComponent =
        this.wrapperRef.contains(editorElement) || this.wrapperRef.contains(toolbarElement);

      if (!isInCurrentComponent) {
        editorDOM.removeEventListener('blur', this.handleDomBlur);
        this.onBlur(e);
      }
    }, 50);
  };

  /*
   * Needs to be wrapped otherwise it causes issues because of race conditions
   * Known issue for slatejs. See: https://github.com/ianstormtaylor/slate/issues/2097
   * Using timeout I wasn't able to test this
   *
   * Note: The use of promises has been causing issues with MathQuill
   * */
  onFocus = () =>
    new Promise(resolve => {
      const editorDOM = document.querySelector(`[data-key="${this.state.value.document.key}"]`);

      log('[onFocus]', document.activeElement);

      /**
       * This is a temporary hack - @see changeData below for some more information.
       */
      if (this.__TEMPORARY_CHANGE_DATA) {
        const { key, data } = this.__TEMPORARY_CHANGE_DATA;
        const domEl = document.querySelector(`[data-key="${key}"]`);

        if (domEl) {
          let change = this.state.value.change().setNodeByKey(key, { data });

          this.setState({ value: change.value }, () => {
            this.__TEMPORARY_CHANGE_DATA = null;
          });
        }
      }

      /**
       * This is needed just in case the browser decides to make the editor
       * lose focus without triggering the onBlur event (can happen in a few cases).
       * This will also trigger onBlur if the user clicks outside of the page when the editor
       * is focused.
       */
      if (editorDOM === document.activeElement) {
        editorDOM.removeEventListener('blur', this.handleDomBlur);
        editorDOM.addEventListener('blur', this.handleDomBlur);
      }

      this.stashValue();
      this.props.onFocus();

      resolve();
    });

  stashValue = () => {
    log('[stashValue]');
    if (!this.state.stashedValue) {
      this.setState({ stashedValue: this.state.value });
    }
  };

  /**
   * Reset the value if the user didn't click done.
   */
  resetValue = force => {
    const { value, focusedNode } = this.state;

    const stopReset = this.plugins.reduce((s, p) => {
      return s || (p.stopReset && p.stopReset(this.state.value));
    }, false);

    log('[resetValue]', value.isFocused, focusedNode, 'stopReset: ', stopReset);
    if ((this.state.stashedValue && !value.isFocused && !focusedNode && !stopReset) || force) {
      log('[resetValue] resetting...');
      log('stashed', this.state.stashedValue.document.toObject());
      log('current', this.state.value.document.toObject());

      const newValue = Value.fromJSON(this.state.stashedValue.toJSON());

      log('newValue: ', newValue.document);
      return new Promise(resolve => {
        setTimeout(() => {
          this.setState({ value: newValue, stashedValue: null }, () => {
            log('value now: ', this.state.value.document.toJSON());
            resolve();
          });
        }, 50);
      });
    } else {
      return Promise.resolve({});
    }
  };

  onChange = (change, done) => {
    log('[onChange]');

    const { value } = change;
    const { charactersLimit } = this.props;

    if (
      value &&
      value.document &&
      value.document.text &&
      value.document.text.length > charactersLimit
    ) {
      return;
    }

    this.setState({ value }, () => {
      log('[onChange], call done()');

      if (done) {
        done();
      }
    });
  };

  UNSAFE_componentWillReceiveProps(props) {
    if (!props.value.document.equals(this.props.value.document)) {
      this.setState({
        focus: false,
        value: props.value
      });
    }
  }

  valueToSize = v => {
    if (!v) {
      return;
    }

    if (typeof v === 'string') {
      if (v.endsWith('%')) {
        return undefined;
      } else if (v.endsWith('px') || v.endsWith('vh') || v.endsWith('vw')) {
        return v;
      } else {
        const value = parseInt(v, 10);
        return isNaN(value) ? value : `${value}px`;
      }
    }
    if (typeof v === 'number') {
      return `${v}px`;
    }

    return;
  };

  buildSizeStyle() {
    const { width, minHeight, height, maxHeight } = this.props;

    return {
      width: this.valueToSize(width),
      height: this.valueToSize(height),
      minHeight: this.valueToSize(minHeight),
      maxHeight: this.valueToSize(maxHeight)
    };
  }

  validateNode = node => {
    if (node.object !== 'block') return;

    const last = node.nodes.last();
    if (!last) return;

    if (last.type !== 'image') return;

    log('[validateNode] last is image..');

    const parent = last.getParent(last.key);
    const p = Block.getParent(last.key);
    log('[validateNode] parent:', parent, p);

    return undefined;
  };

  changeData = (key, data) => {
    log('[changeData]. .. ', key, data);

    /**
     * HACK ALERT: We should be calling setState here and storing the change data:
     *
     * <code>this.setState({changeData: { key, data}})</code>
     * However this is causing issues with the Mathquill instance. The 'input' event stops firing on the element and no
     * more changes get through. The issues seem to be related to the promises in onBlur/onFocus. But removing these
     * brings it's own problems. A major clean up is planned for this component so I've decided to temporarily settle
     * on this hack rather than spend more time on this.
     */

    // Uncomment this line to see the bug described above.
    // this.setState({changeData: {key, data}})

    this.__TEMPORARY_CHANGE_DATA = { key, data };
  };

  focus = (pos, node) => {
    const position = pos || 'end';

    this.props.focus(position, node);
  };

  onDropPaste = async (event, change, dropContext) => {
    const editor = change.editor;
    const transfer = getEventTransfer(event);
    const file = transfer.files && transfer.files[0];

    const type = transfer.type;
    const fragment = transfer.fragment;
    const text = transfer.text;

    if (
      file &&
      (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')
    ) {
      if (!this.props.imageSupport) {
        return;
      }
      try {
        log('[onDropPaste]');
        const src = await getBase64(file);
        const inline = Inline.create({
          type: 'image',
          isVoid: true,
          data: {
            loading: false,
            src
          }
        });

        if (dropContext) {
          this.focus();
        } else {
          const range = getEventRange(event, editor);
          if (range) {
            change.select(range);
          }
        }

        const ch = change.insertInline(inline);
        this.onChange(ch);
      } catch (err) {
        log('[onDropPaste] error: ', err);
      }
    } else if (type === 'fragment') {
      change.insertFragment(fragment);
    } else if (type === 'text' || type === 'html') {
      if (!text) {
        return;
      }
      const {
        value: { document, selection, startBlock }
      } = change;

      if (startBlock.isVoid) {
        return;
      }

      const defaultBlock = startBlock;
      const defaultMarks = document.getInsertMarksAtRange(selection);
      const frag = Plain.deserialize(text, {
        defaultBlock,
        defaultMarks
      }).document;
      change.insertFragment(frag);
    }
  };

  renderPlaceholder = props => {
    const { editor } = props;
    const { document } = editor.value;

    if (!editor.props.placeholder || document.text !== '' || document.nodes.size !== 1) {
      return false;
    }

    return (
      <span
        contentEditable={false}
        style={{
          display: 'inline-block',
          width: 'fit-content', // for centering the placeholder if text-align is set to center
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          opacity: '0.33',
          pointerEvents: 'none'
        }}
      >
        {editor.props.placeholder}
      </span>
    );
  };

  render() {
    const {
      disabled,
      spellCheck,
      highlightShape,
      classes,
      className,
      placeholder,
      pluginProps,
      onKeyDown
    } = this.props;

    const { value, focusedNode, toolbarOpts } = this.state;

    log('[render] value: ', value);
    const sizeStyle = this.buildSizeStyle();
    const names = classNames(
      {
        [classes.withBg]: highlightShape,
        [classes.toolbarOnTop]: toolbarOpts.alwaysVisible && toolbarOpts.position === 'top'
      },
      className
    );

    return (
      <div
        ref={ref => (this.wrapperRef = ref)}
        style={{ width: sizeStyle.width }}
        className={names}
      >
        <SlateEditor
          plugins={this.plugins}
          innerRef={r => {
            if (r) {
              this.slateEditor = r;
            }
          }}
          ref={r => (this.editor = r && this.props.editorRef(r))}
          toolbarRef={r => {
            if (r) {
              this.toolbarRef = r;
            }
          }}
          value={value}
          focus={this.focus}
          onKeyDown={onKeyDown}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onDrop={(event, editor) => this.onDropPaste(event, editor, true)}
          onPaste={(event, editor) => this.onDropPaste(event, editor)}
          onFocus={this.onFocus}
          onEditingDone={this.onEditingDone}
          focusedNode={focusedNode}
          normalize={this.normalize}
          readOnly={disabled}
          spellCheck={spellCheck}
          className={classNames(
            {
              [classes.noPadding]: toolbarOpts && toolbarOpts.noBorder
            },
            classes.slateEditor
          )}
          style={{
            minHeight: sizeStyle.minHeight,
            height: sizeStyle.height,
            maxHeight: sizeStyle.maxHeight
          }}
          pluginProps={pluginProps}
          toolbarOpts={toolbarOpts}
          placeholder={placeholder}
          renderPlaceholder={this.renderPlaceholder}
          onDataChange={this.changeData}
        />
      </div>
    );
  }
}

// TODO color - hardcoded gray background and keypad colors will need to change too
const styles = {
  withBg: {
    backgroundColor: 'rgba(0,0,0,0.06)'
  },
  slateEditor: {
    fontFamily: 'Roboto, sans-serif',

    '& table': {
      tableLayout: 'fixed',
      width: '100%',
      borderCollapse: 'collapse',
      color: color.text(),
      backgroundColor: color.background()
    },
    '& table:not([border="1"]) tr': {
      borderTop: '1px solid #dfe2e5'
      // TODO perhaps secondary color for background, for now disable
      // '&:nth-child(2n)': {
      //   backgroundColor: '#f6f8fa'
      // }
    },
    '& td, th': {
      padding: '.6em 1em',
      textAlign: 'center'
    },
    '& table:not([border="1"]) td, th': {
      border: '1px solid #dfe2e5'
    }
  },
  toolbarOnTop: {
    marginTop: '45px'
  },
  noPadding: {
    padding: '0 !important'
  }
};

export default withStyles(styles)(Editor);
