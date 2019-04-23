import React from 'react';
import PropTypes from 'prop-types';
import componentize from './componentize';
import { deserialize } from './serialization';
import Mask from './tree/mask';

export const buildLayoutFromMarkup = markup => {
  const { ids, markup: processed } = componentize(markup, 'blank');
  const value = deserialize(processed);
  return value.document;
};

export default class MaskMarkup extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    config: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func
  };

  render() {
    //1. add nodes
    const { markup, layout, value, onChange } = this.props;
    const { ids, markup: processed } = componentize(markup, 'blank');

    const maskLayout = layout ? layout : buildLayoutFromMarkup(markup);

    return <Mask layout={maskLayout} data={value} onChange={onChange} />;
  }
}
