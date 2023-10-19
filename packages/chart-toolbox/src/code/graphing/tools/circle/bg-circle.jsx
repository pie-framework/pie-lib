import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { types, gridDraggable } from '../../../plot';
import { color } from '@pie-lib/render-ui';
import * as utils from '../../utils';
import { disabled, correct, incorrect, missing } from '../shared/styles';

/**
 * A low level circle component
 *
 * TODO: This and base point have a lot of similarities - merge commonality
 *
 */
class RawCircle extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    radius: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const { classes, disabled, className, correctness, x, y, radius, graphProps, ...rest } = this.props;
    const { scale } = graphProps;
    const rx = Math.abs(scale.x(x + radius) - scale.x(x));
    const ry = Math.abs(scale.y(y + radius) - scale.y(y));

    return (
      <ellipse
        className={classNames(classes.bgCircle, disabled && classes.disabled, classes[correctness], className)}
        cx={scale.x(x)}
        cy={scale.y(y)}
        rx={rx}
        ry={ry}
        {...rest}
      />
    );
  }
}

const applyStyle = (fn) => ({
  ...fn('stroke'),
  '&:hover': {
    strokeWidth: 3,
    ...fn('stroke'),
  },
});

const styles = () => ({
  bgCircle: {
    fill: 'transparent',
    stroke: color.primaryLight(),
    strokeWidth: 3,
    transition: 'stroke 200ms ease-in, stroke-width 200ms ease-in',
    '&:hover': {
      strokeWidth: 6,
      stroke: color.primaryDark(),
    },
  },
  disabled: applyStyle(disabled),
  correct: applyStyle(correct),
  incorrect: applyStyle(incorrect),
  missing: applyStyle(missing),
});

export const BgCircle = withStyles(styles)(RawCircle);

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { x, y } = props;
    const area = { left: x, top: y, bottom: y, right: x };
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    const { x, y } = props;
    return { x, y };
  },
  fromDelta: (props, delta) => {
    const newPoint = utils.point(props).add(utils.point(delta));
    return newPoint;
  },
})(BgCircle);
