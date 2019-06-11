import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import { BasePoint } from '../shared/point';
import BgCircle from './bg-circle';
import { point } from '../../utils';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import { rootEdgeComponent } from '../shared/line/with-root-edge';

const log = debug('pie-lib:graphing:circle');

const opacityPulsate = opacity => ({
  '0%': { opacity: '0.0' },
  '50%': { opacity },
  '100%': { opacity: '0.0' }
});

const getRadius = (root, outer) => {
  const c = point(root);
  return c.dist(point(outer));
};

export class RawBaseCircle extends React.Component {
  static propTypes = {
    building: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    from: types.PointType,
    disabled: PropTypes.bool,
    to: types.PointType,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => ({})
  };

  dragFrom = from => {
    const { onChange } = this.props;
    const d = { from, to: this.props.to };

    onChange(d);
  };

  dragTo = to => {
    const { onChange } = this.props;
    const d = { from: this.props.from, to };
    onChange(d);
  };

  dragCircle = from => {
    const { onChange } = this.props;
    const diff = point(this.props.from).sub(point(from));
    const to = point(this.props.to).sub(diff);
    const d = { from, to };
    this.setState(
      {
        draggedroot: undefined,
        draggedOuter: undefined,
        isCircleDrag: false
      },
      () => {
        onChange(d);
      }
    );
  };

  render() {
    let {
      from,
      to,
      disabled,
      classes,
      building,
      onDragStart,
      onDragStop,
      onClick,
      correctness,
      graphProps
    } = this.props;

    const common = { onDragStart, onDragStop, graphProps, onClick };

    to = to || from;

    const radius = getRadius(from, to);

    return (
      <g>
        <BgCircle
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.bgCircleBuilding)}
          x={from.x}
          y={from.y}
          radius={radius}
          onDrag={this.dragCircle}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={to.x}
          y={to.y}
          onDrag={this.dragTo}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={from.x}
          y={from.y}
          className={classes.root}
          onDrag={this.dragFrom}
          {...common}
        />
      </g>
    );
  }
}

export const BaseCircle = withStyles(theme => ({
  outerLine: {
    fill: 'rgb(0,0,0,0)',
    stroke: theme.palette.primary.light,
    strokeWidth: 4,
    '&:hover': {
      strokeWidth: 6,
      stroke: theme.palette.primary.dark
    }
  },
  root: {},
  bgCircleBuilding: {
    stroke: theme.palette.secondary.light,
    animation: 'opacityPulse 2s ease-out',
    animationIterationCount: 'infinite',
    opacity: 1
  },
  '@keyframes opacityPulse': opacityPulsate('0.3')
}))(RawBaseCircle);

const Component = rootEdgeComponent(BaseCircle);
export default Component;
