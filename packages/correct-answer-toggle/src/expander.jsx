import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CSSTransition } from 'react-transition-group';

function Expander(props) {
  const { classes, show, children } = props;
  return (
    <CSSTransition in={show} timeout={300} classNames={{ ...classes }}>
      <div className={classes.rootName}>{children}</div>
    </CSSTransition>
  );
}

Expander.propTypes = {
  show: PropTypes.bool.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default withStyles(() => ({
  rootName: {
    position: 'relative',
    height: '25px',
    transition: 'height ease-in 300ms, opacity ease-in 300ms',
    overflow: 'hidden',
    display: 'flex'
  },
  appearDone: {
    opacity: 1,
    height: '25px'
  },
  enter: {
    opacity: 1,
    height: '25px',
    visibility: 'visible'
  },
  enterDone: {
    height: '25px'
  },
  exit: {
    opacity: 0,
    height: '0px'
  },
  exitDone: {
    opacity: 0,
    visibility: 'hidden',
    height: '0px'
  }
}))(Expander);
