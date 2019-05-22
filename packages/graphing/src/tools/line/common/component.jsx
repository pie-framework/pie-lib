import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import { ToolPropType } from '../../types';
import debug from 'debug';
import { BasePoint, ArrowPoint } from '../../common/point';
import Segment from '../segment/segment';
import Vector from '../vector/vector';
import { point } from '../../../utils';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import isEqual from 'lodash/isEqual';

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

const ComponentTypes = {
  segment: Segment,
  vector: Vector
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
    graphProps: types.GraphPropsType.isRequired
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
    log('[dragFrom] ', draggedFrom);
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

    log('dragSegment: ', draggedFrom, 'from: ', from, 'to: ', to);

    const diff = point(from).sub(point(draggedFrom));
    const draggedTo = point(to).sub(diff);

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
        isSegmentDrag: false
      },
      () => onChange(d)
    );
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
    const f = draggedFrom || from;
    const s = draggedTo || to;
    const common = { graphProps };
    const Component = ComponentTypes[type];

    return (
      <g>
        <Component
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.segmentBuilding)}
          x={isSegmentDrag ? from.x : f.x}
          y={isSegmentDrag ? from.y : f.y}
          from={isSegmentDrag ? from : f}
          to={isSegmentDrag ? to : s}
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
            x={isSegmentDrag ? s.x : to.x}
            y={isSegmentDrag ? s.y : to.y}
            onMove={this.moveTo}
            onDrag={this.dragTo}
            onDragStart={onDragStart}
            onDragStop={onDragStop}
            {...common}
          />
        )}
        {type !== 'segment' && (
          <ArrowPoint
            disabled={building || disabled}
            correctness={correctness}
            from={f}
            to={s}
            x={isSegmentDrag ? s.x : to.x}
            y={isSegmentDrag ? s.y : to.y}
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
