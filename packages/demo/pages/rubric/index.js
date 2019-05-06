import { Authoring } from '@pie-lib/rubric';
import React from 'react';
import withRoot from '../../src/withRoot';
import { withStyles } from '@material-ui/core';
import Section from '../../src/formatting/section';
import Pre from '../../src/formatting/pre';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rubric: {
        maxPoints: 2,
        excludeZero: false,
        // the index is the points
        points: ['not correct at all', 'half correct', '<div>Correct</div>']
      }
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted, rubric } = this.state;
    // TODO: check similar comps to see what they support...
    return mounted ? (
      <div>
        <Section name="Rubric Authoring">
          <br />
          <Authoring value={rubric} onChange={rubric => this.setState({ rubric })} />
          <Pre />
        </Section>
      </div>
    ) : (
      <div />
    );
  }
}

const Styled = withStyles(theme => ({}))(Demo);

export default withRoot(Styled);
