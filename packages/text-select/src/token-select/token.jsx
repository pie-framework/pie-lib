import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
    disabled: PropTypes.bool,
    highlight: PropTypes.bool,
  };

  static defaultProps = {
    selectable: false
  };

  render() {
    const {
      text,
      selectable,
      selected,
      classes,
      className: classNameProp,
      disabled,
      index,
      highlight
    } = this.props;
    const className = classNames(
      'spanWrapper',
      classes.token,
      disabled && classes.disabled,
      selectable && !disabled && classes.selectable,
      selected && !disabled && classes.selected,
      selected && disabled && classes.disabledAndSelected,
      highlight && selectable && !disabled && !selected && classes.highlight,
      classNameProp
    );
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: text }}
        data-indexkey={index}
      />
    );
  }
}

export default withStyles(theme => {
  return {
    token: {
      cursor: 'pointer',
      display: 'initial',
      paddingRight: 0,
      transition: 'background-color 100ms ease-in'
    },
    disabled: {
      cursor: 'inherit',
      color: 'grey'
    },
    disabledAndSelected: {
      backgroundColor: 'pink'
    },
    selectable: {
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
        '& > *': {
          backgroundColor: theme.palette.secondary.light
        }
      }
    },
    selected: {
      '&:hover': {
        backgroundColor: theme.palette.primary.light
      },
      backgroundColor: theme.palette.primary.light,
      '& > *': {
        backgroundColor: theme.palette.primary.light
      }
    },
    highlight: {
      border: `dashed 1px ${theme.palette.primary.light}`
    }
  };
})(Token);
