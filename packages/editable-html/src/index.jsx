import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Editor, { DEFAULT_PLUGINS, ALL_PLUGINS } from './editor';
import { htmlToValue, valueToHtml } from './serialization';
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
    markup: PropTypes.string.isRequired
  };

  static defaultProps = {
    onDone: () => {}
  };

  constructor(props) {
    super(props);

    const v = htmlToValue(props.markup);
    const mu = valueToHtml(v);

    if (mu !== props.markup) {
      props.onChange(mu);
    }

    this.state = {
      value: v
    };
  }

  componentWillReceiveProps(props) {
    if (props.markup === this.props.markup) {
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

    log('value as html: ', html);

    if (html !== this.props.markup) {
      this.props.onChange(html);
    }

    if (done) {
      this.props.onDone(html);
    }
  };

  focus = position => {
    if (this.editorRef) {
      this.editorRef.change(c => {
        const lastText = c.value.document.getLastText();

        document.activeElement.blur();

        c.focus();

        if (position === 'end') {
          c.moveFocusTo(lastText.key, lastText.text.length).moveAnchorTo(
            lastText.key,
            lastText.text.length
          );
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
      onChange: this.onChange
    };

    return <Editor editorRef={ref => ref && (this.editorRef = ref)} {...props} />;
  }
}
