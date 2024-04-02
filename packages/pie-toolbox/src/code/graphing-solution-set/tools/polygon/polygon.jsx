import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { gridDraggable, types } from '../../../plot';
import * as utils from '../../utils';
import classNames from 'classnames';
import { color } from '../../../render-ui';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { correct, disabled, incorrect } from '../shared/styles';

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
    classes: PropTypes.object,
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
    const { points, classes, className, correctness, graphProps, closed, isSolution, ...rest } = this.props;
    const { scale } = graphProps;

    const pointString = getPointString(points, scale);
    const Tag = closed ? 'polygon' : 'polyline';
    return (
      <Tag
        points={pointString}
        className={classNames(isSolution ? classes.gssSolution : classes.gssClosed, classes[correctness], className)}
        {...rest}
      />
    );
  }
}

export const Polygon = withStyles((theme) => ({
  closed: {
    fill: fade(theme.palette.primary.light, 0.2), // TODO hardcoded color
    strokeWidth: 2,
    stroke: color.defaults.SECONDARY_LIGHT,
  },
  open: {
    fill: fade(theme.palette.primary.light, 0.0), // TODO hardcoded color
    strokeWidth: 2,
    stroke: color.defaults.SECONDARY_LIGHT,
    pointerEvents: 'none',
  },
  gssClosed: {
    fill: 'transparent',
    '&:hover': {
      fill: 'rgb(0, 0, 0, 0.42)',
    },
  },
  gssSolution: {
    fill: 'rgb(0, 0, 0, 0.64)',
  },
  disabled: {
    ...disabled('stroke'),
  },
  correct: {
    ...correct('stroke'),
  },
  incorrect: {
    ...incorrect('stroke'),
  },
}))(RawPolygon);

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
