import MathInput, { HorizontalKeypad } from '../src';

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

  render() {
    const { readOnly, latex } = this.state;
    return <div>
      <label> Read Only ?
        <input type="checkbox" checked={readOnly} onChange={() => this.setState({ readOnly: !this.state.readOnly })} />
      </label>
      <HorizontalKeypad />
      <pre>{JSON.stringify(latex, null, '  ')}</pre>
    </div>
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const e = React.createElement(Demo, {});
  ReactDOM.render(e, document.querySelector('#app'));
});