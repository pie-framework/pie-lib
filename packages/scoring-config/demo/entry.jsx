import React from 'react';
import ReactDOM from 'react-dom';
import ScoringConfig from '../src/index';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partialScoring: [
        {
          numberOfCorrect: 1,
          scorePercentage: 35
        }
      ]
    }
  }

  render() {
    return <div>
      <em>Normal</em>
      <pre>{JSON.stringify(this.state.partialScoring, null, '  ')}</pre>
      <ScoringConfig
        partialScoring={this.state.partialScoring}
        numberOfCorrectResponses={4}
        onChange={(partialScoring) => this.setState({ partialScoring })} />
      <br />
      <br />
      <em>Empty</em>
      <ScoringConfig
        partialScoring={this.state.partialScoring}
        numberOfCorrectResponses={0}
        onChange={() => { }} />
    </div>
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(Container, {});
  ReactDOM.render(el, document.querySelector('#app'));
});