import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';

let MQ;
if (typeof window !== 'undefined') {
  const MathQuill = require('mathquill');
  MQ = MathQuill.getInterface(2);
}

const log = debug('pie-lib:math-input:mq:static');
const REGEX = /\\MathQuillMathField\[answerBlock\d*\]\{(.*?)\}/g;

/**
 * Wrapper for MathQuill MQ.MathField.
 */
export default class Static extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string
  };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  findName(field) {
    if (!this.mathField) {
      return;
    }
    const iter = this.mathField.innerFields.keys();
    let v = iter.next();
    do {
      v = iter.next();
    } while (!v.done);
  }
  onInputEdit(field) {
    if (!this.mathField) {
      return;
    }
    const name = this.props.getFieldName(field, this.mathField.innerFields);
    if (this.props.onSubFieldChange) {
      this.props.onSubFieldChange(name, field.latex());
    }
  }

  update() {
    if (!MQ) {
      throw new Error('MQ is not defined - but component has mounted?');
    }
    // this.input.innerHTML = this.props.latex;
    if (!this.mathField) {
      this.mathField = MQ.StaticMath(this.input, {
        handlers: {
          edit: this.onInputEdit.bind(this)
        }
      });
    }

    this.mathField.latex(this.props.latex);
  }

  blur() {
    log('blur mathfield');
    this.mathField.blur();
  }

  focus() {
    log('focus mathfield...');
    this.mathField.focus();
  }

  shouldComponentUpdate(nextProps) {
    const nextLatex = nextProps.latex.replace(REGEX, (match, submatch) => submatch);
    const newFieldCount = ((nextProps.latex).match(REGEX) || []).length;

    return (nextLatex !== this.mathField.latex()) || (newFieldCount !== Object.keys(this.mathField.innerFields).length / 2);
  }

  render() {
    const { onFocus, onBlur, className } = this.props;

    return (
      <span
        className={className}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={r => (this.input = r)}
      />
    );
  }
}
