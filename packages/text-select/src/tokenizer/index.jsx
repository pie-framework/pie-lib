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
        text: PropTypes.string
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
      setCorrectMode: false
    };
  }

  toggleCorrectMode = () =>
    this.setState({ setCorrectMode: !this.state.setCorrectMode });

  clear = () => {
    const { onChange } = this.props;
    onChange([]);
  };

  buildWordTokens = () => {
    const { onChange, text } = this.props;
    const tokens = words(text);
    onChange(tokens);
  };

  buildSentenceTokens = () => {
    const { onChange, text } = this.props;
    const tokens = sentences(text);
    onChange(tokens);
  };

  buildParagraphTokens = () => {
    const { onChange, text } = this.props;
    const tokens = paragraphs(text);
    onChange(tokens);
  };

  selectToken = (newToken, tokensToRemove) => {
    const { onChange, tokens } = this.props;
    const update = differenceWith(clone(tokens), tokensToRemove, isEqual);
    update.push(newToken);
    onChange(update);
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
      return (
        t.text == token.text && t.start == token.start && t.end == token.end
      );
    });
  };

  setCorrect = token => {
    const { onChange, tokens } = this.props;
    const index = this.tokenIndex(token);
    if (index !== -1) {
      const t = tokens[index];
      t.correct = !t.correct;
      const update = clone(tokens);
      update.splice(index, 1, t);
      onChange(update);
    }
  };

  removeToken = token => {
    const { onChange, tokens } = this.props;

    const index = this.tokenIndex(token);
    if (index !== -1) {
      const update = clone(tokens);
      update.splice(index, 1);
      onChange(update);
    }
  };

  render() {
    const { text, tokens, classes, className } = this.props;
    const { setCorrectMode } = this.state;

    const tokenClassName = classNames(
      classes.text,
      setCorrectMode && classes.noselect
    );

    const rootName = classNames(classes.tokenizer, className);

    return (
      <div className={rootName}>
        <Controls
          onClear={this.clear}
          onWords={this.buildWordTokens}
          onSentences={this.buildSentenceTokens}
          onParagraphs={this.buildParagraphTokens}
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
    marginTop: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  noselect: { ...noSelect() }
}))(Tokenizer);
