import React from 'react';
import debug from 'debug';
import injectSheet from 'react-jss';
import classNames from 'classnames';

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

  constructor(props) {
    super(props)

    this.onClick = (e) => {
      log('[onClick]');
      e.preventDefault();
      const { onClick } = this.props;
      onClick(e)
    }
  }

  render() {
    const { classes, children, active } = this.props;
    const names = classNames(classes.button, active && classes.active);

    return (
      <div
        className={names}
        onMouseDown={this.onClick}>
        {children}
      </div>
    );
  }
}

export const Button = injectSheet(styles())(RawButton);


export class RawMarkButton extends React.Component {
  constructor(props) {
    super(props);

    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.mark);
    };
  }

  render() {
    const { classes, children, active } = this.props;
    const names = classNames(classes.button, active && classes.active);
    return (
      <span
        className={names}
        onMouseDown={this.onToggle}>
        {children}
      </span>
    );
  }
}

export const MarkButton = injectSheet(styles())(RawMarkButton);