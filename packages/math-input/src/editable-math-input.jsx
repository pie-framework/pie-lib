import MathQuill from 'mathquill';
import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
const MQ = MathQuill.getInterface(2);

const log = debug('math-input:editable-math-input');

/**
 * Wrapper for MathQuill MQ.MathField.
 */
export default class EditableMathInput extends React.PureComponent {

  componentDidMount() {
    this.mathField = MQ.MathField(this.input, {
      handlers: {
        edit: this.onInputEdit.bind(this)
      }
    });
    this.mathField.latex(this.props.latex);
  }

  clear() {
    this.mathField.latex('');
    return '';
  }

  blur() {
    log('blur mathfield');
    this.mathField.blur();
  }

  focus() {
    log('focus mathfield...');
    this.mathField.focus();
  }

  command(v) {
    this.mathField.cmd(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  keystroke(v) {
    this.mathField.keystroke(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  write(v) {
    this.mathField.write(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  onInputEdit(e) {
    log('[onInputEdit] ...');

    if (!this.mathField) {
      return;
    }

    this.props.onChange(this.mathField.latex());
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.latex !== this.mathField.latex();
  }

  render() {
    const { onClick, onFocus, onBlur } = this.props;

    return (
      <span
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={r => this.input = r}></span>
    );
  }
}

EditableMathInput.propTypes = {
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  latex: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired
}