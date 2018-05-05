import React from 'react';
import PropTypes from 'prop-types';
import Token, { TokenTypes } from './token';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import clone from 'lodash/clone';

export class TokenSelect extends React.Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)).isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    tokenComponent: PropTypes.element,
    highlightChoices: PropTypes.bool
  };

  static defaultProps = {};

  toggleToken = (index, t) => {
    const { onChange } = this.props;
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
    return (
      <div className={className}>
        {tokens.map((t, index) => (
          <TokenComponent
            key={index}
            disabled={disabled}
            {...t}
            highlight={highlightChoices}
            onClick={() => this.toggleToken(index, t)}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(theme => ({
  tokenSelect: {
    backgroundColor: 'none'
  }
}))(TokenSelect);
