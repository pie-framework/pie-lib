import React from 'react';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  button: {
    color: 'grey',
    display: 'inline-flex',
    padding: '2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      color: 'black',
    },
    '&:focus': {
      outline: `2px solid ${theme.palette.grey[700]}`,
    },
  },
  active: {
    color: 'black',
  },
  disabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    '& :hover': {
      color: 'grey',
    },
  },
});

const log = debug('pie-elements:editable-html:raw-button');

export class RawButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
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
    const { active, classes, children, disabled, extraStyles, ariaLabel } = this.props;

    const names = classNames(classes.button, {
      [classes.active]: active,
      [classes.disabled]: disabled,
    });

    return (
      <button
        style={extraStyles}
        className={names}
        onMouseDown={this.onClick}
        onKeyDown={this.onKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={active}
        tabIndex={0}
      >
        {children}
      </button>
    );
  }
}

export const Button = withStyles(styles)(RawButton);

export class RawMarkButton extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    mark: PropTypes.string,
    label: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    classes: PropTypes.object.isRequired,
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
    const { classes, children, active, label } = this.props;

    const names = classNames(classes.button, active && classes.active);
    return (
      <button
        className={names}
        onMouseDown={this.onToggle}
        aria-pressed={active}
        onKeyDown={this.onKeyDown}
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </button>
    );
  }
}

export const MarkButton = withStyles(styles)(RawMarkButton);
