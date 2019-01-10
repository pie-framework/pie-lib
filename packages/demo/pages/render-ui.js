import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { indicators, Feedback } from '@pie-lib/render-ui';
import withRoot from '../src/withRoot';
const { Correct, Incorrect, PartiallyCorrect, NothingSubmitted } = indicators;

const Section = withStyles(theme => ({
  label: {},
  section: {
    padding: theme.spacing.unit
  }
}))(({ title, children, classes }) => (
  <div className={classes.section}>
    <h4>{title}</h4>
    {children}
  </div>
));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { classes } = this.props;
    const { mounted } = this.state;
    return mounted ? (
      <div className={classes.root}>
        <Section title="response indicators">
          <div className={classes.flow}>
            <div>correct</div>
            <Correct feedback="you are correct" />
            <div>correct (no feedback)</div>
            <Correct />
            <div>incorrect</div>
            <Incorrect feedback="you are notcorrect" />
            <div>partially correct</div>
            <PartiallyCorrect feedback="partially correct" />
            <div>nothing submitted</div>
            <NothingSubmitted feedback="nothing submitted" />
          </div>
        </Section>
        <Section title="Feedback">
          <Feedback correctness="correct" feedback="Correct!" />
          <br />
          <Feedback correctness="incorrect" feedback="Incorrect" />
        </Section>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const StyledApp = withStyles(theme => ({
  root: {
    fontFamily: theme.typography.fontFamily
  },
  flow: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      paddingLeft: '20px'
    }
  }
}))(App);

export default withRoot(StyledApp);
