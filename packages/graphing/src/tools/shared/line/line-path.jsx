import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';
import classNames from 'classnames';
import { disabled, correct, incorrect } from '../styles';
import * as vx from '@vx/shape';

export class RawLinePath extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    graphProps: types.GraphPropsType.isRequired,
    disabled: PropTypes.bool,
    correctness: PropTypes.string,
    from: PropTypes.shape(types.PointType).isRequired,
    to: PropTypes.shape(types.PointType).isRequired,
    isDragging: PropTypes.bool
  };

  render() {
    /* eslint-disable no-unused-vars */
    const {
      data,
      classes,
      className,
      disabled,
      correctness,
      from,
      to,
      graphProps,
      isDragging,
      ...rest
    } = this.props;
    /* eslint-enable */

    return (
      <React.Fragment>
        <vx.LinePath
          data={data}
          className={classNames(
            classes.drawLine,
            disabled && classes.disabled,
            classes[correctness],
            className
          )}
          {...rest}
        />
        <vx.LinePath
          data={data}
          className={classNames(
            classes.line,
            isDragging && classes.dragging,
            disabled && classes.disabled,
            classes[correctness],
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

export const LinePath = withStyles(theme => ({
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
  },
  correct: {
    ...correct('stroke')
  },
  incorrect: {
    ...incorrect('stroke')
  }
}))(RawLinePath);
