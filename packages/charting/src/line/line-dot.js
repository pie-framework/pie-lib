import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { dataToXBand } from '../utils';
import RawLine from './common/line';
import classNames from 'classnames';

const DraggableComponent = ({ scale, x, y, className, classes, r, ...rest }) => (
  <circle
    cx={scale.x(x)}
    cy={scale.y(y)}
    r={r}
    className={classNames(className, classes.handle)}
    {...rest}
  />
);

DraggableComponent.propTypes = {
  scale: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  className: PropTypes.string,
  classes: PropTypes.object
};

export class LineDot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale, size } = graphProps;
    const xBand = dataToXBand(scale.x, data, size.width, 'lineDot');

    return <RawLine {...props} xBand={xBand} CustomDraggableComponent={DraggableComponent} />;
  }
}

export default () => ({
  type: 'lineDot',
  Component: LineDot
});
