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
        {...rest}
      />
    );
  }
}

export const DragHandle = withStyles((theme) => ({
  handle: {
    fill: color.secondary(),
    transition: 'fill 200ms linear, height 200ms linear',
    '&:hover': {
      fill: color.secondaryDark(),
    },
    '&.correct': correct('fill'),
    '&.incorrect': incorrect('fill'),
    '&.non-interactive': disabled('fill'),
  },
  line: {
    stroke: color.secondary(),
    transition: 'fill 200ms linear, height 200ms linear',
    '&:hover': {
      stroke: color.secondaryDark(),
    },
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
