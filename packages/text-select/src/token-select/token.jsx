import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import classNames from 'classnames';

export const TokenTypes = {
  text: PropTypes.string,
  selectable: PropTypes.bool
};

export class Token extends React.Component {
  static propTypes = {
    ...TokenTypes,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  static defaultProps = {};

  render() {
    const {
      onClick,
      text,
      selectable,
      selected,
      classes,
      className: classNameProp,
      disabled
    } = this.props;

    const className = classNames(
      classes.token,
      disabled && classes.disabled,
      selectable && !disabled && classes.selectable,
      selected && !disabled && classes.selected,
      selected && disabled && classes.disabledAndSelected,
      classNameProp
    );
    return (
      <span
        onClick={selectable && !disabled ? onClick : undefined}
        className={className}
      >
        {text}
      </span>
    );
  }
}

export default withStyles(theme => {
  return {
    token: {
      cursor: 'pointer',
      display: 'inline',
      paddingRight: 0, //theme.spacing.unit * 0.5,
      transition: 'background-color 100ms ease-in'
    },
    disabled: {
      cursor: 'inherit',
      color: 'grey'
    },
    disabledAndSelected: {
      backgroundColor: 'pink'
      // filter: 'brightness(100%)'
    },
    selected: {
      backgroundColor: theme.palette.primary.light
    },

    selectable: {
      '&:hover': {
        backgroundColor: theme.palette.secondary.light
      }
    }
  };
})(Token);
