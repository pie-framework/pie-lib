import React from 'react';
import debug from 'debug';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const styles = () => ({
  button: {
    color: 'grey',
    display: 'inline-flex',
    padding: '2px',
    '& :hover': {
      color: 'black'
    }
  },
  active: {
    color: 'black'
  }
});

const log = debug('pie-elements:editable-html:raw-button');

export class RawButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    active: PropTypes.bool,
    extraStyles: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  onClick = e => {
    log('[onClick]');
    e.preventDefault();
    const { onClick } = this.props;
    onClick(e);
  };

  render() {
    const { active, classes, children, extraStyles } = this.props;
    const names = classNames(classes.button, active && classes.active);

    return (
      <div style={extraStyles} className={names} onMouseDown={this.onClick}>
        {children}
      </div>
    );
  }
}

export const Button = injectSheet(styles())(RawButton);

export class RawMarkButton extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    mark: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    classes: PropTypes.object.isRequired,
    active: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  onToggle = e => {
    e.preventDefault();
    this.props.onToggle(this.props.mark);
  };

  render() {
    const { classes, children, active } = this.props;
    const names = classNames(classes.button, active && classes.active);
    return (
      <span className={names} onMouseDown={this.onToggle}>
        {children}
      </span>
    );
  }
}

export const MarkButton = injectSheet(styles())(RawMarkButton);
