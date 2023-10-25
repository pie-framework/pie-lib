import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { color } from '../../render-ui';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';

const Wrapper = ({ useWrapper, children, classNameContainer, iconClass, Icon }) => {
  if (useWrapper) {
    return (
      <span className={classNameContainer}>
        {children}
        <Icon className={iconClass} viewBox={'0 1 24 24'} />
      </span>
    );
  }

  return children;
};

Wrapper.propTypes = {
  useWrapper: PropTypes.bool,
  classNameContainer: PropTypes.string,
  iconClass: PropTypes.string,
  Icon: PropTypes.func,
  children: PropTypes.element,
};

export const TokenTypes = {
  text: PropTypes.string,
  selectable: PropTypes.bool,
};

export class Token extends React.Component {
  static rootClassName = 'tokenRootClass';

  static propTypes = {
    ...TokenTypes,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    highlight: PropTypes.bool,
    correct: PropTypes.bool,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    selectable: false,
    text: '',
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
      animationsDisabled,
      isMissing,
    } = this.props;
    const isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    let className;
    let classNameContainer;
    let Icon;
    let iconClass;

    if (correct === undefined && selected && disabled) {
      className = classNames(classes.token, classes.selected, classes.disabledBlack);
    } else if (correct !== undefined) {
      className = classNames(Token.rootClassName, classes.custom);
      Icon = correct ? Check : Close;
      classNameContainer = correct === true ? classes.correct : classes.incorrect;
      iconClass = correct === true ? classes.correctIcon : classes.incorrectIcon;
    } else if (isMissing) {
      className = classNames(Token.rootClassName, classes.custom, isMissing === true && classes.missing);
    } else {
      className = classNames(
        Token.rootClassName,
        classes.token,
        disabled && classes.disabled,
        selectable && !disabled && !isTouchEnabled && classes.selectable,
        selected && !disabled && classes.selected,
        selected && disabled && classes.disabledAndSelected,
        highlight && selectable && !disabled && !selected && classes.highlight,
        animationsDisabled && classes.print,
        classNameProp,
      );
    }
    return (
      <Wrapper
        useWrapper={correct !== undefined}
        classNameContainer={classNameContainer}
        iconClass={iconClass}
        Icon={Icon}
      >
        <span
          className={className}
          dangerouslySetInnerHTML={{ __html: (text || '').replace(/\n/g, '<br>') }}
          data-indexkey={index}
        />
      </Wrapper>
    );
  }
}

export default withStyles((theme) => {
  return {
    token: {
      cursor: 'pointer',
      textIndent: 0,
      padding: theme.spacing.unit / 2,
      paddingRight: 0,
      paddingLeft: 0,
      transition: 'background-color 100ms ease-in',
    },
    disabled: {
      cursor: 'inherit',
      color: color.disabled(),
    },
    disabledBlack: {
      cursor: 'inherit',
    },
    disabledAndSelected: {
      backgroundColor: color.secondaryLight(),
    },
    selectable: {
      [theme.breakpoints.up(769)]: {
        '&:hover': {
          backgroundColor: color.primaryLight(),
          '& > *': {
            backgroundColor: color.primaryLight(),
          },
        },
      },
    },
    selected: {
      lineHeight: 2,
      marginTop: theme.spacing.unit / 2,
      backgroundColor: color.primaryLight(),
      '& > *': {
        backgroundColor: color.primaryLight(),
      },
    },
    highlight: {
      border: `dashed 2px ${color.disabled()}`,
      lineHeight: 2,
      boxSizing: 'border-box',
      marginTop: theme.spacing.unit / 2,
      display: 'inline-block',
      padding: theme.spacing.unit,
    },
    print: {
      border: `dashed 2px ${color.disabled()}`,
      lineHeight: 2,
      boxSizing: 'border-box',
      marginTop: theme.spacing.unit / 2,
      display: 'inline-block',
      padding: theme.spacing.unit,
      color: color.text(),
    },

    custom: {
      display: 'initial',
    },
    correct: {
      backgroundColor: color.correctSecondary(),
      border: `${color.correct()} solid 2px`,
      lineHeight: `${theme.spacing.unit * 4}px`,
    },
    incorrect: {
      backgroundColor: color.incorrectSecondary(),
      border: `${color.missing()} solid 2px`,
      lineHeight: `${theme.spacing.unit * 4}px`,
    },
    missing: {
      backgroundColor: color.incorrectSecondary(),
      border: `${color.missing()} dashed 2px`,
      textDecoration: `line-through ${color.missing()}`,
    },
    incorrectIcon: {
      verticalAlign: 'middle',
      fontSize: 'larger',
      color: color.missing(),
    },

    correctIcon: {
      verticalAlign: 'middle',
      fontSize: 'larger',
      color: color.correct(),
    },
  };
})(Token);
