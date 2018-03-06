import React from 'react';
import { withStyles } from 'material-ui/styles';
import ReactDOM from 'react-dom';
import { indicators, Feedback } from '../src';

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

  render() {
    const { classes } = this.props;

    return (
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
    )
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

const el = React.createElement(StyledApp);
ReactDOM.render(el, document.querySelector('#app'));
