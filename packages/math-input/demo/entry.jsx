import { HorizontalKeypad, EditableMathInput } from '../src';

import React from 'react';
import ReactDOM from 'react-dom';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latex: '\\frac{3}{2}',
      readOnly: true
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(latex) {
    this.setState({ latex });
  }

  onClick(data) {
    console.log('onClick', data.value, data.type);
  }

  onInputChange(latex) {
    console.log('onInputChange', latex);
  }
  render() {
    const { readOnly, latex } = this.state;
    return (
      <div>
        <div>
          <p>This is a math input based in MathQuill.</p>
          <EditableMathInput
            latex={'\\frac{1}{2}'}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <p>This is a keypad you can add an 'onClick' to.</p>
          <label>
            {' '}
            Read Only ?
            <input
              type="checkbox"
              checked={readOnly}
              onChange={() => this.setState({ readOnly: !this.state.readOnly })}
            />
          </label>
          <HorizontalKeypad onClick={this.onClick} />
          <pre>{JSON.stringify(latex, null, '  ')}</pre>
        </div>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const e = React.createElement(Demo, {});
  ReactDOM.render(e, document.querySelector('#app'));
});
