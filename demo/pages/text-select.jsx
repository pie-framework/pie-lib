import { TokenSelect, TokenTypes, Tokenizer } from '@pie-lib/text-select';
import withRoot from '../src/withRoot';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from 'material-ui';
import { Header, Body } from '../src/formatting';
import clone from 'lodash/clone';
import classNames from 'classnames';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';

const text = () => [
  'Rachel cut out 8 stars in 6 minutes.',
  'Lovelle cut out 6 stars in 4 minutes.',
  'Rachel cut out 4 more stars than Lovelle.',
  'Lovelle and Rachel cut the same number of stars in 6 minutes.'
];

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

    const tokens = text().map((t, index) => ({
      text: t,
      selectable: index % 2 === 0
    }));

    this.state = {
      mounted: false,
      tokens: clone(tokens),
      disabledTokens: text().map((t, index) => ({
        text: t,
        selected: index % 2 === 0,
        selectable: index % 2 === 0
      })),
      customTokens: text().map((t, index) => ({
        text: t,
        selected: index % 2 === 0,
        selectable: index % 2 === 0,
        correct: index % 4 === 0
      })),
      tokenizerTokens: [{ start: 0, end: 36 }]
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
        <Header>TokenSelect</Header>
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
  }
}))(Demo);
export default withRoot(StyledDemo);
