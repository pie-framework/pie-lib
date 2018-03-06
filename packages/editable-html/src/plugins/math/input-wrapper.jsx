import { EditableMathInput } from '@pie-lib/math-input';
import React from 'react';

/**
 * Exposes a change function that will update a math input 
 * while editing is true.
 */
export default class MathWrapper extends React.Component {

  change(c) {
    const { editing } = this.props;
    if (!editing || !this.input) {
      return;
    }

    if (c) {
      if (c.type === 'blur') {
        this.input.blur();
        return this.props.latex;
      } else if (c.type === 'clear') {
        return this.input.clear();
      } else if (c.type === 'command') {
        return this.input.command(c.value);
      } else if (c.type === 'cursor') {
        return this.input.keystroke(c.value);
      } else {
        return this.input.write(c.value);
      }
    }
  }

  render() {

    const { latex, editing, onClick, onChange, onFocus, onBlur } = this.props;

    return (
      <EditableMathInput
        ref={r => this.input = r}
        latex={latex}
        editing={!!editing}
        onClick={onClick}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur} />
    );
  }
}
