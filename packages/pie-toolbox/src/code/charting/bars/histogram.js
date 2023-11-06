import React from 'react';
import PropTypes from 'prop-types';
import { types } from '../../plot';
import { dataToXBand } from '../utils';
import Bars from './common/bars';

export class Histogram extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale = {}, size = {} } = graphProps || {};
    const xBand = dataToXBand(scale.x, data, size.width, 'histogram');

    return <Bars {...props} xBand={xBand} histogram={true} />;
  }
}

export default () => ({
  type: 'histogram',
  Component: Histogram,
  name: 'Histogram',
});
