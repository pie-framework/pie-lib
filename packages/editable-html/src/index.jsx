import { Editor, findNode } from 'slate-react';
import { htmlToValue, valueToHtml } from './serialization';
import PropTypes from 'prop-types';
import React from 'react';
import { Value } from 'slate';
import { buildPlugins, DEFAULT_PLUGINS } from './plugins';
import debug from 'debug';
import { withStyles } from 'material-ui/styles';

export { htmlToValue, valueToHtml, DEFAULT_PLUGINS }


const log = debug('editable-html');

export class RawEditableHtml extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    markup: PropTypes.string.isRequired,
    imageSupport: PropTypes.object,
    activePlugins: PropTypes.arrayOf(PropTypes.string),
    width: PropTypes.string,
    height: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: htmlToValue(props.markup)
    }

    this.plugins = buildPlugins(props.activePlugins, {
      math: {
        onClick: this.onMathClick,
        onFocus: this.onPluginFocus,
        onBlur: this.onPluginBlur
      },
      image: {
        onDelete: this.props.imageSupport && this.props.imageSupport.delete && ((src, done) => {
          this.props.imageSupport.delete(src, e => {
            done(e, this.state.value);
          })
        }),
        insertImageRequested: this.props.imageSupport && ((getHandler) => {
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
        onDone: () => {
          log('[onDone]');
          this.setState({ toolbarInFocus: false, focusedNode: null });
          this.editor.blur();
          this.onEditingDone();
        }
      },
    });
  }

  onPluginBlur = (e) => {
    log('[onPluginBlur]', e.relatedTarget);
    const target = e.relatedTarget;

    const node = target ? findNode(target, this.state.value) : null;
    log('[onPluginBlur] node: ', node);
    this.setState({ focusedNode: node }, () => {
      this.resetValue();
    });
  }

  onPluginFocus = (e) => {
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
  }

  onMathClick = (node) => {
    this.editor.change(c =>
      c.collapseToStartOf(node)
    );
    this.setState({ selectedNode: node });
  }

  onEditingDone = () => {
    log('[onEditingDone]');
    this.setState({ stashedValue: null, focusedNode: null });
    log('[onEditingDone] value: ', this.state.value);
    const html = valueToHtml(this.state.value);
    this.props.onChange(html);
  }

  onBlur = (event) => {
    log('[onBlur]');
    const target = event.relatedTarget;

    const node = target ? findNode(target, this.state.value) : null;

    log('[onBlur] node: ', node);

    return new Promise(resolve => {
      this.setState({ focusedNode: node }, () => {
        this.resetValue().then(() => resolve());
      });
    });
  }

  onFocus = () => {
    log('[onFocus]', document.activeElement);
    this.stashValue();
  }

  stashValue = () => {
    log('[stashValue]');
    if (!this.state.stashedValue) {
      this.setState({ stashedValue: this.state.value });
    }
  }

  /**
   * Reset the value if the user didn't click done.
   */
  resetValue = () => {
    const { value, focusedNode } = this.state;

    const stopReset = this.plugins.reduce((s, p) => {
      return s || (p.stopReset && p.stopReset(this.state.value));
    }, false);

    log('[resetValue]', value.isFocused, focusedNode, 'stopReset: ', stopReset);
    if (this.state.stashedValue &&
      !value.isFocused &&
      !focusedNode && !stopReset) {
      log('[resetValue] resetting...');
      log('stashed', this.state.stashedValue.document.toObject())
      log('current', this.state.value.document.toObject())

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
  }

  onChange = (change) => {
    log('[onChange]');
    this.setState({ value: change.value });
  }

  componentWillReceiveProps(props) {
    if (props.markup !== this.props.markup) {
      this.setState({
        focus: false,
        value: htmlToValue(props.markup)
      });
    }
  }

  render() {
    const { width, height } = this.props;
    const { value, focusedNode } = this.state;
    const style = { width, height };
    log('[render]', value.document);


    return (
      <div style={style}>
        <Editor
          plugins={this.plugins}
          ref={r => this.editor = r}
          value={value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          focusedNode={focusedNode}
          style={style} />
      </div>
    );
  }
}

const EditableHtml = withStyles(() => ({
  editableHtml: {
    fontFamily: 'Roboto, sans-serif'
  }
}))(RawEditableHtml);

EditableHtml.propTypes = {
  markup: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  activePlugins: PropTypes.arrayOf((values) => {
    const allValid = values.every(v => DEFAULT_PLUGINS.includes(v));
    return !allValid &&
      new Error(`Invalid values: ${values}, values must be one of [${DEFAULT_PLUGINS.join(',')}]`)
  }),
  className: PropTypes.string,
  formatting: PropTypes.arrayOf(PropTypes.string)
}

export default EditableHtml;
