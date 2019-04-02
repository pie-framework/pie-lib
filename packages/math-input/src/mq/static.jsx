import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';

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
export class Static extends React.Component {
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
    const parsed = this.mathField.parseLatex(nextProps.latex);

    log('[shouldComponentUpdate] parsed:', parsed);
    log('[shouldComponentUpdate] currentLatex:', this.mathField.latex());
    const newFieldCount = (nextProps.latex.match(REGEX) || []).length;

    const out =
      parsed !== this.mathField.latex() ||
      newFieldCount !== Object.keys(this.mathField.innerFields).length / 2;

    log('[shouldComponentUpdate] ', out);
    return out;
  }

  onFocus = e => {
    try {
      const rootBlock = e.target.parentElement.nextSibling;
      const id = parseInt(rootBlock.getAttribute('mathquill-block-id'), 10);
      const innerField = this.mathField.innerFields.find(f => f.id === id);

      if (innerField) {
        const name = this.props.getFieldName(
          innerField,
          this.mathField.innerFields
        );
        if (this.props.setInput) {
          this.props.setInput(innerField);
        }
        this.props.onSubFieldFocus(name, innerField);
      }
    } catch (err) {
      console.error('error finding root block', err.message);
    }
  };

  render() {
    const { onBlur, className, classes } = this.props;

    return (
      <span
        className={className}
        onFocus={this.onFocus}
        onBlur={onBlur}
        ref={r => (this.input = r)}
      />
    );
  }
}

export default withStyles(theme => ({
  tmpSpan: {
    display: 'none',
    position: 'absolute',
    width: 0,
    height: 0
  }
}))(Static);
