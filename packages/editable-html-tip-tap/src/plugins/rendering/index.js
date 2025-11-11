import React from 'react';

/**
 * Plugin to render the normal divs and spans with attributes (if they are provided)
 */
export default () => {
  return {
    name: 'renderingPlugin',
    renderNode: (props) => {
      const { attributes, children, node } = props;

      if (node.object !== 'block' && node.object !== 'inline') {
        return;
      }

      const Tag = node.object === 'block' ? 'div' : 'span';
      const style = { position: 'relative' };
      const extraAttributes = node.data.get('attributes');

      return React.createElement(
        Tag,
        {
          ...attributes,
          ...extraAttributes,
          style: style,
        },
        children,
      );
    },
  };
};
