import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import CoordinatesLabel from '../../../coordinates-label';
import ReactDOM from 'react-dom';
import { thinnerShapesNeeded } from '../../../utils';

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
      style,
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
          {...rest}
        />
        <g
          className={classNames(classes.point, disabled && classes.disabled, classes[correctness], className)}
          onMouseEnter={() => this.setState({ showCoordinates: true })}
          onMouseLeave={() => this.setState({ showCoordinates: false })}
          {...rest}
        >
          <circle {...rest} r={r} cx={scale.x(x)} cy={scale.y(y)} />
          {labelNode &&
            coordinatesOnHover &&
            showCoordinates &&
            ReactDOM.createPortal(<CoordinatesLabel graphProps={graphProps} x={x} y={y} />, labelNode)}
        </g>
      </>
    );
  }
}
