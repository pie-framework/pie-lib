import EditableMathInput from '../src/editable-math-input';
import Keypad from '../src/keypad';
import React from 'react';
import ReactDOM from 'react-dom';

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      latex: '\\frac{3}{2}',
      readOnly: true
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(latex) {
    this.setState({ latex });
  }

  onInputClick = (event) => {
    event.preventDefault();
    this.setState({ editing: true });
  }

  onPadClick = (changeData) => {
    if (this.state.editing) {
      this.wrapper.change(changeData);
    }
  }

  render() {
    const { readOnly, latex, editing } = this.state;
    return <div>
      <Checkbox
        label={'editing?'}
        checked={editing}
        onChange={(checked) => this.setState({ editing: checked })} />
      {/* <label> Read Only ?
        <input type="checkbox" checked={readOnly} onChange={() => this.setState({ readOnly: !this.state.readOnly })} />
      </label> */}
      <span>editing: {editing ? 'yes' : 'no'}</span>
      <br />
      <MathWrapper
        ref={r => this.wrapper = r}
        latex={latex}
        editing={editing}
        onChange={this.onChange}
        onClick={this.onInputClick}>
      </MathWrapper>
      <Keypad
        onClick={this.onPadClick} />
      <pre>{JSON.stringify(latex, null, '  ')}</pre>
    </div>
  }
}
class MathWrapper extends React.Component {

  constructor(props) {
    super(props);
  }

  change(c) {
    const { editing } = this.props;
    if (!editing || !this.input) {
      return;
    }

    if (c) {
      if (c.type === 'clear') {
        this.input.clear();
      } else if (c.type === 'command') {
        this.input.command(c.value);
      } else if (c.type === 'cursor') {
        this.input.keystroke(c.value);
      } else {
        this.input.write(c.value);
      }
    }
  }

  render() {

    const { latex, editing, onClick, onChange } = this.props;

    return (
      <EditableMathInput
        ref={r => this.input = r}
        latex={latex}
        editing={editing}
        onClick={onClick}
        onChange={onChange} />
    );
  }
}

class Checkbox extends React.Component {

  constructor(props) {
    super(props);
  }

  onChange = (event) => {
    this.props.onChange(event.target.checked)
  }

  render() {

    const { label, onChange, checked } = this.props;

    return (<label>
      {label}
      <input
        type="checkbox"
        checked={!!checked}
        onChange={this.onChange} />
    </label>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const e = React.createElement(Demo, {});
  ReactDOM.render(e, document.querySelector('#app'));
});