import React from 'react';
import ScoringConfig from '@pie-lib/scoring-config';
import withRoot from '../src/withRoot';

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
    };
  }

  render() {
    return (
      <div>
        <em>Normal</em>
        <pre>{JSON.stringify(this.state.partialScoring, null, '  ')}</pre>
        <ScoringConfig
          partialScoring={this.state.partialScoring}
          numberOfCorrectResponses={4}
          onChange={partialScoring => this.setState({ partialScoring })}
        />
        <br />
        <br />
        <em>Empty</em>
        <ScoringConfig
          partialScoring={this.state.partialScoring}
          numberOfCorrectResponses={0}
          onChange={() => {}}
        />
      </div>
    );
  }
}
export default withRoot(Container);
