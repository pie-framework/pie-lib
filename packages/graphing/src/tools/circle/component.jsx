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
    root: types.PointType,
    disabled: PropTypes.bool,
    edge: types.PointType,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => ({})
  };

  dragRoot = root => {
    const { onChange } = this.props;
    const d = { root, edge: this.props.edge };

    onChange(d);
  };

  dragEdge = edge => {
    const { onChange } = this.props;
    const d = { root: this.props.root, edge };
    onChange(d);
  };

  dragCircle = root => {
    const { onChange } = this.props;
    const diff = point(this.props.root).sub(point(root));
    const edge = point(this.props.edge).sub(diff);
    const d = { root, edge };
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
      root,
      edge,
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

    edge = edge || root;

    const radius = getRadius(root, edge);

    return (
      <g>
        <BgCircle
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.bgCircleBuilding)}
          x={root.x}
          y={root.y}
          radius={radius}
          onDrag={this.dragCircle}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={edge.x}
          y={edge.y}
          onDrag={this.dragEdge}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={root.x}
          y={root.y}
          className={classes.root}
          onDrag={this.dragRoot}
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
