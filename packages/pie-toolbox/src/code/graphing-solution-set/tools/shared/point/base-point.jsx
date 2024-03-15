import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '../../../../plot';
import CoordinatesLabel from '../../../coordinates-label';
import ReactDOM from 'react-dom';
import { thinnerShapesNeeded } from '../../../utils';
import { color } from '../../../../render-ui';

export class RawBp extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    coordinatesOnHover: PropTypes.bool,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    labelNode: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { showCoordinates: false };
  }

  render() {
    const {
      classes,
      className,
      coordinatesOnHover,
      x,
      y,
      disabled,
      correctness,
      graphProps,
      labelNode,
      // we need to remove style from props
      // eslint-disable-next-line no-unused-vars,react/prop-types
      style,
      onClick,
      // Refactored RawBp component by isolating onTouchStart and onTouchEnd handlers to the outer circle, resolving erratic touch event behavior.
      // Remaining props are now applied only to the inner circle for improved event handling consistency.
      onTouchStart,
      onTouchEnd,
      ...rest
    } = this.props;
    const { showCoordinates } = this.state;
    const { scale } = graphProps;
    const r = thinnerShapesNeeded(graphProps) ? 5 : 7;

    return (
      <>
        <circle
          style={{ fill: 'transparent', cursor: 'pointer', pointerEvents: 'all' }}
          r={r * 3}
          cx={scale.x(x)}
          cy={scale.y(y)}
          onMouseEnter={() => this.setState({ showCoordinates: true })}
          onMouseLeave={() => this.setState({ showCoordinates: false })}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={onClick}
        />
        <g
          className={classNames(classes.point, disabled && classes.disabled, classes[correctness], className)}
          onMouseEnter={() => this.setState({ showCoordinates: true })}
          onMouseLeave={() => this.setState({ showCoordinates: false })}
        >
          <circle
            {...rest}
            style={{ fill: color.defaults.BLACK, cursor: 'pointer' }}
            r={r}
            cx={scale.x(x)}
            cy={scale.y(y)}
          />
          {labelNode &&
            coordinatesOnHover &&
            showCoordinates &&
            ReactDOM.createPortal(<CoordinatesLabel graphProps={graphProps} x={x} y={y} />, labelNode)}
        </g>
      </>
    );
  }
}
