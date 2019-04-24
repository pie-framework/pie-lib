import React from 'react';
import PropTypes from 'prop-types';
import Mask from './tree/mask';
import componentize from './componentize';
import { deserialize } from './serialization';

export const buildLayoutFromMarkup = (markup, type) => {
  const { markup: processed } = componentize(markup, type);
  const value = deserialize(processed);
  return value.document;
};

export const withMask = (type, renderChildren) => {
  return class WithMask extends React.Component {
    static propTypes = {
      markup: PropTypes.string,
      layout: PropTypes.object,
      value: PropTypes.object,
      onChange: PropTypes.func
    };

    render() {
      const { markup, layout, value, onChange } = this.props;

      const maskLayout = layout ? layout : buildLayoutFromMarkup(markup, type);
      return (
        <Mask
          layout={maskLayout}
          value={value}
          onChange={onChange}
          renderChildren={renderChildren(this.props)}
        />
      );
    }
  };
};
