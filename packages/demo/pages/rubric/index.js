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
        excludeZero: false,
        // the index is the points
        points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
        // if the value is null, the Sample Answer input field for that point will not be dispalyed
        // if the value is '', the Sample Answer input field will be empty
        sampleAnswers: [null, null, null, null]
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
