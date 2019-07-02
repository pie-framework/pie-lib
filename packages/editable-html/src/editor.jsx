import { Editor as SlateEditor, findNode } from 'slate-react';
import SlateTypes from 'slate-prop-types';

import * as serialization from './serialization';
import PropTypes from 'prop-types';
import React from 'react';
import { Value, Block } from 'slate';
import { buildPlugins, ALL_PLUGINS, DEFAULT_PLUGINS } from './plugins';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
export { ALL_PLUGINS, DEFAULT_PLUGINS, serialization };

const log = debug('editable-html:editor');

export class Editor extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    editorRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    value: SlateTypes.value.isRequired,
    imageSupport: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    classes: PropTypes.object.isRequired,
    highlightShape: PropTypes.bool,
    disabled: PropTypes.bool,
    nonEmpty: PropTypes.bool,
    disableUnderline: PropTypes.bool,
    autoWidthToolbar: PropTypes.bool,
    pluginProps: PropTypes.any,
    responseAreaProps: PropTypes.shape({
      type: PropTypes.oneOf([
        'explicit-constructed-response',
        'inline-dropdown',
        'drag-in-the-blank'
      ]),
      options: PropTypes.object,
      respAreaToolbar: PropTypes.func,
      onDelete: PropTypes.func
    }),
    toolbarOpts: PropTypes.shape({
      position: PropTypes.oneOf(['bottom', 'top']),
      alwaysVisible: PropTypes.bool
    }),
    activePlugins: PropTypes.arrayOf(values => {
      const allValid = values.every(v => ALL_PLUGINS.includes(v));

      return (
        !allValid &&
        new Error(`Invalid values: ${values}, values must be one of [${ALL_PLUGINS.join(',')}]`)
      );
    }),
    className: PropTypes.string
  };

  static defaultProps = {
    disableUnderline: true,
    onFocus: () => {},
    toolbarOpts: {
      position: 'bottom',
      alwaysVisible: false
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };

    this.plugins = buildPlugins(props.activePlugins, {
      math: {
        onClick: this.onMathClick,
        onFocus: this.onPluginFocus,
        onBlur: this.onPluginBlur
      },
      image: {
        onDelete:
          this.props.imageSupport &&
          this.props.imageSupport.delete &&
          ((src, done) => {
            this.props.imageSupport.delete(src, e => {
              done(e, this.state.value);
            });
          }),
        insertImageRequested:
          this.props.imageSupport &&
          (getHandler => {
            /**
             * The handler is the object through which the outer context
             * communicates file upload events like: fileChosen, cancel, progress
             */
            const handler = getHandler(() => this.state.value);
            this.props.imageSupport.add(handler);
          }),
        onFocus: this.onPluginFocus,
        onBlur: this.onPluginBlur
      },
      toolbar: {
        /**
         * To minimize converting html -> state -> html
         * We only emit markup once 'done' is clicked.
         */
        disableUnderline: props.disableUnderline,
        autoWidth: props.autoWidthToolbar,
        onDone: () => {
          const { nonEmpty } = this.props;

          log('[onDone]');
          this.setState({ toolbarInFocus: false, focusedNode: null });
          this.editor.blur();

          if (nonEmpty && this.state.value.startText.text.length === 0) {
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
        type: props.responseAreaProps && props.responseAreaProps.type,
        options: props.responseAreaProps && props.responseAreaProps.options,
        respAreaToolbar: props.responseAreaProps && props.responseAreaProps.respAreaToolbar,
        onFocus: () => {
          log('[table:onFocus]...');
          this.onPluginFocus();
        },
        onBlur: () => {
          log('[table:onBlur]...');
          this.onPluginBlur();
        }
      }
    });
  }

  componentDidMount() {
    if (this.editor && this.props.autoFocus) {
      setTimeout(() => {
        const editorDOM = document.querySelector(`[data-key="${this.editor.value.document.key}"]`);

        this.editor.focus();

        if (editorDOM) {
          editorDOM.focus();
        }
      }, 0);
    }
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

  onBlur = event => {
    log('[onBlur]');
    const target = event.relatedTarget;

    const node = target ? findNode(target, this.state.value) : null;

    log('[onBlur] node: ', node);

    return new Promise(resolve => {
      this.setState({ focusedNode: node }, () => {
        this.resetValue().then(() => resolve());
      });
    });
  };

  /*
   * Needs to be wrapped otherwise it causes issues because of race conditions
   * Known issue for slatejs. See: https://github.com/ianstormtaylor/slate/issues/2097
   * Using timeout I wasn't able to test this
   * */
  onFocus = () =>
    new Promise(resolve => {
      log('[onFocus]', document.activeElement);

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
    const { onTemporaryChange } = this.props;

    log('[onChange]');
    this.setState({ value: change.value }, () => {
      log('[onChange], call done()');
      if (done) {
        done();
      }

      if (onTemporaryChange) {
        onTemporaryChange(this.state.value);
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
      } else if (v.endsWith('px')) {
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
    const { width, height } = this.props;

    return {
      width: this.valueToSize(width),
      height: this.valueToSize(height)
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

  render() {
    const {
      autoFocus,
      disabled,
      highlightShape,
      classes,
      className,
      placeholder,
      pluginProps,
      toolbarOpts
    } = this.props;
    const { value, focusedNode } = this.state;

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
      <div style={{ width: sizeStyle.width }} className={names}>
        <SlateEditor
          autoFocus={autoFocus}
          plugins={this.plugins}
          ref={r => (this.editor = r && this.props.editorRef(r))}
          value={value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onEditingDone={this.onEditingDone}
          focusedNode={focusedNode}
          normalize={this.normalize}
          readOnly={disabled}
          className={classes.slateEditor}
          style={{ height: sizeStyle.height }}
          pluginProps={pluginProps}
          toolbarOpts={toolbarOpts}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

const styles = {
  withBg: {
    backgroundColor: 'rgba(0,0,0,0.06)'
  },
  slateEditor: {
    fontFamily: 'Roboto, sans-serif'
  },
  toolbarOnTop: {
    marginTop: '45px'
  }
};

export default withStyles(styles)(Editor);
