import React from 'react';
import PropTypes from 'prop-types';
import { getMathLive, normalizeLatex } from './mathlive-instance';

export class Input extends React.Component {
  constructor(props) {
    super(props);
    this.hostRef = React.createRef();
    this.mathField = null;
  }

  componentDidMount() {
    getMathLive(); // trigger lazy load
    const MathfieldElement = window.customElements
      ? window.customElements.get('math-field')
      : null;

    if (!MathfieldElement && typeof window !== 'undefined') {
      const ml = getMathLive();
      if (!ml) return;
    }

    this.mathField = document.createElement('math-field');
    this.mathField.value = normalizeLatex(this.props.latex) || '';
    this.mathField.readOnly = this.props.readOnly || false;

    this.mathField.addEventListener('input', () => {
      if (this.props.onChange) {
        this.props.onChange(this.mathField.value);
      }
    });

    if (this.hostRef.current) {
      this.hostRef.current.appendChild(this.mathField);
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.mathField) return;
    if (prevProps.latex !== this.props.latex) {
      const normalized = normalizeLatex(this.props.latex) || '';
      if (this.mathField.value !== normalized) {
        this.mathField.value = normalized;
      }
    }
    if (prevProps.readOnly !== this.props.readOnly) {
      this.mathField.readOnly = this.props.readOnly || false;
    }
  }

  componentWillUnmount() {
    if (this.mathField && this.hostRef.current) {
      this.hostRef.current.removeChild(this.mathField);
    }
    this.mathField = null;
  }

  write(latex) {
    if (!this.mathField) return;
    this.mathField.insert(latex, { format: 'latex', focus: true });
  }

  command(latex) {
    if (!this.mathField) return;
    this.mathField.insert(latex, { format: 'latex', focus: true });
  }

  keystroke(key) {
    if (!this.mathField) return;
    this.mathField.executeCommand(key);
  }

  clear() {
    if (!this.mathField) return;
    this.mathField.value = '';
  }

  getLatex() {
    if (!this.mathField) return '';
    return this.mathField.value;
  }

  focus() {
    if (!this.mathField) return;
    this.mathField.focus();
  }

  blur() {
    if (!this.mathField) return;
    this.mathField.blur();
  }

  render() {
    const { className } = this.props;
    return <span ref={this.hostRef} className={className} />;
  }
}

Input.propTypes = {
  latex: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default Input;
