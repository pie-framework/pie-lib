import React from 'react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { gridDraggable, types } from '@pie-lib/plot';
import * as utils from '../../utils';
import { color } from '@pie-lib/render-ui';
import { correct, disabled, incorrect } from '../shared/styles';

const StyledPolygon = styled('polygon', {
  shouldForwardProp: (prop) => !['isSolution', 'correctness'].includes(prop),
})(({ theme, isSolution, correctness }) => ({
  fill: isSolution ? 'rgb(60, 73, 150, 0.6)' : 'transparent',
  strokeWidth: 2,
  stroke: color.defaults.SECONDARY_LIGHT,
  '&:hover': {
    fill: isSolution ? 'rgb(60, 73, 150, 0.6)' : 'rgb(0, 0, 0, 0.25)',
  },
  ...(correctness === 'correct' && correct('stroke')),
  ...(correctness === 'incorrect' && incorrect('stroke')),
}));

const StyledPolyline = styled('polyline', {
  shouldForwardProp: (prop) => !['isSolution', 'correctness'].includes(prop),
})(({ theme, isSolution, correctness }) => ({
  fill: isSolution ? 'rgb(60, 73, 150, 0.6)' : 'transparent',
  strokeWidth: 2,
  stroke: color.defaults.SECONDARY_LIGHT,
  '&:hover': {
    fill: isSolution ? 'rgb(60, 73, 150, 0.6)' : 'rgb(0, 0, 0, 0.25)',
  },
  ...(correctness === 'correct' && correct('stroke')),
  ...(correctness === 'incorrect' && incorrect('stroke')),
}));

export const getPointString = (points, scale) => {
  return (points || [])
    .map((p) => {
      const scaledPoint = {
        x: scale.x(p.x),
        y: scale.y(p.y),
      };
      return `${scaledPoint.x},${scaledPoint.y}`;
    })
    .join(' ');
};

export class RawPolygon extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    isSolution: PropTypes.bool,
    points: PropTypes.arrayOf(types.PointType),
    graphProps: types.GraphPropsType.isRequired,
    closed: PropTypes.bool.isRequired,
    correctness: PropTypes.string,
  };

  static defaultProps = {
    points: [],
  };

  render() {
    const { points, className, correctness, graphProps, closed, isSolution, ...rest } = this.props;
    const { scale } = graphProps;

    const pointString = getPointString(points, scale);
    const Component = closed ? StyledPolygon : StyledPolyline;
    return (
      <Component
        points={pointString}
        isSolution={isSolution}
        correctness={correctness}
        className={className}
        {...rest}
      />
    );
  }
}

export const Polygon = RawPolygon;

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { points } = props;
    const area = utils.polygonToArea(points);
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    const { points } = props;
    return points[0];
  },
  fromDelta: (props, delta) => {
    const { points } = props;

    return points.map((p) => utils.point(p).add(utils.point(delta)));
  },
})(Polygon);
