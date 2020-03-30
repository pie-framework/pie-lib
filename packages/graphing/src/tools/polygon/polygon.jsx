import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { gridDraggable, types } from '@pie-lib/plot';
import * as utils from '../../utils';
import classNames from 'classnames';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { correct, disabled, incorrect } from '../shared/styles';

export const getPointString = (points, scale) => {
  return (points || [])
    .map(p => {
      const scaledPoint = {
        x: scale.x(p.x),
        y: scale.y(p.y)
      };
      return `${scaledPoint.x},${scaledPoint.y}`;
    })
    .join(' ');
};

export class RawPolygon extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    points: PropTypes.arrayOf(PropTypes.shape(types.PointType)),
    graphProps: types.GraphPropsType.isRequired,
    closed: PropTypes.bool.isRequired,
    correctness: PropTypes.string
  };

  render() {
    const {
      points,
      classes,
      className,
      disabled,
      correctness,
      graphProps,
      closed,
      ...rest
    } = this.props;
    const { scale } = graphProps;

    const pointString = getPointString(points, scale);
    const Tag = closed ? 'polygon' : 'polyline';
    return (
      <Tag
        points={pointString}
        className={classNames(
          closed && classes.closed,
          !closed && classes.open,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        {...rest}
      />
    );
  }
}
export const Polygon = withStyles(theme => ({
  closed: {
    fill: fade(theme.palette.primary.light, 0.2),
    strokeWidth: 2,
    stroke: theme.palette.secondary.light
  },
  open: {
    fill: fade(theme.palette.primary.light, 0.0),
    strokeWidth: 2,
    stroke: theme.palette.secondary.light,
    pointerEvents: 'none'
  },
  disabled: {
    ...disabled('stroke')
  },
  correct: {
    ...correct('stroke')
  },
  incorrect: {
    ...incorrect('stroke')
  }
}))(RawPolygon);

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { points } = props;
    const area = utils.polygonToArea(points);
    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { points } = props;
    return points[0];
  },
  fromDelta: (props, delta) => {
    const { points } = props;

    const movedPoints = points.map(p => {
      return utils.point(p).add(utils.point(delta));
    });
    return movedPoints;
  }
})(Polygon);
