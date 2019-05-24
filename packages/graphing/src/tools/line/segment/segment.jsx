import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';

/**
 * A low level segment component
 */
export class RawSegment extends React.Component {
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
    }).isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { classes, disabled, className, correctness, graphProps, from, to, ...rest } = this.props;
    const { scale } = graphProps;

    return (
      <line
        x1={scale.x(from.x)}
        y1={scale.y(from.y)}
        x2={scale.x(to.x)}
        y2={scale.y(to.y)}
        className={classNames(
          classes.bgSegment,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        {...rest}
      />
    );
  }
}
