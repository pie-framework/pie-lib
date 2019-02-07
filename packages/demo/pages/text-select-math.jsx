import { Token, TokenSelect, TextSelect } from '@pie-lib/text-select';
import Section from '../src/formatting/section';
import * as sample from '../src/text-select/math-sample';
import * as simpleSample from '../src/text-select/simple-sample';

import withRoot from '../src/withRoot';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
    const { classes, selectedTokens, ...rest } = this.props;
    return (
      <div className={classes.textSelectDemo}>
        <TextSelect {...rest} selectedTokens={selectedTokens} />
        <div className={classes.info}>
          selected tokens:
          <pre className={classes.pre}>
            {JSON.stringify(selectedTokens, null, '  ')}
          </pre>
        </div>
      </div>
    );
  }
}

const withCorrect = tokens => {
  return tokens.map((t, index) => {
    return { ...t, correct: index % 2 === 0 };
  });
};
const TextSelectDemo = withStyles(theme => ({
  textSelectDemo: {
    display: 'flex'
  },
  info: {
    paddingLeft: theme.spacing.unit
  }
}))(RawTextSelectDemo);

class Demo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

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
          selectable: true
        },
        {
          text: 'hi there how are you?',
          selectable: true
        },
        {
          text: 'foo',
          selectable: true
        },
        {
          text: 'bar',
          selectable: false
        },
        {
          text: 'baz',
          selectable: true
        },
        {
          text: '<div><h1>Hi</h1></div>',
          selected: true
        },
        {
          text: '<h1>h1 only</h1>',
          selectable: true
        },
        {
          text: 'not selectable',
          selectable: false
        },
        {
          text: 'i am selectable',
          selectable: true,
          selected: true
        }
      ]
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
    const { classes } = this.props;
    const { mounted } = this.state;
    return mounted ? (
      <div ref={r => (this.root = r)} className={classes.demo}>
        <Section name={'TextSelect Math Sample'}>
          <TextSelectDemo
            text={this.state.mathSampleText}
            tokens={this.state.mathSampleTokens}
            selectedTokens={this.state.mathSampleSelected}
            onChange={mathSampleSelected =>
              this.setState({ mathSampleSelected })
            }
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
            selectedTokens={this.state.mathSampleTokens.filter(
              (t, i) => i % 2 === 0
            )}
          />
        </Section>
        <Section name={'TextSelect'}>
          <TextSelectDemo
            text={this.state.simpleText}
            tokens={withCorrect(this.state.simpleTokens)}
            selectedTokens={this.state.simpleTokens.filter(
              (t, i) => i % 2 === 0
            )}
            onChange={simpleSelected => this.setState({ simpleSelected })}
          />
        </Section>
        <Section name={'TokenSelect'}>
          <div className={classes.row}>
            <TokenSelect
              highlightChoices={true}
              className={classes.tokenSelect}
              tokens={this.state.tokens}
              onChange={tokens => this.setState({ tokens })}
            />
            <pre className={classes.pre}>
              {JSON.stringify(this.state.tokens, null, '  ')}
            </pre>
          </div>
        </Section>
        <Section name={'Tokens'}>
          <Token
            text={mathText}
            selected={this.state.tokenSelected}
            onClick={this.tokenClick}
          />
        </Section>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const StyledDemo = withStyles(theme => ({
  pre: {
    flex: '0.5',
    whiteSpace: 'pre-wrap',
    paddingLeft: theme.spacing.unit
  },
  demo: {
    backgroundColor: 'none'
  },
  row: {
    display: 'flex'
    // flexWrap: 'wrap'
  },
  description: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  tokenSelect: {
    flex: '0.5',
    backgroundColor: 'none',
    padding: theme.spacing.unit,
    border: `solid 1px ${theme.palette.primary.light}`
  },
  textSelect: {
    paddingBottom: theme.spacing.unit * 3
  }
}))(Demo);
export default withRoot(StyledDemo);
