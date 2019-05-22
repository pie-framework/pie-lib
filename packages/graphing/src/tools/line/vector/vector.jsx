import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import classNames from 'classnames';
import { types, gridDraggable } from '@pie-lib/plot';
import * as utils from '../../../utils';
import { disabled, correct, incorrect } from '../../styles';

/**
 * A low level segment component
 *
 * TODO: This and base point have a lot of similarities - merge commonality
 *
 */
class RawVector extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    from: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    to: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { classes, disabled, className, correctness, graphProps, from, to, ...rest } = this.props;
    const { scale } = graphProps;

    return (
      <g>
        <line
          x1={scale.x(from.x)}
          y1={scale.y(from.y)}
          x2={scale.x(to.x)}
          y2={scale.y(to.y)}
          className={classNames(
            classes.bgSegment,
            disabled && classes.disabled,
            classes[correctness],
            className
          )}
          markerEnd="url(#arrow)"
          {...rest}
        />
      </g>
    );
  }
}

const applyStyle = fn => ({
  ...fn('stroke'),
  '&:hover': {
    strokeWidth: 3,
    ...fn('stroke')
  }
});

const styles = theme => ({
  bgSegment: {
    fill: 'transparent',
    stroke: theme.palette.primary.light,
    strokeWidth: 3,
    transition: 'stroke 200ms ease-in, stroke-width 200ms ease-in',
    '&:hover': {
      strokeWidth: 6,
      stroke: theme.palette.primary.dark
    }
  },
  bgArrow: {
    stroke: theme.palette.secondary.main,
    cursor: 'pointer',
    fill: `var(--point-bg, ${theme.palette.secondary.main})`
  },
  disabled: applyStyle(disabled),
  correct: applyStyle(correct),
  incorrect: applyStyle(incorrect)
});

export const BgVector = withStyles(styles)(RawVector);

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { from, to } = props;
    const area = utils.lineToArea(from, to);

    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { from } = props;

    return from;
  },
  fromDelta: (props, delta) => {
    return utils.point(props).add(utils.point(delta));
  }
})(BgVector);
