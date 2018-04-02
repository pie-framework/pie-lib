import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import injectSheet from 'react-jss';

const style = {
  root: {
    fill: 'var(--arrow-color, black)'
  }
};

export function Arrow({ x, y, direction, classes, className }) {
  let transform = `translate(${x || 0},${y})`;

  if (direction) {
    if (direction === 'right') {
      transform += ' rotate(180)';
    }
    if (direction === 'up') {
      transform += ' rotate(90)';
    }
    if (direction === 'down') {
      transform += ' rotate(270)';
    }
  }

  const names = classNames(classes.root, className);
  return (
    <path d="m 0,0 8,-5 0,10 -8,-5" transform={transform} className={names} />
  );
}

Arrow.propTypes = {
  y: PropTypes.number,
  x: PropTypes.number,
  direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};

Arrow.defaultProps = {
  y: 0,
  x: 0,
  direction: 'left'
};

export default injectSheet(style)(Arrow);
