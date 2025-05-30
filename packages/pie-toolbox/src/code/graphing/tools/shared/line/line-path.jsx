import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '../../../../plot';
import classNames from 'classnames';
import { disabled, correct, incorrect, missing, disabledSecondary } from '../styles';
import * as vx from '@vx/shape';
import { color } from '../../../../render-ui';

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
          className={classNames(
            classes.drawLine,
            disabled && classes.disabledSecondary,
            classes[correctness],
            className,
          )}
          {...rest}
        />
        <vx.LinePath
          data={data}
          className={classNames(
            classes.line,
            isDragging && classes.dragging,
            disabled && classes.disabledSecondary,
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
  strokeWidth: 4,
  stroke: color.defaults.BLACK,
});

export const LinePath = withStyles((theme) => ({
  drawLine: {
    fill: 'none',
    strokeWidth: 2,
    stroke: color.black(),
  },
  line: {
    strokeWidth: 3,
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
  disabledSecondary: {
    ...disabledSecondary('stroke'),
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
    strokeWidth: 1,
    strokeDasharray: '4 3',
  },
}))(RawLinePath);
