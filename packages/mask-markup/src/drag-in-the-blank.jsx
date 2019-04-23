import React from 'react';
import PropTypes from 'prop-types';
import componentize from './componentize';
import { deserialize } from './serialization';
import Mask from './tree/mask';
import Choices from './choices';

export const buildLayoutFromMarkup = markup => {
  const { ids, markup: processed } = componentize(markup, 'blank');
  const value = deserialize(processed);
  return value.document;
};

export default class DragInTheBlank extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    choices: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func
  };

  render() {
    //1. add nodes
    const { markup, layout, value, onChange, choices } = this.props;

    const maskLayout = layout ? layout : buildLayoutFromMarkup(markup);

    return (
      <div>
        <Choices value={choices} />
        <Mask layout={maskLayout} data={value} onChange={onChange} />
      </div>
    );
  }
}
