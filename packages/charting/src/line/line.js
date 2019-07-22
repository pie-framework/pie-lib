import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { dataToXBand } from '../utils';
import RawLine from './common/line';

export class Line extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale, size } = graphProps;
    const xBand = dataToXBand(scale.x, data, size.width, 'line');

    return <RawLine {...props} xBand={xBand} />;
  }
}

export default () => ({
  type: 'line',
  Component: Line
});
