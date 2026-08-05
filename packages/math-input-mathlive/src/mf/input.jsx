import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import debug from 'debug';
import { loadMathLive, getMacros } from '../mathlive-instance';
import { toMathLive, fromMathLive } from '../latex-bridge';

const log = debug('pie-lib:math-input-mathlive:input');

const Holder = styled('span')({
  display: 'inline-block',
  '& math-field': {
    display: 'block',
    width: '100%',
  },
  // MathLive ships its own virtual keyboard toggle; pie supplies its own keypad.
  '& math-field::part(virtual-keyboard-toggle)': {
    display: 'none',
  },
  '& math-field::part(menu-toggle)': {
    display: 'none',
  },
});

/**
 * Editable math field. Drop-in replacement for @pie-lib/math-input's `mq.Input`.
 *
 * Keeps the same imperative surface used by MathInput's keypad
 * (`write`, `command`, `keystroke`, `clear`, `focus`, `blur`) so callers do not
 * change, and the same `latex` / `onChange` props.
 */
export class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    latex: PropTypes.string,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    innerRef: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.holderRef = React.createRef();
    // Tracks the last latex we emitted, so prop echoes don't reset the cursor.
    this.lastEmitted = undefined;
  }

  async componentDidMount() {
    const ml = await loadMathLive();

    if (!ml || !this.holderRef.current) {
      return;
    }

    this.mathField = new ml.MathfieldElement({ macros: getMacros() });
    this.mathField.value = toMathLive(this.props.latex || '');

    if (this.props.readOnly) {
      this.mathField.readOnly = true;
    }

    // pie drives input through its own keypad, so suppress MathLive's.
    this.mathField.mathVirtualKeyboardPolicy = 'manual';

    this.mathField.addEventListener('input', this.onInputEdit);
    this.holderRef.current.appendChild(this.mathField);

    if (this.props.innerRef) {
      this.props.innerRef(this);
    }

    this.setState?.({});
  }

  componentDidUpdate(prevProps) {
    if (!this.mathField) {
      return;
    }

    const { latex, readOnly } = this.props;

    if (readOnly !== prevProps.readOnly) {
      this.mathField.readOnly = !!readOnly;
    }

    // Only push the prop back into the field when it genuinely differs from
    // what the field already holds. This is the analogue of the old
    // shouldComponentUpdate latex-equality guard and prevents cursor thrash.
    if (latex !== undefined && latex !== null && latex !== this.lastEmitted) {
      const next = toMathLive(latex);

      if (next !== this.mathField.value) {
        this.mathField.value = next;
      }
    }
  }

  componentWillUnmount() {
    if (this.mathField) {
      this.mathField.removeEventListener('input', this.onInputEdit);
      this.mathField.remove();
      this.mathField = undefined;
    }

    if (this.props.innerRef) {
      this.props.innerRef(null);
    }
  }

  onInputEdit = () => {
    const { onChange } = this.props;

    if (!this.mathField) {
      return;
    }

    const latex = fromMathLive(this.mathField.getValue('latex'));

    this.lastEmitted = latex;

    if (onChange) {
      onChange(latex);
    }
  };

  /** Current latex, in stored (MathQuill-compatible) form. */
  latex() {
    return this.mathField ? fromMathLive(this.mathField.getValue('latex')) : '';
  }

  clear() {
    if (this.mathField) {
      this.mathField.value = '';
    }

    return '';
  }

  blur() {
    log('blur mathfield');
    this.mathField && this.mathField.blur();
  }

  focus() {
    log('focus mathfield...');
    this.mathField && this.mathField.focus();
  }

  /** MathQuill `cmd()` equivalent. */
  command(v) {
    log('command: ', v);

    if (!this.mathField) {
      return '';
    }

    const values = Array.isArray(v) ? v : [v];

    values.forEach((vv) => this.mathField.insert(vv, { focus: true }));
    this.mathField.focus();

    return this.latex();
  }

  /** MathQuill `keystroke()` equivalent - takes a MathLive selector. */
  keystroke(selector) {
    if (!this.mathField) {
      return '';
    }

    this.mathField.executeCommand(selector);
    this.mathField.focus();

    return this.latex();
  }

  /** MathQuill `write()` equivalent. Accepts an array, as `cmd()` did. */
  write(v) {
    log('write: ', v);

    if (!this.mathField) {
      return '';
    }

    const values = Array.isArray(v) ? v : [v];

    values.forEach((vv) => this.mathField.insert(vv, { focus: true }));
    this.mathField.focus();

    return this.latex();
  }

  /**
   * Enter must not insert a line break: math input is single-expression, and
   * the MathQuill version swallowed charCode 13 for the same reason. Newlines
   * are authored explicitly through the newLine embed, not the Enter key.
   */
  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  render() {
    const { className, onFocus, onBlur, onClick } = this.props;

    return (
      <Holder
        className={className}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onKeyDown={this.onKeyDown}
        ref={this.holderRef}
      />
    );
  }
}

export default Input;
