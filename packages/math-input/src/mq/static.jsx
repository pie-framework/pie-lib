import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import MathQuill from '@pie-framework/mathquill';
import { updateSpans } from '../index';

let MQ;
if (typeof window !== 'undefined') {
  MQ = MathQuill.getInterface(2);
}

const log = debug('pie-lib:math-input:mq:static');
const REGEX = /\\MathQuillMathField\[r\d*\]\{(.*?)\}/g;
const WHITESPACE_REGEX = / /g;

function stripSpaces(string = '') {
  return string.replace(WHITESPACE_REGEX, '');
}

/**
 * Wrapper for MathQuill MQ.MathField.
 */
export default class Static extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    getFieldName: PropTypes.func,
    onSubFieldChange: PropTypes.func,
    onSubFieldFocus: PropTypes.func,
    setInput: PropTypes.func
  };

  componentDidMount() {
    this.update();
    updateSpans();
  }

  componentDidUpdate() {
    this.update();
    updateSpans();
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
    try {
      const parsedLatex = this.mathField.parseLatex(nextProps.latex);
      const stripped = stripSpaces(parsedLatex);
      const newFieldCount = (nextProps.latex.match(REGEX) || []).length;

      const out =
        stripped !== stripSpaces(this.mathField.latex().trim()) ||
        newFieldCount !== Object.keys(this.mathField.innerFields).length / 2;

      log('[shouldComponentUpdate] ', out);
      return out;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error parsing latex:', e.message, 'skip update');
      // eslint-disable-next-line no-console
      console.warn(e);
      return false;
    }
  }

  onFocus = e => {
    try {
      let rootBlock = e.target.parentElement.nextSibling;
      let id = parseInt(rootBlock.getAttribute('mathquill-block-id'), 10);

      if (!id) {
        rootBlock = rootBlock.parentElement;
        id = parseInt(rootBlock.getAttribute('mathquill-block-id'), 10);
      }

      const innerField = this.mathField.innerFields.find(f => f.id === id);

      if (innerField) {
        const name = this.props.getFieldName(innerField, this.mathField.innerFields);
        if (this.props.setInput) {
          this.props.setInput(innerField);
        }
        this.props.onSubFieldFocus(name, innerField);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('error finding root block', err.message);
    }
  };

  render() {
    const { onBlur, className } = this.props;

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
