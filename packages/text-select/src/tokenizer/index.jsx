import React from 'react';
import PropTypes from 'prop-types';
import Controls from './controls';
import { withStyles } from 'material-ui/styles';
import { normalize } from './builder';
import yellow from 'material-ui/colors/yellow';

const T = withStyles(theme => ({
  predefined: {
    backgroundColor: yellow[100],
    border: `dashed 1px ${yellow[700]}`
  }
}))(({ text, predefined, classes }) => {
  if (predefined) {
    return <span className={classes.predefined}>{text}</span>;
  } else {
    return text;
  }
});
///
class TokenText extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    tokens: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired
  };

  render() {
    const { text, tokens, className } = this.props;

    const normalized = normalize(text, tokens);

    return (
      <div className={className}>
        {normalized.map((t, index) => <T key={index} {...t} />)}
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

  static defaultProps = {
    foo: 'foo'
  };

  clear = () => {
    const { onChange } = this.props;
    onChange([]);
  };

  buildWordTokens = () => {
    const { onChange } = this.props;
    const tokens = words(text);
    onChange(tokens);
  };

  buildSentenceTokens = () => {
    const { onChange } = this.props;
    const tokens = sentences(text);
    onChange(tokens);
  };
  render() {
    const { text, tokens, classes } = this.props;
    return (
      <div className={classes.tokenizer}>
        <Controls
          onClear={this.clear}
          onWords={this.buildWordTokens}
          onSentences={this.buildSentenceTokens}
        />
        <TokenText className={classes.text} text={text} tokens={tokens} />
      </div>
    );
  }
}

export default withStyles(theme => ({
  text: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit,
    border: `solid 1px ${theme.palette.primary.dark}`
  }
}))(Tokenizer);
