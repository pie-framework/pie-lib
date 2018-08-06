import { Editor as SlateEditor, findNode } from 'slate-react';
import SlateTypes from 'slate-prop-types';

import * as serialization from './serialization';
import PropTypes from 'prop-types';
import React from 'react';
import { Value, Block } from 'slate';
import { buildPlugins, DEFAULT_PLUGINS } from './plugins';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
export { DEFAULT_PLUGINS, serialization };

const log = debug('editable-html:editor');

export class Editor extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: SlateTypes.value.isRequired,
    imageSupport: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    classes: PropTypes.object.isRequired,
    highlightShape: PropTypes.bool,
    disabled: PropTypes.bool,
    autoWidthToolbar: PropTypes.bool,
    activePlugins: PropTypes.arrayOf(values => {
      const allValid = values.every(v => DEFAULT_PLUGINS.includes(v));
      return (
        !allValid &&
        new Error(
          `Invalid values: ${values}, values must be one of [${DEFAULT_PLUGINS.join(
            ','
          )}]`
        )
      );
    }),
    className: PropTypes.string
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
        autoWidth: props.autoWidthToolbar,
        onDone: () => {
          log('[onDone]');
          this.setState({ toolbarInFocus: false, focusedNode: null });
          this.editor.blur();
          this.onEditingDone();
        }
      }
    });
  }

  onPluginBlur = e => {
    log('[onPluginBlur]', e.relatedTarget);
    const target = e.relatedTarget;

    const node = target ? findNode(target, this.state.value) : null;
    log('[onPluginBlur] node: ', node);
    this.setState({ focusedNode: node }, () => {
      this.resetValue();
    });
  };

  onPluginFocus = e => {
    log('[onPluginFocus]', e.target);
    const target = e.target;
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
    this.props.onChange(this.state.value);
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

  onFocus = () => {
    log('[onFocus]', document.activeElement);
    this.stashValue();
  };

  stashValue = () => {
    log('[stashValue]');
    if (!this.state.stashedValue) {
      this.setState({ stashedValue: this.state.value });
    }
  };

  /**
   * Reset the value if the user didn't click done.
   */
  resetValue = () => {
    const { value, focusedNode } = this.state;

    const stopReset = this.plugins.reduce((s, p) => {
      return s || (p.stopReset && p.stopReset(this.state.value));
    }, false);

    log('[resetValue]', value.isFocused, focusedNode, 'stopReset: ', stopReset);
    if (
      this.state.stashedValue &&
      !value.isFocused &&
      !focusedNode &&
      !stopReset
    ) {
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
    this.setState({ value: change.value }, () => {
      log('[onChange], call done()');
      if (done) {
        done();
      }
    });
  };

  componentWillReceiveProps(props) {
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
    const { disabled, highlightShape, classes, className } = this.props;
    const { value, focusedNode } = this.state;

    log('[render] value: ', value);
    const sizeStyle = this.buildSizeStyle();

    return (
      <div
        style={sizeStyle}
        className={classNames(highlightShape && classes.withBg, className)}
      >
        <SlateEditor
          plugins={this.plugins}
          ref={r => (this.editor = r)}
          value={value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          focusedNode={focusedNode}
          readOnly={disabled}
          className={classes.slateEditor}
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
    height: '100%',
    fontFamily: 'Roboto, sans-serif'
  }
};
export default withStyles(styles)(Editor);
