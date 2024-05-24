import PropTypes from 'prop-types';
import React, { Component } from 'react';
import debug from 'debug';
import MathQuill from '@pie-framework/mathquill';
import { updateSpans } from '../updateSpans';

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

function countBraces(latex) {
  let count = 0;
  let inBrace = false;
  for (let i = 0; i < latex.length; i++) {
    if (latex[i] === '{') {
      count++;
      inBrace = true;
    } else if (latex[i] === '}') {
      inBrace = false;
    }
  }
  return count;
}

function containsSpecialSymbols(latex) {
  const specialSymbols = ['\\ne', '\\le', '\\div', '\\ge', '\\times', '\\pm'];
  return specialSymbols.some((symbol) => latex.includes(symbol));
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
      inputSource: null,
      previousHtml: '',
      isDeleteKeyPressed: false,
    };
  }

  componentDidMount() {
    this.update();
    updateSpans();

    // Create a live region when the component mounts
    this.liveRegion = document.createElement('div');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.marginTop = '-1px';
    this.liveRegion.style.clip = 'rect(1px, 1px, 1px, 1px)';
    this.liveRegion.style.overflow = 'hidden';
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');

    document.body.appendChild(this.liveRegion);

    // Add event listeners to detect input source
    this.input.addEventListener('keydown', this.handleKeyDown);
    this.input.addEventListener('click', this.handleMathKeyboardClick);
  }

  componentDidUpdate() {
    this.update();
    updateSpans();
  }

  componentWillUnmount() {
    if (this.liveRegion) {
      document.body.removeChild(this.liveRegion);
      this.liveRegion = null;
    }

    // Remove event listeners
    this.input.removeEventListener('keydown', this.handleKeyDown);
    this.input.removeEventListener('click', this.handleMathKeyboardClick);
  }

  handleKeyDown = (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.setState({ isDeleteKeyPressed: true });
    }
    this.setState({ inputSource: 'keyboard' });
  };

  handleMathKeyboardClick = () => {
    this.setState({ inputSource: 'mathKeyboard' });
  };

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

    const { previousLatex, inputSource, isDeleteKeyPressed } = this.state;
    const announcement = `Converted to math symbol`;

    if (inputSource === 'keyboard' && !isDeleteKeyPressed) {
      const newBraces = countBraces(newLatex);
      const oldBraces = countBraces(previousLatex);

      if (newBraces > oldBraces) {
        this.announceMessage(announcement);
      } else {
        try {
          // Try parsing the new LaTeX
          this.mathField.parseLatex(previousLatex);
          this.mathField.parseLatex(newLatex);

          if (newLatex == previousLatex) {
            this.announceMessage(announcement);
          }
        } catch (e) {
          console.warn('Error parsing latex:', e.message);
          console.warn(e);
        }
      }
    }

    this.setState({ previousLatex: newLatex });
  };

  announceMessage = (message) => {
    this.setState({ previousLatex: '' });

    if (this.liveRegion) {
      this.liveRegion.textContent = message;

      // Clear the message after it is announced
      setTimeout(() => {
        this.liveRegion.textContent = '';
      }, 500);
    }
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

  blur = () => {
    log('blur mathfield');
    this.mathField.blur();
  };

  focus = () => {
    log('focus mathfield...');
    this.mathField.focus();
  };

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

    return <span className={className} onFocus={this.onFocus} onBlur={onBlur} ref={(r) => (this.input = r)}></span>;
  }
}
