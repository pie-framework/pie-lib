import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { PointType } from '../types';
import { types, gridDraggable } from '@pie-lib/plot';
import * as utils from '../../utils';
import classNames from 'classnames';
import { disabled } from '../styles';
import * as vx from '@vx/shape';

class RawLinePath extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    graphProps: types.GraphPropsType.isRequired,
    disabled: PropTypes.bool,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    root: PointType.isRequired,
    edge: PointType.isRequired
  };

  render() {
    const { data, classes, xScale, yScale, className, disabled, ...rest } = this.props;
    return (
      <vx.LinePath
        data={data}
        xScale={xScale}
        yScale={yScale}
        className={classNames(classes.line, disabled && classes.disabled, className)}
        {...rest}
      />
    );
  }
}

export const LinePath = withStyles(theme => ({
  line: {
    strokeWidth: 6,
    transition: 'stroke-width 200ms ease-in, stroke 200ms ease-in',
    stroke: 'transparent',
    '&:hover': {
      strokeWidth: 7,
      stroke: theme.palette.secondary.light
    }
  },
  disabled: {
    ...disabled('stroke'),
    strokeWidth: 2
  }
}))(RawLinePath);

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
})(LinePath);
