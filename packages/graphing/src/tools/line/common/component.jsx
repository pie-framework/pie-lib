import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import { ToolPropType } from '../../types';
import debug from 'debug';
import { BasePoint, ArrowPoint } from '../../common/point';
import { point } from '../../../utils';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import isEqual from 'lodash/isEqual';
import { calculateThirdPointOnLine } from '../../../utils';
import Components from './gridDraggableComponent';

const log = debug('pie-lib:graphing:segment');

const opacityPulsate = opacity => ({
  '0%': { opacity: '0.0' },
  '50%': { opacity },
  '100%': { opacity: '0.0' }
});

export const PointType = {
  x: PropTypes.number,
  y: PropTypes.number
};

export class RawBaseSegment extends React.Component {
  static propTypes = {
    building: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    from: PropTypes.shape(PointType),
    to: PropTypes.shape(PointType),
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    type: PropTypes.string
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      draggedFrom: undefined
    };
  }

  moveFrom = from => {
    const { onChange, to } = this.props;
    const d = { from, to };

    this.setState({ draggedFrom: undefined }, () => {
      if (!isEqual(from, to)) {
        onChange(d);
      }
    });
  };

  dragFrom = draggedFrom => {
    this.setState({ draggedFrom });
  };

  moveTo = to => {
    const { onChange, from } = this.props;
    const d = { from, to };

    this.setState({ draggedTo: undefined }, () => {
      if (!isEqual(to, from)) {
        onChange(d);
      }
    });
  };

  dragTo = draggedTo => {
    this.setState({ draggedTo });
  };

  dragSegment = draggedFrom => {
    const { from, to } = this.props;
    const diff = point(from).sub(point(draggedFrom));
    const draggedTo = point(to).sub(diff);
    log('dragSegment: ', draggedFrom, 'from: ', from, 'to: ', to);

    this.setState({ draggedFrom, draggedTo, isSegmentDrag: true });
  };

  moveSegment = from => {
    const { onChange, from: propsFrom, to } = this.props;
    const diff = point(propsFrom).sub(point(from));
    const d = {
      from,
      to: point(to).sub(diff)
    };
    this.setState(
      {
        draggedFrom: undefined,
        draggedTo: undefined,
        isSegmentDrag: false,
        draggedToTest: null
      },
      () => onChange(d)
    );
  };

  getRayAtPosition = (rayEndsAt, lineStartsAt, lineEndsAt, rayPosition = 'start') => {
    let { from, graphProps } = this.props;
    const { draggedFrom, draggedTo, isSegmentDrag } = this.state;
    let arrowPoint;

    if (!isSegmentDrag) {
      if (rayPosition === 'start') {
        arrowPoint = calculateThirdPointOnLine(lineEndsAt, lineStartsAt, graphProps);
      } else {
        arrowPoint = calculateThirdPointOnLine(lineStartsAt, lineEndsAt, graphProps);
      }

      if (isFinite(arrowPoint.x) && isFinite(arrowPoint.y)) {
        rayEndsAt = arrowPoint;
      }
    } else {
      const diff = point(from).sub(point(draggedFrom));
      if (rayPosition === 'start') {
        arrowPoint = calculateThirdPointOnLine(draggedTo, draggedFrom, graphProps);
      } else {
        arrowPoint = calculateThirdPointOnLine(draggedFrom, draggedTo, graphProps);
      }

      rayEndsAt = point(arrowPoint).add(diff);
    }

    console.log(rayEndsAt);
    return rayEndsAt;
  };

  render() {
    let {
      from,
      disabled,
      classes,
      building,
      onDragStart,
      onDragStop,
      correctness,
      graphProps,
      type,
      to
    } = this.props;
    const { draggedFrom, draggedTo, isSegmentDrag } = this.state;

    log('[render] draggedFrom: ', draggedFrom, 'from: ', from);

    to = to || from;
    const common = { graphProps };
    const Component = Components[type];

    const f = draggedFrom || from;
    const t = draggedTo || to;
    const lineStartsAt = isSegmentDrag ? from : f;
    const lineEndsAt = isSegmentDrag ? to : t;
    let rayEndsAt = lineEndsAt;
    let rayStartsAt = lineStartsAt;

    if (type === 'ray' || type === 'line') {
      rayEndsAt = this.getRayAtPosition(rayEndsAt, lineStartsAt, lineEndsAt, 'end');
    }

    if (type === 'line') {
      rayStartsAt = this.getRayAtPosition(rayEndsAt, lineStartsAt, lineEndsAt, 'start');
    }

    return (
      <g>
        <Component
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.segmentBuilding)}
          x={lineStartsAt.x}
          y={lineStartsAt.y}
          from={lineStartsAt}
          to={lineEndsAt}
          backward={rayStartsAt}
          forward={rayEndsAt}
          onDrag={this.dragSegment}
          onMove={this.moveSegment}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={isSegmentDrag ? f.x : from.x}
          y={isSegmentDrag ? f.y : from.y}
          onMove={this.moveFrom}
          onDrag={this.dragFrom}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
        {type !== 'vector' && (
          <BasePoint
            disabled={building || disabled}
            correctness={correctness}
            x={isSegmentDrag ? t.x : to.x}
            y={isSegmentDrag ? t.y : to.y}
            onMove={this.moveTo}
            onDrag={this.dragTo}
            onDragStart={onDragStart}
            onDragStop={onDragStop}
            {...common}
          />
        )}
        {type === 'vector' && (
          <ArrowPoint
            disabled={building || disabled}
            correctness={correctness}
            from={f}
            to={t}
            x={isSegmentDrag ? t.x : to.x}
            y={isSegmentDrag ? t.y : to.y}
            onMove={this.moveTo}
            onDrag={this.dragTo}
            onDragStart={onDragStart}
            onDragStop={onDragStop}
            {...common}
          />
        )}
      </g>
    );
  }
}

export const BaseSegment = withStyles(theme => ({
  outerLine: {
    fill: 'rgb(0,0,0,0)',
    stroke: theme.palette.primary.light,
    strokeWidth: 4,
    '&:hover': {
      strokeWidth: 6,
      stroke: theme.palette.primary.dark
    }
  },
  segmentBuilding: {
    stroke: theme.palette.secondary.light,
    animation: 'opacityPulse 2s ease-out',
    animationIterationCount: 'infinite',
    opacity: 1
  },
  '@keyframes opacityPulse': opacityPulsate('0.3')
}))(RawBaseSegment);

export default class Component extends React.Component {
  static propTypes = {
    ...ToolPropType,
    graphProps: types.GraphPropsType.isRequired
  };

  change = d => {
    const { onChange } = this.props;
    const m = {
      ...this.props.mark,
      from: d.from,
      to: d.to
    };
    onChange(this.props.mark, m);
  };

  render() {
    const { mark, onDragStart, onDragStop, graphProps } = this.props;
    return (
      <BaseSegment
        {...mark}
        onChange={this.change}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        graphProps={graphProps}
      />
    );
  }
}
