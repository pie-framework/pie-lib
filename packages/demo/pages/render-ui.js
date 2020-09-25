import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { indicators, Feedback } from '@pie-lib/render-ui';
import { Collapsible, color } from '@pie-lib/render-ui';
import withRoot from '../src/withRoot';
import { Typography } from '@material-ui/core';
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

const ColorSample = withStyles(theme => ({
  colorSample: {
    border: 'solid red 0px',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit
  },
  row: {
    display: 'flex'
  },
  colorBox: {
    width: '100px',
    marginRight: theme.spacing.unit,
    border: 'solid 1px lightgrey'
  }
}))(({ name, classes }) => (
  <div className={classes.colorSample}>
    <Typography variant="h5">{name}</Typography>
    <div className={classes.row}>
      <div className={classes.colorBox} style={{ backgroundColor: color[name]() }}></div>
      <pre>{`color.${name}() //=> ${color[name]()}`}</pre>
    </div>
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

        <Section title="Collapsible">
          <Collapsible
            labels={{ visible: 'Hide Content', hidden: 'Show Content' }}
            className={classes.collapsible}
          >
            This is the collapsed content.
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </Collapsible>
        </Section>
        <Section title="color">
          <div>
            This module provides css vars for defining the color in the ui. It is a simple version
            of the material design color scheme, with a few additions. It allows the ui to be themed
            by setting the custom properties.
          </div>
          <pre>{'import { color } from "@pie-lib/render-ui";'}</pre>
          <ColorSample name="text" />
          <ColorSample name="primary" />
          <ColorSample name="primaryLight" />
          <ColorSample name="primaryDark" />
          <ColorSample name="primaryText" />
          <br />
          <br />
          <ColorSample name="secondary" />
          <ColorSample name="secondaryLight" />
          <ColorSample name="secondaryDark" />
          <ColorSample name="secondaryText" />
          <br />
          <br />
          <ColorSample name="correct" />
          <ColorSample name="incorrect" />
          <ColorSample name="disabled" />
          <ColorSample name="background" />
          <br />
          <div>To override a var simply set the style property on the appropriate selector</div>
          <pre>{"document.body.style.setProperty('--pie-text', 'green');"}</pre>
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
  },
  collapsible: {
    paddingTop: theme.spacing.unit
  }
}))(App);

export default withRoot(StyledApp);
