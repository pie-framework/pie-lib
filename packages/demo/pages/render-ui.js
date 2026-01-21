import React from 'react';
import { styled } from '@mui/material/styles';
import { indicators, Feedback } from '@pie-lib/render-ui';
import { Collapsible, color } from '@pie-lib/render-ui';
import withRoot from '../source/withRoot';
import { Typography } from '@mui/material';
const { Correct, Incorrect, PartiallyCorrect, NothingSubmitted } = indicators;

const SectionContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));

const Section = ({ title, children }) => (
  <SectionContainer>
    <h4>{title}</h4>
    {children}
  </SectionContainer>
);

const ColorSampleContainer = styled('div')(({ theme }) => ({
  border: 'solid red 0px',
  paddingBottom: theme.spacing(1),
  paddingTop: theme.spacing(1),
}));

const ColorRow = styled('div')({
  display: 'flex',
});

const ColorBox = styled('div')(({ theme }) => ({
  width: '100px',
  marginRight: theme.spacing(1),
  border: 'solid 1px lightgrey',
}));

const ColorSample = ({ name }) => (
  <ColorSampleContainer>
    <Typography variant="h5">{name}</Typography>
    <ColorRow>
      <ColorBox style={{ backgroundColor: color[name]() }} />
      <pre>{`color.${name}() //=> ${color[name]()}`}</pre>
    </ColorRow>
  </ColorSampleContainer>
);

const AppContainer = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
}));

const FlowContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& > *': {
    paddingLeft: '20px',
  },
});

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;
    return mounted ? (
      <AppContainer>
        <Section title="response indicators">
          <FlowContainer>
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
          </FlowContainer>
        </Section>
        <Section title="Feedback">
          <Feedback correctness="correct" feedback="Correct!" />
          <br />
          <Feedback correctness="incorrect" feedback="Incorrect" />
        </Section>

        <Section title="Collapsible">
          <StyledCollapsible labels={{ visible: 'Hide Content', hidden: 'Show Content' }}>
            This is the collapsed content.
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </StyledCollapsible>
        </Section>
        <Section title="color">
          <div>
            This module provides css vars for defining the color in the ui. It is a simple version of the material
            design color scheme, with a few additions. It allows the ui to be themed by setting the custom properties.
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
      </AppContainer>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(App);
