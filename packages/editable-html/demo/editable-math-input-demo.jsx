import { EditableMathInput } from '@pie-lib/math-input';
import React from 'react';
import _ from 'lodash';
import debug from 'debug';

const log = debug('editable-html:rte-demo');

export default class RteDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      latex: '\\frac{1}{2}'
    }
  }

  onChange = (markup) => {
    log('onChange: ');
    this.setState({ markup });
  }

  render() {

    const { markup } = this.state;

    return (<div>
      <h1>Editable Math Input</h1>
      <EditableMathInput
        latex={latex}
        onChange={this.onChange} />
      <br />
      <br />
      <h4>markup</h4>
      <pre>{markup}</pre>
    </div>);
  }
}

