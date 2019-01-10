import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { types, gridDraggable } from '@pie-lib/plot';
import * as utils from '../../utils';
import { disabled, correct, incorrect } from '../styles';

class RawBp extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const {
      classes,
      className,
      x,
      y,
      disabled,
      correctness,
      graphProps,
      ...rest
    } = this.props;
    const { scale } = graphProps;
    return (
      <g
        className={classNames(
          classes.point,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        {...rest}
      >
        <circle r="7" cx={scale.x(x)} cy={scale.y(y)} />
      </g>
    );
  }
}

export const BasePoint = gridDraggable({
  bounds: (props, { domain, range }) => {
    const { x, y } = props;
    const area = { left: x, top: y, bottom: y, right: x };
    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { x, y } = props;
    return { x, y };
  },
  fromDelta: (props, delta) => {
    const newPoint = utils.point(props).add(utils.point(delta));
    return newPoint;
  }
})(RawBp);

const styles = theme => ({
  point: {
    '& circle': {
      cursor: 'pointer',
      fill: `var(--point-bg, ${theme.palette.secondary.main})`
    }
  },
  disabled: {
    '& circle': {
      ...disabled()
    }
  },
  correct: {
    '& circle': {
      ...correct()
    }
  },
  incorrect: {
    '& circle': {
      ...incorrect()
    }
  }
});
export default withStyles(styles)(BasePoint);
