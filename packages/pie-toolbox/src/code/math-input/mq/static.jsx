import PropTypes from 'prop-types';
import React, { Component } from 'react';
import debug from 'debug';
import MathQuill from '@pie-framework/mathquill';
import { updateSpans } from '../updateSpans';
import LiveRegion from './live-region';

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

export default class Static extends Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    getFieldName: PropTypes.func,
    onSubFieldChange: PropTypes.func,
    onSubFieldFocus: PropTypes.func,
    setInput: PropTypes.func,
  };

  static defaultProps = {
    getFieldName: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      announcement: '',
      previousLatex: '',
    };
  }

  componentDidMount() {
    this.update();
    updateSpans();
  }

  componentDidUpdate() {
    this.update();
    updateSpans();
  }

  onInputEdit = (field) => {
    if (!this.mathField) {
      return;
    }
    const name = this.props.getFieldName(field, this.mathField.innerFields);

    if (this.props.onSubFieldChange) {
      const regexMatch = field.latex().match(/[0-9]\\ \\frac\{[^\{]*\}\{ \}/);

      if (this.input && regexMatch && regexMatch.length) {
        try {
          field.__controller.cursor.insLeftOf(field.__controller.cursor.parent[-1].parent);
          field.el().dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8 }));
        } catch (e) {
          console.error(e.toString());
        }
      } else {
        this.props.onSubFieldChange(name, field.latex());
      }
    }

    this.announceLatexConversion(field.latex());
  };

  announceLatexConversion = (newLatex) => {
    if (!this.state) {
      console.error('State is not initialized');
      return;
    }

    const { previousLatex } = this.state;
    if (previousLatex !== newLatex && previousLatex.length > 0 && newLatex.endsWith('{ }')) {
      const announcement = `Converted from "${previousLatex}" to "${newLatex}"`;
      this.announceMessage(announcement);
    }

    this.setState({ previousLatex: newLatex });
  };

  announceMessage = (message) => {
    console.log('Announcing message:', message);
    const event = new CustomEvent('announce', { detail: message });
    document.dispatchEvent(event);
  };

  update = () => {
    if (!MQ) {
      throw new Error('MQ is not defined - but component has mounted?');
    }
    if (!this.mathField) {
      this.mathField = MQ.StaticMath(this.input, {
        handlers: {
          edit: this.onInputEdit,
        },
      });
    }

    try {
      this.mathField.parseLatex(this.props.latex);
      this.mathField.latex(this.props.latex);
    } catch (e) {
      this.mathField.latex('\\MathQuillMathField[r1]{}');
    }
  };

  blur() {
    log('blur mathfield');
    this.mathField.blur();
  }

  focus() {
    log('focus mathfield...');
    this.mathField.focus();
  }

  shouldComponentUpdate(nextProps, nextState) {
    try {
      const parsedLatex = this.mathField.parseLatex(nextProps.latex);
      const stripped = stripSpaces(parsedLatex);
      const newFieldCount = (nextProps.latex.match(REGEX) || []).length;

      return (
        stripped !== stripSpaces(this.mathField.latex().trim()) ||
        newFieldCount !== Object.keys(this.mathField.innerFields).length / 2
      );
    } catch (e) {
      console.warn('Error parsing latex:', e.message, 'skip update');
      return false;
    }
  }

  onFocus = (e) => {
    try {
      let rootBlock = e.target.parentElement.nextSibling;
      let id = parseInt(rootBlock.getAttribute('mathquill-block-id'), 10);

      if (!id) {
        rootBlock = rootBlock.parentElement;
        id = parseInt(rootBlock.getAttribute('mathquill-block-id'), 10);
      }

      const innerField = this.mathField.innerFields.find((f) => f.id === id);

      if (innerField) {
        const name = this.props.getFieldName(innerField, this.mathField.innerFields);
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
    const { onBlur, className } = this.props;

    return (
      <span className={className} onFocus={this.onFocus} onBlur={onBlur} ref={(r) => (this.input = r)}>
        <LiveRegion />
      </span>
    );
  }
}
