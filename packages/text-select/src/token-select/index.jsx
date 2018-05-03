import React from 'react';
import PropTypes from 'prop-types';
import Token, { TokenTypes } from './token';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import clone from 'lodash/clone';
import debug from 'debug';
import { noSelect } from '@pie-lib/style-utils';

const log = debug('@pie-lib:text-select:token-select');

export class TokenSelect extends React.Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)).isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    tokenComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    highlightChoices: PropTypes.bool,
    maxNoOfSelections: PropTypes.number
  };

  static defaultProps = {
    highlightChoices: false,
    maxNoOfSelections: 0
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

  toggleToken = (index, t) => {
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
    const tokens = clone(this.props.tokens);
    tokens.splice(index, 1, update);
    onChange(tokens);
  };

  render() {
    const {
      classes,
      tokenComponent,
      tokens,
      className: classNameProp,
      disabled,
      highlightChoices
    } = this.props;

    const TokenComponent = tokenComponent || Token;
    const className = classNames(classes.tokenSelect, classNameProp);
    const selectedCount = this.selectedCount();
    return (
      <div className={className}>
        {tokens.map((t, index) => {
          const selectable =
            t.selected || (t.selectable && this.canSelectMore(selectedCount));

          return (
            <TokenComponent
              key={index}
              disabled={disabled}
              {...t}
              selectable={selectable}
              highlight={highlightChoices}
              onClick={() => this.toggleToken(index, t)}
            />
          );
        })}
      </div>
    );
  }
}

export default withStyles(() => ({
  tokenSelect: {
    backgroundColor: 'none',
    ...noSelect()
  }
}))(TokenSelect);
