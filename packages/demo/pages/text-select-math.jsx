import { Token, TokenSelect, TextSelect } from '@pie-lib/text-select';
import Section from '../source/formatting/section';
import * as sample from '../source/text-select/math-sample';
import * as simpleSample from '../source/text-select/simple-sample';

import withRoot from '../source/withRoot';
import React from 'react';
import { styled } from '@mui/material/styles';
import { renderMath } from '@pie-lib/math-rendering';

const mathText = `<math xmlns="http:/www.w3.org/1998/Math/MathML">
  <mstyle displaystyle="true">
    <mrow>
      <mo>(</mo>
      <msup>
        <mi>x</mi>
        <mn>2</mn>
      </msup>
      <mo>)</mo>
    </mrow>
  </mstyle>
</math>`;

const tokens = [];

class RawTextSelectDemo extends React.Component {
  static propTypes = TextSelect.propTypes;

  render() {
    const { selectedTokens, ...rest } = this.props;
    return (
      <TextSelectDemoContainer>
        <TextSelect {...rest} selectedTokens={selectedTokens} />
        <InfoContainer>
          selected tokens:
          <PreElement>{JSON.stringify(selectedTokens, null, '  ')}</PreElement>
        </InfoContainer>
      </TextSelectDemoContainer>
    );
  }
}

const TextSelectDemoContainer = styled('div')({
  display: 'flex',
});

const InfoContainer = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const PreElement = styled('pre')(({ theme }) => ({
  flex: '0.5',
  whiteSpace: 'pre-wrap',
  paddingLeft: theme.spacing(1),
}));

const withCorrect = (tokens) => {
  return tokens.map((t, index) => {
    return { ...t, correct: index % 2 === 0 };
  });
};

const DemoContainer = styled('div')({
  backgroundColor: 'none',
});

const RowContainer = styled('div')({
  display: 'flex',
});

const StyledTokenSelect = styled(TokenSelect)(({ theme }) => ({
  flex: '0.5',
  backgroundColor: 'none',
  padding: theme.spacing(1),
  border: `solid 1px ${theme.palette.primary.light}`,
}));

const TextSelectDemo = RawTextSelectDemo;

class Demo extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      mounted: false,
      tokenSelected: true,

      mathSampleText: sample.text,
      mathSampleTokens: sample.tokens,
      mathSampleSelected: [],
      simpleText: simpleSample.text,
      simpleTokens: simpleSample.tokens,
      simpleSelected: [],
      tokens: [
        {
          text: mathText,
          selectable: true,
        },
        {
          text: 'hi there how are you?',
          selectable: true,
        },
        {
          text: 'foo',
          selectable: true,
        },
        {
          text: 'bar',
          selectable: false,
        },
        {
          text: 'baz',
          selectable: true,
        },
        {
          text: '<div><h1>Hi</h1></div>',
          selected: true,
        },
        {
          text: '<h1>h1 only</h1>',
          selectable: true,
        },
        {
          text: 'not selectable',
          selectable: false,
        },
        {
          text: 'i am selectable',
          selectable: true,
          selected: true,
        },
      ],
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });

    renderMath(this.root);
  }

  componentDidUpdate() {
    renderMath(this.root);
  }

  tokenClick = () => {
    this.setState({ tokenSelected: !this.state.tokenSelected });
  };

  render() {
    const { mounted } = this.state;
    return mounted ? (
      <DemoContainer ref={(r) => (this.root = r)}>
        <Section name={'TextSelect Math Sample'}>
          <TextSelectDemo
            text={this.state.mathSampleText}
            tokens={this.state.mathSampleTokens}
            selectedTokens={this.state.mathSampleSelected}
            onChange={(mathSampleSelected) => this.setState({ mathSampleSelected })}
          />
          <TextSelectDemo
            disabled={true}
            text={this.state.mathSampleText}
            tokens={this.state.mathSampleTokens}
            selectedTokens={this.state.mathSampleSelected}
          />
          <TextSelectDemo
            disabled={true}
            text={this.state.mathSampleText}
            tokens={withCorrect(this.state.mathSampleTokens)}
            selectedTokens={this.state.mathSampleTokens.filter((t, i) => i % 2 === 0)}
          />
        </Section>
        <Section name={'TextSelect'}>
          <TextSelectDemo
            text={this.state.simpleText}
            tokens={withCorrect(this.state.simpleTokens)}
            selectedTokens={this.state.simpleTokens.filter((t, i) => i % 2 === 0)}
            onChange={(simpleSelected) => this.setState({ simpleSelected })}
          />
        </Section>
        <Section name={'TokenSelect'}>
          <RowContainer>
            <StyledTokenSelect
              highlightChoices={true}
              tokens={this.state.tokens}
              onChange={(tokens) => this.setState({ tokens })}
            />
            <PreElement>{JSON.stringify(this.state.tokens, null, '  ')}</PreElement>
          </RowContainer>
        </Section>
        <Section name={'Tokens'}>
          <Token text={mathText} selected={this.state.tokenSelected} onClick={this.tokenClick} />
        </Section>
      </DemoContainer>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(Demo);
