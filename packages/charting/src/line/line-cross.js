import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { LinePath } from '@vx/shape';
import { Group } from '@vx/group';
import classNames from 'classnames';
import { dataToXBand } from '../utils';
import RawLine from './common/line';

const DraggableComponent = (props) => {
  const { classes = {}, className, scale, x, y, r, correctness, ...rest } = props;

  return (
    <Group {...rest} className={classNames(className, classes.line, correctness && correctness.value)}>
      <LinePath
        data={[
          { x: scale.x(x) - r, y: scale.y(y) + r },
          { x: scale.x(x) + r, y: scale.y(y) - r },
        ]}
        key={`point-${x}-${y}-1`}
        x={(d) => d.x}
        y={(d) => d.y}
        strokeWidth={5}
      />
      <LinePath
        data={[
          { x: scale.x(x) - r, y: scale.y(y) - r },
          { x: scale.x(x) + r, y: scale.y(y) + r },
        ]}
        key={`point-${x}-${y}-2`}
        x={(d) => d.x}
        y={(d) => d.y}
        strokeWidth={5}
      />
    </Group>
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

export class LineCross extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale = {}, size = {} } = graphProps || {};
    const xBand = dataToXBand(scale.x, data, size.width, 'lineCross');

    return <RawLine {...props} xBand={xBand} CustomDraggableComponent={DraggableComponent} />;
  }
}

export default () => ({
  type: 'lineCross',
  Component: LineCross,
  name: 'Line Cross',
});
