import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CSSTransition } from 'react-transition-group';

const Expander = (props) => {
  const { classes, show, children } = props;

  return (
    <CSSTransition in={show} appear={true} mountOnEnter={false} timeout={300} classNames={{ ...classes }}>
      <div className={classes.expander}>{children}</div>
    </CSSTransition>
  );
};

Expander.propTypes = {
  show: PropTypes.bool.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const transition = 'height ease-in 300ms, opacity ease-in 300ms';

export default withStyles(() => ({
  expander: {
    position: 'relative',
    height: 0,
    overflow: 'hidden',
    display: 'flex',
    visibility: 'hidden',
    width: 0,
  },
  enter: {
    transition,
    opacity: 1,
    height: '25px',
    width: 'auto',
    visibility: 'visible',
  },
  enterDone: {
    height: '25px',
    visibility: 'visible',
    width: 'auto',
  },
  exit: {
    transition,
    opacity: 0,
    height: 0,
    visibility: 'visible',
    width: 0,
  },
  exitDone: {
    opacity: 0,
    visibility: 'hidden',
    height: 0,
    width: 0,
  },
}))(Expander);
