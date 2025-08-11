import React from 'react';
import classNames from 'classnames';
import { gridDraggable, utils, types } from '@pie-lib/plot';
import { withStyles } from '@material-ui/core/styles/index';
import { color } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';
import { correct, incorrect, disabled } from '../../common/styles';

class RawDragHandle extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    interactive: PropTypes.bool,
    CustomDraggableComponent: PropTypes.func,
    correctness: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  };

  render() {
    const {
      x,
      y,
      graphProps,
      classes,
      className,
      interactive,
      CustomDraggableComponent,
      correctness,
      ...rest
    } = this.props;
    const { scale } = graphProps;

    return (
      <CustomDraggableComponent
        scale={scale}
        x={x}
        y={y}
        classes={classes}
        className={classNames(className, !interactive && 'non-interactive')}
        correctness={correctness}
        interactive={interactive}
        {...rest}
      />
    );
  }
}

export const DragHandle = withStyles(() => ({
  handle: {
    transition: 'fill 200ms linear, height 200ms linear',
    '&.correct': correct('fill'),
    '&.incorrect': incorrect('fill'),
    '&.non-interactive': disabled('fill'),
  },
  transparentHandle: {
    height: '20px',
    fill: 'transparent',
    stroke: 'transparent',
  },
  line: {
    stroke: color.defaults.TEXT,
    transition: 'fill 200ms linear, height 200ms linear',
    '&.non-interactive': disabled('stroke'),
    '&.correct': correct('stroke'),
    '&.incorrect': incorrect('stroke'),
  },
}))(RawDragHandle);

const DraggableHandle = gridDraggable({
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

export default DraggableHandle;
