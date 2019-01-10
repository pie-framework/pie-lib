import { HorizontalKeypad, EditableMathInput } from '@pie-lib/math-input';

import React from 'react';
import withRoot from '../src/withRoot';

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

  onMathInputClick(argumnents) {
    console.log('onMathInputClick', arguments);
  }
  onClick(data) {
    console.log('onClick', data.value, data.type);
  }

  onInputChange(latex) {
    console.log('onInputChange', latex);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }
  render() {
    const { readOnly, latex, mounted } = this.state;

    return mounted ? (
      <div>
        <div>
          <p>This is a math input based in MathQuill.</p>
          <EditableMathInput
            onClick={this.onMathInputClick}
            latex={'\\frac{1}{2}'}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <p>This is a keypad you can add an onClick to.</p>
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
    ) : (
      <div>loading...</div>
    );
  }
}
export default withRoot(Demo);
