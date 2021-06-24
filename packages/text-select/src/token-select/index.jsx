import React from 'react';
import PropTypes from 'prop-types';
import Token, { TokenTypes } from './token';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import clone from 'lodash/clone';
import debug from 'debug';
import { noSelect } from '@pie-lib/style-utils';
import { renderToString } from 'react-dom/server';

const log = debug('@pie-lib:text-select:token-select');

export class TokenSelect extends React.Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)).isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    highlightChoices: PropTypes.bool,
    maxNoOfSelections: PropTypes.number
  };

  static defaultProps = {
    highlightChoices: false,
    maxNoOfSelections: 0,
    tokens: []
  };

  selectedCount = () => this.props.tokens.filter(t => t.selected).length;

  canSelectMore = selectedCount => {
    const { maxNoOfSelections } = this.props;

    log('[canSelectMore] maxNoOfSelections: ', maxNoOfSelections, 'selectedCount: ', selectedCount);
    return (
      maxNoOfSelections <= 0 || (isFinite(maxNoOfSelections) && selectedCount < maxNoOfSelections)
    );
  };

  /**
   @function
   @param { object } event

   @description
    each token is wrapped into a span that has Token.rootClassName class and indexkey attribute (represents the index of the token)
    tokens are updated with the targeted token having the correct value set for 'selected' property
   */
  toggleToken = event => {
    const { target } = event;
    const tokens = clone(this.props.tokens);
    const targetSpanWrapper = target.closest(`.${Token.rootClassName}`);
    const targetedTokenIndex =
      targetSpanWrapper && targetSpanWrapper.dataset && targetSpanWrapper.dataset.indexkey;
    const t = targetedTokenIndex && tokens[targetedTokenIndex];

    if (t && t.correct === undefined) {
      const { onChange, maxNoOfSelections } = this.props;
      const selected = !t.selected;

      if (selected && maxNoOfSelections > 0 && this.selectedCount() >= maxNoOfSelections) {
        log('skip toggle max reached');
        return;
      }

      const update = { ...t, selected: !t.selected };

      tokens.splice(targetedTokenIndex, 1, update);
      onChange(tokens);
    }
  };

  generateTokensInHtml = () => {
    const { tokens, disabled, highlightChoices } = this.props;
    const selectedCount = this.selectedCount();
    const isLineBreak = text => text === '\n';
    const isNewParagraph = text => text === '\n\n';

    const reducer = (accumulator, t, index) => {
      const selectable = t.selected || (t.selectable && this.canSelectMore(selectedCount));
      const showCorrectAnswer = t.correct !== undefined && (t.selectable || t.selected);
      let finalAcc = accumulator;

      if (isNewParagraph(t.text)) {
        return finalAcc + '</p><p>';
      }

      if (isLineBreak(t.text)) {
        return finalAcc + '<br>';
      }

      //modified (selectable && !disabled) to !disabled to fix PD-646
      if (!disabled || showCorrectAnswer || t.selected) {
        return (
          finalAcc +
          renderToString(
            <Token
              key={index}
              disabled={disabled}
              index={index}
              {...t}
              selectable={selectable}
              highlight={highlightChoices}
            />
          )
        );
      } else {
        return accumulator + t.text;
      }
    };

    const reduceResult = (tokens || []).reduce(reducer, '<p>');

    return reduceResult + '</p>';
  };

  render() {
    const { classes, className: classNameProp } = this.props;
    const className = classNames(classes.tokenSelect, classNameProp);
    const html = this.generateTokensInHtml();

    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={this.toggleToken}
      />
    );
  }
}

export default withStyles(() => ({
  tokenSelect: {
    backgroundColor: 'none',
    whiteSpace: 'pre',
    ...noSelect(),
    '& p': {
      whiteSpace: 'break-spaces'
    }
  }
}))(TokenSelect);
