import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';

import TokenSelect from './token-select';
import { normalize } from './tokenizer/builder';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';
import { TokenTypes } from './token-select/token';

const log = debug('@pie-lib:text-select');

const RawCustom = props => {
  const { classes } = props;

  log('text: ', props.text, ' props.correct? ', props.correct);
  const className = classNames(
    classes.custom,
    props.correct === true && classes.correct,
    props.correct === false && classes.incorrect
  );

  return <span className={className}>{props.text}</span>;
};

const Custom = withStyles(theme => ({
  correct: {
    backgroundColor: green[500]
  },
  incorrect: {
    backgroundColor: orange[500]
  }
}))(RawCustom);

/**
 * Built on TokenSelect uses build.normalize to build the token set.
 */
export default class TextSelect extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    tokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)),
    selectedTokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)),
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    highlightChoices: PropTypes.bool
  };

  change = tokens => {
    log('change...');
    const out = tokens.filter(t => t.selected);
    this.props.onChange(out);
  };

  render() {
    log('render: ...');
    const {
      text,
      disabled,
      tokens,
      selectedTokens,
      className,
      highlightChoices
    } = this.props;

    const normalized = normalize(text, tokens);
    const prepped = normalized.map(t => {
      const selectedIndex = selectedTokens.findIndex(s => {
        return s.start === t.start && s.end === t.end && s.text === t.text;
      });
      const selected = selectedIndex !== -1;
      const correct = selected ? t.correct : undefined;
      return {
        ...t,
        selectable: !disabled && t.predefined,
        selected,
        correct
      };
    });

    const tokensHaveCorrectInfo =
      tokens.filter(t => t.hasOwnProperty('correct')).length > 0;

    return (
      <TokenSelect
        highlightChoices={!disabled && highlightChoices}
        className={className}
        tokens={prepped}
        disabled={disabled}
        onChange={this.change}
        tokenComponent={tokensHaveCorrectInfo ? Custom : undefined}
      />
    );
  }
}
