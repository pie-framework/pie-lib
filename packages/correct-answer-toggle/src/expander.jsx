import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { CSSTransition } from 'react-transition-group';

const transition = 'height ease-in 300ms, opacity ease-in 300ms';

const StyledExpander = styled('div')(() => ({
  position: 'relative',
  height: 0,
  overflow: 'hidden',
  display: 'flex',
  visibility: 'hidden',
  width: 0,
  '&.enter': {
    transition,
    opacity: 1,
    height: 'auto',
    width: 'auto',
    visibility: 'visible',
    minHeight: '25px',
  },
  '&.enter-done': {
    height: 'auto',
    visibility: 'visible',
    width: 'auto',
    minHeight: '25px',
  },
  '&.exit': {
    transition,
    opacity: 0,
    height: 0,
    visibility: 'visible',
    width: 0,
  },
  '&.exit-done': {
    opacity: 0,
    visibility: 'hidden',
    height: 0,
    width: 0,
  },
}));

const Expander = (props) => {
  const { show, children, className } = props;

  return (
    <CSSTransition 
      in={show} 
      appear={true} 
      mountOnEnter={false} 
      timeout={300} 
      classNames={{
        enter: 'enter',
        enterDone: 'enter-done',
        exit: 'exit',
        exitDone: 'exit-done'
      }}
    >
      <StyledExpander className={className}>{children}</StyledExpander>
    </CSSTransition>
  );
};

Expander.propTypes = {
  show: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Expander;
