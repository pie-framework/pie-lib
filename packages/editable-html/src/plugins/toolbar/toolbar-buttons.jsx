import React from 'react';
import debug from 'debug';
import injectSheet from 'react-jss';

const styles = {
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
}

const buttonStyles = {
  root: Object.assign(styles.button, {
    display: 'inline-flex'
  })
}

const rbLog = debug('editable-html:raw-button');

export class RawButton extends React.Component {

  constructor(props) {
    super(props)

    this.onClick = (e) => {
      rbLog('[onClick]');
      e.preventDefault();
      const { onClick } = this.props;
      onClick(e)
    }
  }

  render() {
    const { classes, children } = this.props;
    return <div
      onMouseDown={this.onClick}
      className={classes.root}>{children}</div>;
  }
}

export const Button = injectSheet(buttonStyles)(RawButton);


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
    let className = classes.button;

    if (active) {
      className += ` ${classes.active}`;
    }

    return <span
      className={className}
      onMouseDown={this.onToggle}>{children}</span>
  }
}

export const MarkButton = injectSheet(styles)(RawMarkButton);