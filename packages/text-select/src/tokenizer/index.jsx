import React from 'react';
import PropTypes from 'prop-types';
import Controls from './controls';
import { withStyles } from '@material-ui/core/styles';
import { words, sentences, paragraphs } from './builder';
import clone from 'lodash/clone';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import classNames from 'classnames';
import { noSelect } from '@pie-lib/style-utils';
import TokenText from './token-text';

export class Tokenizer extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    tokens: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        correct: PropTypes.bool,
        start: PropTypes.number,
        end: PropTypes.number
      })
    ),
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      setCorrectMode: false,
      mode: ''
    };
  }

  onChangeHandler = (token, mode) => {
    this.props.onChange(token, mode);

    this.setState({
      mode
    });
  };

  toggleCorrectMode = () => this.setState({ setCorrectMode: !this.state.setCorrectMode });

  clear = () => {
    this.onChangeHandler([], '');
  };

  buildTokens = (type, fn) => {
    const { text } = this.props;
    const tokens = fn(text);

    this.onChangeHandler(tokens, type);
  };

  selectToken = (newToken, tokensToRemove) => {
    const { tokens } = this.props;
    const update = differenceWith(clone(tokens), tokensToRemove, isEqual);

    update.push(newToken);
    this.onChangeHandler(update, this.state.mode);
  };

  tokenClick = token => {
    const { setCorrectMode } = this.state;

    if (setCorrectMode) {
      this.setCorrect(token);
    } else {
      this.removeToken(token);
    }
  };

  tokenIndex = token => {
    const { tokens } = this.props;

    return tokens.findIndex(t => {
      return t.text == token.text && t.start == token.start && t.end == token.end;
    });
  };

  setCorrect = token => {
    const { tokens } = this.props;
    const index = this.tokenIndex(token);
    if (index !== -1) {
      const t = tokens[index];

      t.correct = !t.correct;

      const update = clone(tokens);

      update.splice(index, 1, t);
      this.onChangeHandler(update, this.state.mode);
    }
  };

  removeToken = token => {
    const { tokens } = this.props;

    const index = this.tokenIndex(token);
    if (index !== -1) {
      const update = clone(tokens);

      update.splice(index, 1);

      this.onChangeHandler(update, this.state.mode);
    }
  };

  render() {
    const { text, tokens, classes, className } = this.props;
    const { setCorrectMode } = this.state;

    const tokenClassName = classNames(classes.text, setCorrectMode && classes.noselect);

    const rootName = classNames(classes.tokenizer, className);

    return (
      <div className={rootName}>
        <Controls
          onClear={this.clear}
          onWords={() => this.buildTokens('words', words)}
          onSentences={() => this.buildTokens('sentence', sentences)}
          onParagraphs={() => this.buildTokens('paragraphs', paragraphs)}
          setCorrectMode={setCorrectMode}
          onToggleCorrectMode={this.toggleCorrectMode}
        />
        <TokenText
          className={tokenClassName}
          text={text}
          tokens={tokens}
          onTokenClick={this.tokenClick}
          onSelectToken={this.selectToken}
        />
      </div>
    );
  }
}

export default withStyles(theme => ({
  text: {
    whiteSpace: 'pre-wrap',
    marginTop: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  noselect: { ...noSelect() }
}))(Tokenizer);
