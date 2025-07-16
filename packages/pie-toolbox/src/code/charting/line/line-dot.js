import React from 'react';
import PropTypes from 'prop-types';
import { types } from '../../plot';
import { dataToXBand } from '../utils';
import RawLine from './common/line';
import classNames from 'classnames';

const DraggableComponent = ({ scale, x, y, className, classes, r, correctness, interactive, ...rest }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <g onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <circle
        cx={scale.x(x)}
        cy={scale.y(y)}
        r={r * 3}
        className={classNames(classes.transparentHandle, className)}
        pointerEvents={correctness ? 'none' : ''}
        {...rest}
      />
      <circle
        cx={scale.x(x)}
        cy={scale.y(y)}
        r={r}
        className={classNames(className, classes.handle, correctness && correctness.value)}
        {...rest}
      />
      {isHovered && !correctness && interactive && (
        <rect
          x={scale.x(x) - r * 2}
          y={scale.y(y) - r * 2}
          width={r * 4}
          height={r * 4}
          stroke="#7E8494"
          strokeWidth="1"
          fill="none"
        />
      )}
    </g>
  );
};

DraggableComponent.propTypes = {
  scale: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  className: PropTypes.string,
  classes: PropTypes.object,
  correctness: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
};

export class LineDot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale = {}, size = {} } = graphProps || {};
    const xBand = dataToXBand(scale.x, data, size.width, 'lineDot');

    return <RawLine {...props} xBand={xBand} CustomDraggableComponent={DraggableComponent} />;
  }
}

export default () => ({
  type: 'lineDot',
  Component: LineDot,
  name: 'Line Dot',
});
