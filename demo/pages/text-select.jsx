import {
  TextSelect,
  TokenSelect,
  TokenTypes,
  Tokenizer
} from '@pie-lib/text-select';
import withRoot from '../src/withRoot';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from 'material-ui';
import { Header, Body } from '../src/formatting';
import clone from 'lodash/clone';
import classNames from 'classnames';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';
import compact from 'lodash/compact';

const text = () => [
  'Rachel cut out 8 stars in 6 minutes.',
  'Lovelle cut out 6 stars in 4 minutes.',
  'Rachel cut out 4 more stars than Lovelle.',
  'Lovelle and Rachel cut the same number of stars in 6 minutes.'
];

const raw = text().join(' ');

const tokens = compact(
  text().map((t, index) => {
    if (index === 2) {
      return undefined;
    }
    const start = raw.indexOf(t);
    const end = start + t.length;
    return {
      text: t,
      start,
      end
    };
  })
);

const correctedTokens = tokens.map((t, index) => {
  return { ...t, correct: index % 2 === 0 };
});

class RawCustomToken extends React.Component {
  static propTypes = {
    ...TokenTypes,
    classes: PropTypes.object.isRequired,
    correct: PropTypes.bool,
    selected: PropTypes.bool
  };

  render() {
    const { classes, text, correct, selected } = this.props;
    const className = classNames(
      classes.custom,
      correct && selected && classes.correct,
      !correct && selected && classes.incorrect
    );
    return <span className={className}>!!{text}</span>;
  }
}

const CustomToken = withStyles(theme => ({
  correct: {
    backgroundColor: green[500]
  },
  incorrect: {
    backgroundColor: orange[500]
  }
}))(RawCustomToken);

class Demo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    // const tokens = text().map((t, index) => ({
    //   text: t,
    //   selectable: index % 2 === 0
    // }));

    this.state = {
      mounted: false,
      textSelect: {
        selected: tokens.filter((t, index) => index % 2 === 0),
        withCorrect: tokens.filter((t, index) => index === 0 || index === 1)
      }
      // tokens: clone(tokens),
      // disabledTokens: text().map((t, index) => ({
      //   text: t,
      //   selected: index % 2 === 0,
      //   selectable: index % 2 === 0
      // })),
      // customTokens: text().map((t, index) => ({
      //   text: t,
      //   selected: index % 2 === 0,
      //   selectable: index % 2 === 0,
      //   correct: index % 4 === 0
      // })),
      // // tokenizerTokens: [{ text: 'a', start: 0, end: 1 }]
      // tokenizerTokens: [
      //   { text: 'Rachel cut out 8 stars in 6 minutes.', start: 0, end: 36 }
      // ]
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { classes } = this.props;
    const { mounted } = this.state;
    return mounted ? (
      <div className={classes.demo}>
        <Header>TextSelect</Header>
        <Body>This is the comp</Body>
        <TextSelect
          highlightChoices={true}
          className={classes.textSelect}
          disabled={false}
          text={raw}
          tokens={tokens}
          selectedTokens={this.state.textSelect.selected}
          onChange={tokens =>
            this.setState({
              textSelect: { ...this.state.textSelect, selected: tokens }
            })
          }
        />
        <Body>Disabled</Body>
        <TextSelect
          className={classes.textSelect}
          disabled={true}
          text={raw}
          tokens={tokens}
          selectedTokens={this.state.textSelect.selected}
          onChange={() => ({})}
        />
        <Body>Correct/Incorrect</Body>
        <TextSelect
          className={classes.textSelect}
          disabled={true}
          text={raw}
          tokens={correctedTokens}
          selectedTokens={this.state.textSelect.withCorrect}
          onChange={tokens =>
            this.setState({
              textSelect: { ...this.state.textSelect, withCorrect: tokens }
            })
          }
        />
        {/* <Header>TokenSelect</Header>
        <Typography className={classes.description} variant={'body1'}>
          Displays text that may be selected by the user clicking on it.
        </Typography>
        <ul>
          <li>can be disabled</li>
          <li>selection view can be customized</li>
        </ul>
        <Header>Selectable...</Header>
        <TokenSelect
          className={classes.tokenSelect}
          tokens={this.state.tokens}
          onChange={tokens => this.setState({ tokens })}
        />
        <Header>Disabled</Header>
        <TokenSelect
          disabled={true}
          className={classes.tokenSelect}
          tokens={this.state.disabledTokens}
          onChange={tokens => this.setState({ tokens })}
        />
        <Header>Custom Token</Header>
        <Body>
          You can define a different token component with `tokenComponent`. All
          the properties in token will be spread on to as well as `disabled`,
          and `onClick`.
        </Body>
        <TokenSelect
          disabled={true}
          className={classes.tokenSelect}
          tokenComponent={CustomToken}
          tokens={this.state.customTokens}
          onChange={tokens => this.setState({ tokens })}
        />

        <Header>Tokenizer</Header>
        <Body>Takes a string of text and tokens as input</Body>
        <Tokenizer
          text={text().join(' ')}
          tokens={this.state.tokenizerTokens}
          onChange={tokenizerTokens => this.setState({ tokenizerTokens })}
        />

        <div>
          <ul>
            {this.state.tokenizerTokens.map((t, index) => (
              <li key={index}>
                {t.text} {t.start}-{t.end}, {t.correct ? 'correct' : ''}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const StyledDemo = withStyles(theme => ({
  demo: {
    backgroundColor: 'none'
  },
  description: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  tokenSelect: {
    backgroundColor: 'none',
    padding: theme.spacing.unit,
    border: `solid 1px ${theme.palette.primary.light}`
  },
  textSelect: {
    paddingBottom: theme.spacing.unit * 3
  }
}))(Demo);
export default withRoot(StyledDemo);
