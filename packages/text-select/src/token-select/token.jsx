import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';

import { color } from '@pie-lib/render-ui';

// we need to use a larger line height for the token to be more readable
const LINE_HEIGHT_MULTIPLIER = 3.2;
// we need a bit more space for correctness indicators
const CORRECTNESS_LINE_HEIGHT_MULTIPLIER = 3.4;
const CORRECTNESS_PADDING = 2;

// Styled components for different token states
const StyledToken = styled('span')(({ theme }) => ({
  cursor: 'pointer',
  textIndent: 0,
  '&.disabled': {
    cursor: 'inherit',
    color: color.disabled(),
  },
  '&.disabledBlack': {
    cursor: 'inherit',
  },
  '&.disabledAndSelected': {
    backgroundColor: color.blueGrey100(),
  },
  [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
    '&.selectable:hover': {
      backgroundColor: color.blueGrey300(),
      color: theme.palette.common.black,
      '& > *': {
        backgroundColor: color.blueGrey300(),
      },
    },
  },
  '&.selected': {
    backgroundColor: color.blueGrey100(),
    color: theme.palette.common.black,
    lineHeight: `${theme.spacing(1) * LINE_HEIGHT_MULTIPLIER}px`,
    border: `solid 2px ${color.blueGrey900()}`,
    borderRadius: '4px',
    '& > *': {
      backgroundColor: color.blueGrey100(),
    },
  },
  '&.highlight': {
    border: `dashed 2px ${color.blueGrey600()}`,
    borderRadius: '4px',
    lineHeight: `${theme.spacing(1) * LINE_HEIGHT_MULTIPLIER}px`,
  },
  '&.print': {
    border: `dashed 2px ${color.blueGrey600()}`,
    borderRadius: '4px',
    lineHeight: `${theme.spacing(1) * LINE_HEIGHT_MULTIPLIER}px`,
    color: color.text(),
  },
  '&.custom': {
    display: 'initial',
  },
}));

const StyledCommonTokenStyle = styled('span')(({ theme }) => ({
  position: 'relative',
  borderRadius: '4px',
  color: theme.palette.common.black,
  lineHeight: `${theme.spacing(1) * CORRECTNESS_LINE_HEIGHT_MULTIPLIER + CORRECTNESS_PADDING}px`,
  padding: `${CORRECTNESS_PADDING}px`,
}));

const StyledCorrectContainer = styled(StyledCommonTokenStyle)(() => ({
  border: `${color.correctTertiary()} solid 2px`,
}));

const StyledIncorrectContainer = styled(StyledCommonTokenStyle)(() => ({
  border: `${color.incorrectWithIcon()} solid 2px`,
}));

const StyledMissingContainer = styled(StyledCommonTokenStyle)(() => ({
  border: `${color.incorrectWithIcon()} dashed 2px`,
}));

const baseIconStyles = {
  color: color.white(),
  position: 'absolute',
  top: '-8px',
  left: '-8px',
  borderRadius: '50%',
  fontSize: '12px',
  padding: '2px',
  display: 'inline-block',
};

const StyledCorrectCheckIcon = styled(Check)(() => ({
  ...baseIconStyles,
  backgroundColor: color.correctTertiary(),
}));

const StyledIncorrectCloseIcon = styled(Close)(() => ({
  ...baseIconStyles,
  backgroundColor: color.incorrectWithIcon(),
}));

const Wrapper = ({ useWrapper, children, Container, Icon }) =>
  useWrapper ? (
    <Container>
      {children}
      {Icon ? <Icon /> : null}
    </Container>
  ) : (
    children
  );

Wrapper.propTypes = {
  useWrapper: PropTypes.bool,
  Container: PropTypes.elementType,
  Icon: PropTypes.elementType,
  children: PropTypes.node,
};

export const TokenTypes = {
  text: PropTypes.string,
  selectable: PropTypes.bool,
};

export class Token extends React.Component {
  static rootClassName = 'tokenRootClass';

  static propTypes = {
    ...TokenTypes,
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
      className: classNameProp,
      disabled,
      highlight,
      correct,
      animationsDisabled,
      isMissing,
    } = this.props;
    const isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const baseClassName = Token.rootClassName;
    let Container;
    let Icon;

    if (correct === undefined && selected && disabled) {
      return {
        className: classNames(baseClassName, 'selected', 'disabledBlack', classNameProp),
        Component: StyledToken,
      };
    }

    if (correct !== undefined) {
      const isCorrect = correct === true;
      return {
        className: classNames(baseClassName, 'custom', classNameProp),
        Component: StyledToken,
        Container: isCorrect ? StyledCorrectContainer : StyledIncorrectContainer,
        Icon: isCorrect ? StyledCorrectCheckIcon : StyledIncorrectCloseIcon,
      };
    }

    if (isMissing) {
      return {
        className: classNames(baseClassName, 'custom', 'missing', classNameProp),
        Component: StyledToken,
        Container: StyledMissingContainer,
        Icon: StyledIncorrectCloseIcon,
      };
    }

    return {
      className: classNames(
        baseClassName,
        disabled && 'disabled',
        selectable && !disabled && !isTouchEnabled && 'selectable',
        selected && !disabled && 'selected',
        selected && disabled && 'disabledAndSelected',
        highlight && selectable && !disabled && !selected && 'highlight',
        animationsDisabled && 'print',
        classNameProp,
      ),
      Component: StyledToken,
      Container,
      Icon,
    };
  };

  render() {
    const { text, index, correct, isMissing } = this.props;
    const { className, Component, Container, Icon } = this.getClassAndIconConfig();

    const TokenComponent = Component || StyledToken;

    return (
      <Wrapper
        useWrapper={correct !== undefined || isMissing}
        Container={Container}
        Icon={Icon}
      >
        <TokenComponent
          className={className}
          dangerouslySetInnerHTML={{ __html: (text || '').replace(/\n/g, '<br>') }}
          data-indexkey={index}
        />
      </Wrapper>
    );
  }
}

export default Token;
