import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';

import { color } from '../../render-ui';

// we need to use a larger line height for the token to be more readable
const LINE_HEIGHT_MULTIPLIER = 3.2;
// we need a bit more space for correctness indicators
const CORRECTNESS_LINE_HEIGHT_MULTIPLIER = 3.4;
const CORRECTNESS_PADDING = 2;

const Wrapper = ({ useWrapper, children, classNameContainer, iconClass, Icon }) =>
  useWrapper ? (
    <span className={classNameContainer}>
      {children}
      <Icon className={iconClass} />
    </span>
  ) : (
    children
  );

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
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    highlight: PropTypes.bool,
    correct: PropTypes.bool,
  };

  static defaultProps = {
    selectable: false,
    text: '',
  };

  getClassAndIconConfig = () => {
    const {
      selectable,
      selected,
      classes,
      className: classNameProp,
      disabled,
      highlight,
      correct,
      animationsDisabled,
      isMissing,
    } = this.props;
    const isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const baseClassName = Token.rootClassName;
    let classNameContainer;
    let Icon;
    let iconClass;

    if (correct === undefined && selected && disabled) {
      return {
        className: classNames(classes.token, classes.selected, classes.disabledBlack),
      };
    }

    if (correct !== undefined) {
      const isCorrect = correct === true;
      return {
        className: classNames(baseClassName, classes.custom),
        classNameContainer: classNames(isCorrect ? classes.correct : classes.incorrect, classes.commonTokenStyle),
        Icon: isCorrect ? Check : Close,
        iconClass: classNames(
          classes.correctnessIndicatorIcon,
          isCorrect ? classes.correctIcon : classes.incorrectIcon,
        ),
      };
    }

    if (isMissing) {
      return {
        className: classNames(baseClassName, classes.custom, classes.missing, classes.commonTokenStyle),
        classNameContainer: classes.commonTokenStyle,
        Icon: Close,
        iconClass: classNames(classes.correctnessIndicatorIcon, classes.incorrectIcon),
      };
    }

    return {
      className: classNames(
        baseClassName,
        classes.token,
        disabled && classes.disabled,
        selectable && !disabled && !isTouchEnabled && classes.selectable,
        selected && !disabled && classes.selected,
        selected && disabled && classes.disabledAndSelected,
        highlight && selectable && !disabled && !selected && classes.highlight,
        animationsDisabled && classes.print,
        classNameProp,
      ),
      classNameContainer,
      Icon,
      iconClass,
    };
  };

  render() {
    const { text, index, correct, isMissing } = this.props;
    const { className, classNameContainer, Icon, iconClass } = this.getClassAndIconConfig();

    return (
      <Wrapper
        useWrapper={correct !== undefined || isMissing}
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
    },
    disabled: {
      cursor: 'inherit',
      color: color.disabled(),
    },
    disabledBlack: {
      cursor: 'inherit',
    },
    disabledAndSelected: {
      backgroundColor: color.blueGrey100(),
    },
    selectable: {
      [theme.breakpoints.up(769)]: {
        '&:hover': {
          backgroundColor: color.blueGrey300(),
          color: theme.palette.common.black,
          '& > *': {
            backgroundColor: color.blueGrey300(),
          },
        },
      },
    },
    selected: {
      backgroundColor: color.blueGrey100(),
      color: theme.palette.common.black,
      lineHeight: `${theme.spacing.unit * LINE_HEIGHT_MULTIPLIER}px`,
      border: `solid 2px ${color.blueGrey900()}`,
      borderRadius: '4px',
      '& > *': {
        backgroundColor: color.blueGrey100(),
      },
    },
    highlight: {
      border: `dashed 2px ${color.blueGrey600()}`,
      borderRadius: '4px',
      lineHeight: `${theme.spacing.unit * LINE_HEIGHT_MULTIPLIER}px`,
    },
    print: {
      border: `dashed 2px ${color.blueGrey600()}`,
      borderRadius: '4px',
      lineHeight: `${theme.spacing.unit * LINE_HEIGHT_MULTIPLIER}px`,
      color: color.text(),
    },
    custom: {
      display: 'initial',
    },
    commonTokenStyle: {
      position: 'relative',
      borderRadius: '4px',
      color: theme.palette.common.black,
      lineHeight: `${theme.spacing.unit * CORRECTNESS_LINE_HEIGHT_MULTIPLIER + CORRECTNESS_PADDING}px`,
      padding: `${CORRECTNESS_PADDING}px`,
    },
    correct: {
      border: `${color.correctTertiary()} solid 2px`,
    },
    incorrect: {
      border: `${color.incorrectWithIcon()} solid 2px`,
    },
    missing: {
      border: `${color.incorrectWithIcon()} dashed 2px`,
    },
    incorrectIcon: {
      backgroundColor: color.incorrectWithIcon(),
    },
    correctIcon: {
      backgroundColor: color.correctTertiary(),
    },
    correctnessIndicatorIcon: {
      color: color.white(),
      position: 'absolute',
      top: '-8px',
      left: '-8px',
      borderRadius: '50%',
      fontSize: '12px',
      padding: '2px',
    },
  };
})(Token);
