import { TextSelect, TokenTypes, Tokenizer } from '@pie-lib/text-select';
import withRoot from '../source/withRoot';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Header, Body } from '../source/formatting';
import classNames from 'classnames';
import compact from 'lodash/compact';

import { green, orange } from '@mui/material/colors';

const text = () => [
  'This is me.',
  'This is b.',
  'Hi!',
  'Rachel cut out 8 stars in 6 minutes.',
  'Lovelle cut out 6 stars in 4 minutes.',
  'Rachel cut out 4 more stars than Lovelle.',
  'Lovelle and Rachel cut the same number of stars in 6 minutes.',
  'I am Mrs. Pink.',
  'This is sentence 1.',
  'This is sentence 2.',
  'This is sentence 3.',
  'This is sentence 4.',
  'Sentence 1.',
  'Sentence 2.',
  'Sentence 3.',
  'Sentence 123.',
  'Sentence 1234.',
  'Dr. A. says he will call in 2.',
  'Who said? Y! 123!',
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
      end,
    };
  }),
);

const correctedTokens = tokens.map((t, index) => {
  return { ...t, correct: index % 2 === 0 };
});

class RawCustomToken extends React.Component {
  static propTypes = {
    ...TokenTypes,
    correct: PropTypes.bool,
    selected: PropTypes.bool,
  };

  render() {
    const { text, correct, selected } = this.props;
    const className = classNames(
      correct && selected && 'correct',
      !correct && selected && 'incorrect',
    );
    return <span className={className}>!!{text}</span>;
  }
}

const CustomToken = styled(RawCustomToken)(({ theme }) => ({
  '&.correct': {
    backgroundColor: green[500],
  },
  '&.incorrect': {
    backgroundColor: orange[500],
  },
}));

class Demo extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      mounted: false,
      textSelect: {
        selected: tokens.filter((t, index) => index % 2 === 0),
        withCorrect: tokens.filter((t, index) => index === 0 || index === 1),
      },
      tokenizerTokens: [],
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;
    return mounted ? (
      <div className="demo">
        <Header>TextSelect (uses TokenSelect)</Header>
        <Body>This is the comp</Body>
        <TextSelect
          highlightChoices={true}
          maxNoOfSelections={2}
          className="textSelect"
          disabled={false}
          text={raw}
          tokens={tokens}
          selectedTokens={this.state.textSelect.selected}
          onChange={(tokens) =>
            this.setState({
              textSelect: { ...this.state.textSelect, selected: tokens },
            })
          }
        />
        <Body>Disabled</Body>
        <TextSelect
          className="textSelect"
          disabled={true}
          text={raw}
          tokens={tokens}
          selectedTokens={this.state.textSelect.selected}
          onChange={() => ({})}
        />
        <Body>Correct/Incorrect</Body>
        <TextSelect
          className="textSelect"
          disabled={true}
          text={raw}
          tokens={correctedTokens}
          selectedTokens={this.state.textSelect.withCorrect}
          onChange={(tokens) =>
            this.setState({
              textSelect: { ...this.state.textSelect, withCorrect: tokens },
            })
          }
        />

        <Header>Tokenizer</Header>
        <Body>Takes a string of text and tokens as input</Body>
        <Tokenizer
          text={text().join(' ')}
          tokens={this.state.tokenizerTokens}
          onChange={(tokenizerTokens) => this.setState({ tokenizerTokens })}
        />

        <div>
          Tokens:
          <ul>
            {this.state.tokenizerTokens.map((t, index) => (
              <li key={index}>
                {t.text} {t.start}-{t.end}, {t.correct ? 'correct' : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const StyledDemo = styled(Demo)(({ theme }) => ({
  '&.demo': {
    backgroundColor: 'none',
  },
  '& .description': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  '& .tokenSelect': {
    backgroundColor: 'none',
    padding: theme.spacing(1),
    border: `solid 1px ${theme.palette.primary.light}`,
  },
  '& .textSelect': {
    paddingBottom: theme.spacing(3),
  },
}));
export default withRoot(StyledDemo);
