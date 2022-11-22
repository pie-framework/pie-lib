import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';

const style = {
  root: {
    fill: 'var(--arrow-color, black)',
  },
};

export class Arrow extends React.Component {
  render() {
    const { x, y, classes, className, scale } = this.props;
    const names = classNames(classes.root, className);
    let direction = this.props.direction || 'left';

    const xv = scale.x(x);
    const yv = scale.y(y);

    let transform = '';

    const getTransform = (x, y, rotate) => `translate(${x}, ${y}) rotate(${rotate})`;

    if (direction === 'left') {
      transform = getTransform(xv - 15, yv, 0);
    }

    if (direction === 'right') {
      transform = getTransform(xv + 15, yv, 180);
    }

    if (direction === 'up') {
      transform = getTransform(xv, yv - 15, 90);
    }

    if (direction === 'down') {
      transform = getTransform(xv, yv + 15, 270);
    }

    return <path d="m 0,0 8,-5 0,10 -8,-5" transform={transform} className={names} />;
  }
}

Arrow.propTypes = {
  y: PropTypes.number,
  x: PropTypes.number,
  direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  scale: types.ScaleType.isRequired,
};

Arrow.defaultProps = {
  y: 0,
  x: 0,
  direction: 'left',
};

export default withStyles(style)(Arrow);
