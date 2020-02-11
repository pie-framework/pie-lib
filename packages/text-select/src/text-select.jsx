import React from 'react';
import PropTypes from 'prop-types';

import TokenSelect from './token-select';
import { normalize } from './tokenizer/builder';
import { TokenTypes } from './token-select/token';
import debug from 'debug';
const log = debug('@pie-lib:text-select');
/**
 * Built on TokenSelect uses build.normalize to build the token set.
 */
export default class TextSelect extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    tokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)).isRequired,
    selectedTokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)).isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    highlightChoices: PropTypes.bool,
    maxNoOfSelections: PropTypes.number
  };

  change = tokens => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }
    const out = tokens.filter(t => t.selected).map(t => ({ start: t.start, end: t.end }));

    onChange(out);
  };

  render() {
    const {
      text,
      disabled,
      tokens,
      selectedTokens,
      className,
      highlightChoices,
      maxNoOfSelections
    } = this.props;

    const normalized = normalize(text, tokens);
    log('normalized: ', normalized);
    const prepped = normalized.map(t => {
      const selectedIndex = selectedTokens.findIndex(s => {
        return s.start === t.start && s.end === t.end;
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

    return (
      <TokenSelect
        highlightChoices={!disabled && highlightChoices}
        className={className}
        tokens={prepped}
        disabled={disabled}
        onChange={this.change}
        maxNoOfSelections={maxNoOfSelections}
      />
    );
  }
}
