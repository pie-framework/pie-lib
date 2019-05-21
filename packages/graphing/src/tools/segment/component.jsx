import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToolPropType } from '../types';
import debug from 'debug';
import BasePoint from '../point/base-point';
import Segment from './segment';
import { point } from '../../utils';
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

export class RawBaseSegment extends React.Component {
  static propTypes = {
    building: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    firstEnd: PropTypes.shape(PointType),
    secondEnd: PropTypes.shape(PointType),
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
      draggedFirstEnd: undefined
    };
  }

  moveFirstEnd = firstEnd => {
    const { onChange, secondEnd } = this.props;
    const d = { firstEnd, secondEnd };

    this.setState({ draggedFirstEnd: undefined }, () => {
      if (!isEqual(firstEnd, secondEnd)) {
        onChange(d);
      }
    });
  };

  dragFirstEnd = draggedFirstEnd => {
    log('[dragFirstEnd] ', draggedFirstEnd);
    this.setState({ draggedFirstEnd });
  };

  moveSecondEnd = secondEnd => {
    const { onChange, firstEnd } = this.props;
    const d = { firstEnd, secondEnd };
    this.setState({ draggedSecondEnd: undefined }, () => {
      if (!isEqual(secondEnd, firstEnd)) {
        onChange(d);
      }
    });
  };

  dragSecondEnd = draggedSecondEnd => {
    this.setState({ draggedSecondEnd });
  };

  dragSegment = draggedFirstEnd => {
    const { firstEnd, secondEnd } = this.props;

    log('dragSegment: ', draggedFirstEnd, 'firstEnd: ', firstEnd, 'secondEnd: ', secondEnd);

    const diff = point(firstEnd).sub(point(draggedFirstEnd));
    const draggedSecondEnd = point(secondEnd).sub(diff);

    this.setState({ draggedFirstEnd, draggedSecondEnd, isSegmentDrag: true });
  };

  moveSegment = firstEnd => {
    const { onChange, firstEnd: propsFirstEnd, secondEnd } = this.props;
    const diff = point(propsFirstEnd).sub(point(firstEnd));
    const d = {
      firstEnd,
      secondEnd: point(secondEnd).sub(diff)
    };
    this.setState(
      {
        draggedFirstEnd: undefined,
        draggedSecondEnd: undefined,
        isSegmentDrag: false
      },
      () => onChange(d)
    );
  };

  render() {
    let {
      firstEnd,
      disabled,
      classes,
      building,
      onDragStart,
      onDragStop,
      correctness,
      graphProps,
      secondEnd
    } = this.props;
    const { draggedFirstEnd, draggedSecondEnd, isSegmentDrag } = this.state;
    log('[render] draggedFirstEnd: ', draggedFirstEnd, 'firstEnd: ', firstEnd);

    secondEnd = secondEnd || firstEnd;
    const f = draggedFirstEnd || firstEnd;
    const s = draggedSecondEnd || secondEnd;
    const common = { graphProps };

    return (
      <g>
        <Segment
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.segmentBuilding)}
          x={isSegmentDrag ? firstEnd.x : f.x}
          y={isSegmentDrag ? firstEnd.y : f.y}
          firstEnd={isSegmentDrag ? firstEnd : f}
          secondEnd={isSegmentDrag ? secondEnd : s}
          onDrag={this.dragSegment}
          onMove={this.moveSegment}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={isSegmentDrag ? s.x : secondEnd.x}
          y={isSegmentDrag ? s.y : secondEnd.y}
          onMove={this.moveSecondEnd}
          onDrag={this.dragSecondEnd}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={isSegmentDrag ? f.x : firstEnd.x}
          y={isSegmentDrag ? f.y : firstEnd.y}
          onMove={this.moveFirstEnd}
          onDrag={this.dragFirstEnd}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
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
      firstEnd: d.firstEnd,
      secondEnd: d.secondEnd
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
