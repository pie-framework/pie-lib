import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';
import classNames from 'classnames';
import { disabled, correct, incorrect, missing } from '../styles';
import * as vx from '@vx/shape';
import { color } from '@pie-lib/render-ui';

export class RawLinePath extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    graphProps: types.GraphPropsType.isRequired,
    disabled: PropTypes.bool,
    correctness: PropTypes.string,
    from: types.PointType,
    to: types.PointType,
    isDragging: PropTypes.bool,
  };

  static defaultProps = {
    from: {},
    to: {},
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { data, classes, className, disabled, correctness, from, to, graphProps, isDragging, ...rest } = this.props;
    /* eslint-enable */

    return (
      <React.Fragment>
        <vx.LinePath
          data={data}
          className={classNames(classes.drawLine, disabled && classes.disabled, classes[correctness], className)}
          {...rest}
        />
        <vx.LinePath
          data={data}
          className={classNames(
            classes.line,
            isDragging && classes.dragging,
            disabled && classes.disabled,
            classes[correctness],
            className,
          )}
          {...rest}
        />
      </React.Fragment>
    );
  }
}

const dragging = () => ({
  strokeWidth: 7,
  stroke: color.secondaryLight(),
});

export const LinePath = withStyles((theme) => ({
  drawLine: {
    fill: 'none',
    strokeWidth: 2,
    stroke: color.secondaryLight(),
  },
  line: {
    strokeWidth: 6,
    fill: 'none',
    transition: 'stroke-width 200ms ease-in, stroke 200ms ease-in',
    stroke: 'transparent',
    '&:hover': dragging(theme),
  },
  dragging: dragging(theme),
  disabled: {
    ...disabled('stroke'),
    strokeWidth: 2,
  },
  correct: {
    ...correct('stroke'),
  },
  incorrect: {
    ...incorrect('stroke'),
  },
  missing: {
    ...missing('stroke'),
  },
}))(RawLinePath);
