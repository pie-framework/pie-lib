import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { PointType } from '../types';
import { types, gridDraggable } from '@pie-lib/plot';
import * as utils from '../../../utils';
import classNames from 'classnames';
import { disabled } from '../styles';
import * as vx from '@vx/shape';

export class LinePath extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    graphProps: types.GraphPropsType.isRequired,
    disabled: PropTypes.bool,
    root: PropTypes.shape(PointType).isRequired,
    edge: PropTypes.shape(PointType).isRequired,
    isDragging: PropTypes.bool
  };

  render() {
    /* eslint-disable no-unused-vars */
    const {
      data,
      classes,
      className,
      disabled,
      root,
      edge,
      graphProps,
      isDragging,
      ...rest
    } = this.props;
    /* eslint-enable */

    return (
      <React.Fragment>
        <vx.LinePath
          data={data}
          className={classNames(classes.drawLine, disabled && classes.disabled, className)}
          {...rest}
        />
        <vx.LinePath
          data={data}
          className={classNames(
            classes.line,
            isDragging && classes.dragging,
            disabled && classes.disabled,
            className
          )}
          {...rest}
        />
      </React.Fragment>
    );
  }
}

const dragging = theme => ({
  strokeWidth: 7,
  stroke: theme.palette.secondary.light
});

export const StyledLinePath = withStyles(theme => ({
  drawLine: {
    fill: 'none',
    strokeWidth: 2,
    stroke: theme.palette.secondary.light
  },
  line: {
    strokeWidth: 6,
    fill: 'none',
    transition: 'stroke-width 200ms ease-in, stroke 200ms ease-in',
    stroke: 'transparent',
    '&:hover': dragging(theme)
  },
  dragging: dragging(theme),
  disabled: {
    ...disabled('stroke'),
    strokeWidth: 2
  }
}))(LinePath);

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const area = utils.pointsToArea(props.root, props.edge);
    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { root } = props;
    return root;
  },
  fromDelta: (props, delta) => {
    const { root, edge } = props;
    return {
      root: utils.point(root).add(utils.point(delta)),
      edge: utils.point(edge).add(utils.point(delta))
    };
  }
})(StyledLinePath);
