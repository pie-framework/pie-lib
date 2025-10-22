import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import ReactDOM from 'react-dom';
import CoordinatesLabel from '../../../coordinates-label';
import { thinnerShapesNeeded } from '../../../utils';
import MissingSVG from '../icons/MissingSVG';
import CorrectSVG from '../icons/CorrectSVG';
import IncorrectSVG from '../icons/IncorrectSVG';

export class RawBp extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    coordinatesOnHover: PropTypes.bool,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    labelNode: PropTypes.object,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired,
    onClick: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func,
  };

  state = { showCoordinates: false };

  render() {
    const {
      className,
      coordinatesOnHover,
      x,
      y,
      disabled,
      correctness,
      graphProps,
      labelNode,
      onClick,
      onTouchStart,
      onTouchEnd,
      ...rest
    } = this.props;

    const { showCoordinates } = this.state;
    const { scale } = graphProps;
    const r = thinnerShapesNeeded(graphProps) ? 5 : 7;

    let SvgComponent;
    switch (correctness) {
      case 'missing':
        SvgComponent = MissingSVG;
        break;
      case 'correct':
        SvgComponent = CorrectSVG;
        break;
      case 'incorrect':
        SvgComponent = IncorrectSVG;
        break;
      default:
        SvgComponent = null;
    }

    return (
      <>
        {/* Outer invisible circle for easier touch/click */}
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
        {/* Actual point */}
        <g
          className={className}
          onMouseEnter={() => this.setState({ showCoordinates: true })}
          onMouseLeave={() => this.setState({ showCoordinates: false })}
        >
          <circle {...rest} r={r} cx={scale.x(x)} cy={scale.y(y)} />
          {SvgComponent && <SvgComponent scale={scale} x={x} y={y} />}
          {labelNode &&
            coordinatesOnHover &&
            showCoordinates &&
            ReactDOM.createPortal(<CoordinatesLabel graphProps={graphProps} x={x} y={y} />, labelNode)}
        </g>
      </>
    );
  }
}
