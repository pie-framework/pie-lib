import React from 'react';
import PropTypes from 'prop-types';
import Mask from './mask';
import componentize from './componentize';
import { deserialize } from './serialization';

export const buildLayoutFromMarkup = (markup, type) => {
  const { markup: processed } = componentize(markup, type);
  const value = deserialize(processed);
  console.log(value.document, 'value.document');
  return value.document;
};

export const withMask = (type, renderChildren) => {
  return class WithMask extends React.Component {
    static propTypes = {
      /**
       * At the start we'll probably work with markup
       */
      markup: PropTypes.string,
      /**
       * Once we start authoring, it may make sense for use to us layout, which will be a simple js object that maps to `slate.Value`.
       */
      layout: PropTypes.object,
      value: PropTypes.object,
      onChange: PropTypes.func
    };

    render() {
      const { markup, layout, value, onChange } = this.props;
      console.log(layout, 'layout');

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
