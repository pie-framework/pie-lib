import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';

import TokenSelect from './token-select';
import { normalize } from './tokenizer/builder';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';

const log = debug('@pie-lib:text-select');
/**
 *   <TextSelect
        disabled={model.disabled}
        text={model.text}
        tokens={model.tokens}
        selectedTokens={session.selectedTokens}
        onChange={onSelectionChange}
      />
 */

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

export default class TextSelect extends React.Component {
  static propTypes = {};

  change = tokens => {
    log('change...');
    const out = tokens.filter(t => t.selected);
    this.props.onChange(out);
  };

  render() {
    log('render: ...');
    const { text, disabled, tokens, selectedTokens, onChange } = this.props;

    const normalized = normalize(text, tokens);
    const prepped = normalized.map(t => {
      const selectedIndex = selectedTokens.findIndex(s => {
        return s.start === t.start && s.end === t.end && s.text === t.text;
      });
      const selected = selectedIndex !== -1;
      const correct = selected ? t.correct : undefined;
      return {
        ...t,
        selectable: !disabled,
        selected,
        correct
      };
    });

    const tokensHaveCorrectInfo =
      tokens.filter(t => t.hasOwnProperty('correct')).length > 0;

    log('prepped: ', prepped);
    return (
      <TokenSelect
        text={text}
        tokens={prepped}
        disabled={disabled}
        onChange={this.change}
        tokenComponent={tokensHaveCorrectInfo ? Custom : undefined}
      />
    );
  }
}
