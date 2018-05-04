import React from 'react';
import PropTypes from 'prop-types';
import Controls from './controls';
import { withStyles } from 'material-ui/styles';
import { normalize, words, sentences, intersection } from './builder';
import yellow from 'material-ui/colors/yellow';
import green from 'material-ui/colors/green';
import clone from 'lodash/clone';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import debug from 'debug';
import classNames from 'classnames';

/** TODO: lifted from tools - should have a @pie-lib/style-utils package */
const noSelect = () => ({
  cursor: 'default',
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none'
});

import {
  clearSelection,
  getCaretCharacterOffsetWithin
} from './selection-utils';

const log = debug('@pie-lib:text-select:tokenizer');

const T = withStyles(() => ({
  predefined: {
    cursor: 'pointer',
    backgroundColor: yellow[100],
    border: `dashed 0px ${yellow[700]}`
  },
  correct: {
    backgroundColor: green[500]
  }
}))(({ text, predefined, classes, onClick, correct }) => {
  if (predefined) {
    const className = classNames(
      classes.predefined,
      correct && classes.correct
    );
    return (
      <span onClick={onClick} className={className}>
        {text}
      </span>
    );
  } else {
    return text;
  }
});

class TokenText extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    tokens: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    onTokenClick: PropTypes.func,
    onSelectToken: PropTypes.func
  };

  mouseUp = event => {
    event.preventDefault();
    const { onSelectToken, text, tokens } = this.props;

    const selection = window.getSelection();
    const textSelected = selection.toString();

    if (textSelected.length > 0) {
      if (this.root) {
        const offset = getCaretCharacterOffsetWithin(this.root);
        if (offset !== undefined) {
          const endIndex = offset + textSelected.length;

          if (endIndex <= text.length) {
            const i = intersection({ start: offset, end: endIndex }, tokens);

            if (i.hasOverlap) {
              log('hasOverlap  - do nothing');
              clearSelection();
            } else {
              const tokensToRemove = i.surroundedTokens;
              const token = {
                text: textSelected,
                start: offset,
                end: endIndex
              };

              onSelectToken(token, tokensToRemove);
              clearSelection();
            }
          }
        }
      }
    }
  };

  render() {
    const { text, tokens, className, onTokenClick } = this.props;

    const normalized = normalize(text, tokens);

    return (
      <div
        className={className}
        ref={r => (this.root = r)}
        onMouseUp={this.mouseUp}
      >
        {normalized.map((t, index) => {
          return <T key={index} {...t} onClick={() => onTokenClick(t)} />;
        })}
      </div>
    );
  }
}

export class Tokenizer extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    tokens: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string
      })
    ),
    classes: PropTypes.object.isRequired,
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
    const { text, tokens, classes } = this.props;
    const { setCorrectMode } = this.state;

    const tokenClassName = classNames(
      classes.text,
      setCorrectMode && classes.noselect
    );
    return (
      <div className={classes.tokenizer}>
        <Controls
          onClear={this.clear}
          onWords={this.buildWordTokens}
          onSentences={this.buildSentenceTokens}
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
    padding: theme.spacing.unit,
    border: `solid 1px ${theme.palette.primary.dark}`
  },
  noselect: { ...noSelect() }
}))(Tokenizer);
