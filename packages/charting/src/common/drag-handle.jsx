import React from 'react';
import classNames from 'classnames';
import { gridDraggable, utils, types } from '@pie-lib/plot';
import { withStyles } from '@material-ui/core/styles/index';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { correct, incorrect, disabled } from './styles';

export class RawDragHandle extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    interactive: PropTypes.bool,
    correctness: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  };
  render() {
    const { x, y, width, graphProps, classes, className, interactive, correctness, ...rest } = this.props;
    const { scale } = graphProps;

    return (
      <svg
        x={x}
        y={scale.y(y) - 10}
        width={width}
        overflow="visible"
        className={classNames(
          classes.handleContainer,
          className,
          !interactive && 'non-interactive',
          interactive && correctness && correctness.value,
        )}
      >
        <rect y={-10} width={width} className={classNames(classes.transparentHandle, className)} {...rest} />
        <rect
          width={width}
          className={classNames(
            classes.handle,
            'handle',
            className,
            !interactive && 'non-interactive',
            interactive && correctness && correctness.value,
          )}
          {...rest}
        />
        <rect y={10} width={width} className={classNames(classes.transparentHandle, className)} {...rest} />
      </svg>
    );
  }
}

export const DragHandle = withStyles((theme) => ({
  handle: {
    height: '10px',
    fill: color.secondary(),
    transition: 'fill 200ms linear, height 200ms linear',
    '&.correct': correct('fill'),
    '&.incorrect': incorrect('fill'),
    '&.non-interactive': disabled('fill'),
  },
  transparentHandle: {
    height: '20px',
    fill: 'transparent',
  },
  handleContainer: {
    height: 30,
    '&:hover': {
      '& .handle': {
        fill: color.secondaryDark(),
        height: '16px',
      },
    },
    '&.non-interactive': disabled('fill'),
    '&.incorrect': incorrect('fill'),
    '&.correct': correct('fill'),
  },
}))(RawDragHandle);

export const D = gridDraggable({
  axis: 'y',
  fromDelta: (props, delta) => {
    //TODO: should be in grid-draggable, if axis is y delta.x should always be 0.
    delta.x = 0;
    const newPoint = utils.point(props).add(utils.point(delta));

    return newPoint.y;
  },
  bounds: (props, { domain, range }) => {
    const area = { left: 0, top: props.y, bottom: props.y, right: 0 };
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    return { x: props.x, y: props.y };
  },
})(DragHandle);

export default D;
