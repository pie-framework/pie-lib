import React from 'react';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledButton = styled('button', {
  shouldForwardProp: (prop) => !['active', 'disabled', 'extraStyles'].includes(prop),
})(({ theme, active, disabled, extraStyles }) => ({
  color: active ? 'black' : 'grey',
  display: 'inline-flex',
  padding: '2px',
  background: 'none',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.7 : 1,
  '&:hover': {
    color: disabled ? 'grey' : 'black',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.grey[700]}`,
  },
  ...extraStyles,
}));

const log = debug('pie-elements:editable-html:raw-button');

export class RawButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    extraStyles: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  onClick = (e) => {
    log('[onClick]');
    e.preventDefault();
    const { onClick } = this.props;
    onClick(e);
  };

  onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      log('[onKeyDown]');
      e.preventDefault();
      const { onClick } = this.props;
      onClick(e);
    }
  };

  render() {
    const { active, children, disabled, extraStyles, ariaLabel } = this.props;

    return (
      <StyledButton
        active={active}
        disabled={disabled}
        extraStyles={extraStyles}
        onMouseDown={this.onClick}
        onKeyDown={this.onKeyDown}
        aria-label={ariaLabel}
        aria-pressed={active}
        tabIndex={0}
      >
        {children}
      </StyledButton>
    );
  }
}

export const Button = RawButton;

export class RawMarkButton extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    mark: PropTypes.string,
    label: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    active: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.mark);
  };

  onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.props.onToggle(this.props.mark);
    }
  };

  render() {
    const { children, active, label } = this.props;

    return (
      <StyledButton
        active={active}
        onMouseDown={this.onToggle}
        aria-pressed={active}
        onKeyDown={this.onKeyDown}
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </StyledButton>
    );
  }
}

export const MarkButton = RawMarkButton;
