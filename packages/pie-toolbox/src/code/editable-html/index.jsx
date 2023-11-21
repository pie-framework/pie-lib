import React from 'react';
import PropTypes from 'prop-types';
import Editor, { DEFAULT_PLUGINS, ALL_PLUGINS } from './editor';
import { htmlToValue, valueToHtml, reduceMultipleBrs } from './serialization';
import { parseDegrees } from './parse-html';
import debug from 'debug';
import { Range } from 'slate';

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
    error: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onDone: PropTypes.func,
    markup: PropTypes.string.isRequired,
    allowValidation: PropTypes.bool,
    toolbarOpts: PropTypes.object,
  };

  static defaultProps = {
    onDone: () => {},
    allowValidation: false,
  };

  constructor(props) {
    super(props);
    const v = htmlToValue(props.markup);
    this.state = {
      value: v,
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    if (!props.allowValidation && props.markup === this.props.markup) {
      return;
    }

    const v = htmlToValue(props.markup);
    const current = htmlToValue(props.markup);

    if (v.equals && !v.equals(current)) {
      this.setState({ value: v });
    }
  }

  runSerializationOnMarkup = () => {
    if (!this.props.markup) {
      return;
    }

    const v = htmlToValue(reduceMultipleBrs(this.props.markup));

    this.setState({ value: v });
  };

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

  focus = (position, node, select = false) => {
    if (this.editorRef) {
      this.editorRef.change((c) => {
        const lastText = node ? c.value.document.getNextText(node.key) : c.value.document.getLastText();
        const editorDOM = document.querySelector(`[data-key="${this.editorRef.value.document.key}"]`);

        if (editorDOM !== document.activeElement) {
          document.activeElement.blur();
        }

        c.focus();

        if (position === 'end' && lastText) {
          c.moveFocusTo(lastText.key, lastText.text?.length).moveAnchorTo(lastText.key, lastText.text?.length);
          if (select) {
            const range = Range.fromJSON({
              anchorKey: lastText.key,
              anchorOffset: 0,
              focusKey: lastText.key,
              focusOffset: lastText.text?.length,
              isFocused: true,
              isBackward: false,
            });
            c.select(range);
          }
        }

        if (position === 'beginning' && lastText) {
          c.moveFocusTo(lastText.key, 0).moveAnchorTo(lastText.key, 0);
        }
        editorDOM.focus();
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
    const { toolbarOpts, error } = this.props;

    if (toolbarOpts) {
      toolbarOpts.error = error;
    }

    const props = {
      ...this.props,
      markup: null,
      value,
      onChange: this.onChange,
      focus: this.focus,
      runSerializationOnMarkup: this.runSerializationOnMarkup,
    };

    return (
      <Editor
        onRef={(ref) => {
          if (ref) {
            this.rootRef = ref;
          }
        }}
        editorRef={(ref) => ref && (this.editorRef = ref)}
        {...props}
      />
    );
  }
}
