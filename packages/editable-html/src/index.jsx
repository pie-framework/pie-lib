import React from 'react';
import PropTypes from 'prop-types';
import Editor from './editor';
import { htmlToValue, valueToHtml } from './serialization';

/**
 * Export lower level Editor and serialization functions.
 */
export { htmlToValue, valueToHtml, Editor }

/**
 * Wrapper around the editor that exposes a `markup` and `onChange(markup:string)` api.
 * Because of the mismatch between the markup and the `Value` we need to convert the incoming markup to a value and compare it.
 * TODO: This is an interim fix, we'll need to strip back `Editor` and look how best to maintain the `markup` api whilst avoiding the serialization mismatch.
 * We should be making better use of schemas w/ normalize.
 */
export default class EditableHtml extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    markup: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    const v = htmlToValue(props.markup);
    const mu = valueToHtml(v);

    if (mu !== props.markup) {
      props.onChange(mu);
    }

    this.state = {
      value: v
    }
  }

  componentWillReceiveProps(props) {

    const v = htmlToValue(props.markup)
    const current = htmlToValue(this.props.markup);

    if (!v.equals(current)) {
      this.setState({ value: v });
    }
  }

  onChange = value => {
    const html = valueToHtml(value);

    if (html !== this.props.markup) {
      this.props.onChange(html);
    }
  }

  render() {
    const { value } = this.state;
    const props = { ...this.props, markup: null, value, onChange: this.onChange }
    return <Editor {...props} />;
  }
}