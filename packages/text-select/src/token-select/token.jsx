import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';

export const TokenTypes = {
  text: PropTypes.string,
  selectable: PropTypes.bool
};

function is_touch_enabled() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export class Token extends React.Component {
  static rootClassName = 'tokenRootClass';

  static propTypes = {
    ...TokenTypes,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    highlight: PropTypes.bool,
    correct: PropTypes.bool,
    text: PropTypes.string.isRequired
  };

  static defaultProps = {
    selectable: false,
    text: ''
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
      highlight,
      correct,
      animationsDisabled
    } = this.props;
    const isTouchEnabled =
      !('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    let className;
    console.log(isTouchEnabled, 'is touch nabled');

    if (correct === undefined && selected && disabled) {
      className = classNames(classes.token, classes.selected, classes.disabledBlack);
    } else if (correct !== undefined) {
      className = classNames(
        Token.rootClassName,
        classes.custom,
        correct === true && classes.correct,
        correct === false && classes.incorrect
      );
    } else {
      className = classNames(
        Token.rootClassName,
        classes.token,
        disabled && classes.disabled,
        selectable && !disabled && isTouchEnabled && classes.selectable,
        selected && !disabled && classes.selected,
        selected && disabled && classes.disabledAndSelected,
        highlight && selectable && !disabled && !selected && classes.highlight,
        animationsDisabled && classes.print,
        classNameProp
      );
    }

    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: (text || '').replace(/\n/g, '<br>') }}
        data-indexkey={index}
      />
    );
  }
}

export default withStyles(theme => {
  return {
    token: {
      cursor: 'pointer',
      textIndent: 0,
      padding: theme.spacing.unit / 2,
      paddingRight: 0,
      paddingLeft: 0,
      transition: 'background-color 100ms ease-in'
    },
    disabled: {
      cursor: 'inherit',
      color: 'grey' // TODO hardcoded color
    },
    disabledBlack: {
      cursor: 'inherit'
    },
    disabledAndSelected: {
      backgroundColor: 'pink' // TODO hardcoded color
    },
    selectable: {
      [theme.breakpoints.up(769)]: {
        '&:hover': {
          backgroundColor: color.primaryLight(),
          '& > *': {
            backgroundColor: color.primaryLight()
          }
        }
      }
    },
    selected: {
      lineHeight: 2,
      marginTop: theme.spacing.unit / 2,
      '&:hover': {
        backgroundColor: color.primaryLight()
      },
      backgroundColor: color.primaryLight(),
      '& > *': {
        backgroundColor: color.primaryLight()
      }
    },
    highlight: {
      // TODO hardcoded color,
      border: 'dashed 2px gray',
      lineHeight: 2,
      boxSizing: 'border-box',
      marginTop: theme.spacing.unit / 2,
      display: 'inline-block',
      padding: theme.spacing.unit
    },
    print: {
      border: 'dashed 2px gray',
      lineHeight: 2,
      boxSizing: 'border-box',
      marginTop: theme.spacing.unit / 2,
      display: 'inline-block',
      padding: theme.spacing.unit,
      color: color.text()
    },

    custom: {
      display: 'initial'
    },
    correct: {
      backgroundColor: color.correct()
    },
    incorrect: {
      backgroundColor: color.incorrect()
    }
  };
})(Token);
