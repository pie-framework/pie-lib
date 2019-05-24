import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';

/**
 * A low level segment component
 */
export class RawRay extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    from: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    to: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    forward: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const {
      classes,
      disabled,
      className,
      correctness,
      graphProps,
      from,
      forward,
      ...rest
    } = this.props;
    const { scale } = graphProps;

    return (
      <g>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 5 5"
            refX="2.5"
            refY="2.5"
            markerWidth="3"
            markerHeight="3"
            orient="auto-start-reverse"
            className={classes.arrow}
          >
            <path d="M 0 0 L 5 2.5 L 0 5 z" />
          </marker>
        </defs>
        <line
          x1={scale.x(from.x)}
          y1={scale.y(from.y)}
          x2={scale.x(forward.x)}
          y2={scale.y(forward.y)}
          className={classNames(
            classes.bgSegment,
            disabled && classes.disabled,
            classes[correctness],
            className
          )}
          markerEnd="url(#arrow)"
          {...rest}
        />
      </g>
    );
  }
}
