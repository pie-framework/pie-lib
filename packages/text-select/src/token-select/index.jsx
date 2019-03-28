import React from 'react';
import PropTypes from 'prop-types';
import Token, { TokenTypes } from './token';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import clone from 'lodash/clone';
import debug from 'debug';
import { noSelect } from '@pie-lib/style-utils';
import { renderToString } from 'react-dom/server'

const log = debug('@pie-lib:text-select:token-select');

export class TokenSelect extends React.Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)).isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    highlightChoices: PropTypes.bool,
    maxNoOfSelections: PropTypes.number,
    showCorrectnessToken: PropTypes.bool
  };

  static defaultProps = {
    highlightChoices: false,
    maxNoOfSelections: 0,
    tokens: []
  };

  selectedCount = () => this.props.tokens.filter(t => t.selected).length;

  canSelectMore = selectedCount => {
    const { maxNoOfSelections } = this.props;
    log(
      '[canSelectMore] maxNoOfSelections: ',
      maxNoOfSelections,
      'selectedCount: ',
      selectedCount
    );
    return (
      maxNoOfSelections <= 0 ||
      (isFinite(maxNoOfSelections) && selectedCount < maxNoOfSelections)
    );
  };

  toggleToken = ({ target }) => {
    const { showCorrectnessToken } = this.props;
    const tokens = clone(this.props.tokens);
    /* We take the first parent element that has spanWrapper class
      spanWrapper class is a class that I added on each span that wraps a token
      (Token & CorrectnessToken)
    */
    const span = target.closest(`.${Token.rootClassName}`);

    /* indexkey is an attribute that I added on each span that wraps a token
    * and represents the index of the token
    */
    const index = span && span.dataset && span.dataset.indexkey;
    const t = index && tokens[index];

    if (t && !showCorrectnessToken) {
      const { onChange, maxNoOfSelections } = this.props;
      const selected = !t.selected;
      if (
        selected &&
        maxNoOfSelections > 0 &&
        this.selectedCount() >= maxNoOfSelections
      ) {
        log('skip toggle max reached');
        return;
      }
      const update = { ...t, selected: !t.selected };
      tokens.splice(index, 1, update);
      onChange(tokens);
    }
  };

  generateTokensInHtml = () => {
    const {
      tokens,
      disabled,
      highlightChoices,
      showCorrectnessToken,
    } = this.props;
    const selectedCount = this.selectedCount();

    const reducer = (accumulator, t, index) => {
      const selectable =
        t.selected || (t.selectable && this.canSelectMore(selectedCount));
      const showCorrectAnswer = showCorrectnessToken && (t.selectable || t.selected);

      if ((selectable && !disabled) || (showCorrectAnswer)) {
        return accumulator + renderToString(
          <Token
            key={index}
            disabled={disabled}
            index={index}
            {...t}
            selectable={selectable}
            highlight={highlightChoices}
            showCorrectnessToken={showCorrectnessToken}
          />
        )
      } else {
        return accumulator + t.text;
      }
    };

    return tokens && tokens.reduce(reducer, '');
  };

  render() {
    const { classes, className: classNameProp } = this.props;
    const className = classNames(classes.tokenSelect, classNameProp);
    const html = this.generateTokensInHtml();

    return (
      <div
        className={className} dangerouslySetInnerHTML={{ __html: html }}
        onClick={this.toggleToken}
      />
    );
  }
}

export default withStyles(() => ({
  tokenSelect: {
    backgroundColor: 'none',
    ...noSelect()
  }
}))(TokenSelect);
