import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { types, gridDraggable } from '@pie-lib/plot';
import * as utils from '../../utils';
import { disabled, correct, incorrect } from '../styles';

/**
 * A low level segment component
 *
 * TODO: This and base point have a lot of similarities - merge commonality
 *
 */
class RawSegment extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    firstEnd: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    secondEnd: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const {
      classes,
      disabled,
      className,
      correctness,
      graphProps,
      firstEnd,
      secondEnd,
      ...rest
    } = this.props;
    const { scale } = graphProps;

    return (
      <line
        x1={scale.x(firstEnd.x)}
        y1={scale.y(firstEnd.y)}
        x2={scale.x(secondEnd.x)}
        y2={scale.y(secondEnd.y)}
        className={classNames(
          classes.bgSegment,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        {...rest}
      />
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
  disabled: applyStyle(disabled),
  correct: applyStyle(correct),
  incorrect: applyStyle(incorrect)
});

export const BgSegment = withStyles(styles)(RawSegment);

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { firstEnd, secondEnd } = props;
    const area = utils.lineToArea(firstEnd, secondEnd);

    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { firstEnd } = props;

    return firstEnd;
  },
  fromDelta: (props, delta) => {
    return utils.point(props).add(utils.point(delta));
  }
})(BgSegment);
