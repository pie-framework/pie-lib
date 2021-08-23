import React from 'react';
import PropTypes from 'prop-types';
import Editor, { DEFAULT_PLUGINS, ALL_PLUGINS } from './editor';
import { htmlToValue, valueToHtml } from './serialization';
import { parseDegrees } from './parse-html';
import debug from 'debug';

const log = debug('@pie-lib:editable-html');
/**
 * Export lower level Editor and serialization functions.
 */
export { htmlToValue, valueToHtml, Editor, DEFAULT_PLUGINS, ALL_PLUGINS };

/**
 * Wrapper around the editor that exposes a `markup` and `onChange(markup:string)` api.
 * Because of the mismatch between the markup and the `Value` we need to convert the incoming markup to a value and
 * compare it. TODO: This is an interim fix, we'll need to strip back `Editor` and look how best to maintain the
 * `markup` api whilst avoiding the serialization mismatch. We should be making better use of schemas w/ normalize.
 */
export default class EditableHtml extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onDone: PropTypes.func,
    markup: PropTypes.string.isRequired,
    allowValidation: PropTypes.bool
  };

  static defaultProps = {
    onDone: () => {},
    allowValidation: false
  };

  constructor(props) {
    super(props);
    const v = htmlToValue(props.markup);
    this.state = {
      value: v
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    if (!props.allowValidation && props.markup === this.props.markup) {
      return;
    }

    const v = htmlToValue(props.markup);
    const current = htmlToValue(this.props.markup);

    if (!v.equals(current)) {
      this.setState({ value: v });
    }
  }

  onChange = (value, done) => {
    const html = valueToHtml(value);
    const htmlParsed = parseDegrees(html);

    log('value as html: ', html);

    if (html !== this.props.markup) {
      this.props.onChange(htmlParsed);
    }

    if (done) {
      this.props.onDone(htmlParsed);
    }
  };

  focus = (position, node) => {
    if (this.editorRef) {
      this.editorRef.change(c => {
        const lastText = node
          ? c.value.document.getNextText(node.key)
          : c.value.document.getLastText();
        const editorDOM = document.querySelector(
          `[data-key="${this.editorRef.value.document.key}"]`
        );

        if (editorDOM !== document.activeElement) {
          document.activeElement.blur();
        }

        c.focus();

        if (position === 'end' && lastText) {
          c.moveFocusTo(lastText.key, lastText.text.length).moveAnchorTo(
            lastText.key,
            lastText.text.length
          );
        }

        if (position === 'beginning' && lastText) {
          c.moveFocusTo(lastText.key, 0).moveAnchorTo(lastText.key, 0);
        }
      });
    }
  };

  finishEditing = () => {
    if (this.editorRef) {
      this.editorRef.props.onEditingDone();
    }
  };

  render() {
    const { value } = this.state;
    const props = {
      ...this.props,
      markup: null,
      value,
      onChange: this.onChange,
      focus: this.focus
    };

    return (
      <Editor
        onRef={ref => {
          if (ref) {
            this.rootRef = ref;
          }
        }}
        editorRef={ref => ref && (this.editorRef = ref)}
        {...props}
      />
    );
  }
}
