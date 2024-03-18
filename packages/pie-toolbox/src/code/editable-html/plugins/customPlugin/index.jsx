import React from 'react';
import { Inline } from 'slate';

export default function CustomPlugin(type, customPluginProps, opts) {
  const toolbar = {
    icon: <p>{customPluginProps.icon}</p>,
    onClick: (value, onChange) => {
      const inline = Inline.create({
        type: type,
        isVoid: true,
        data: {
          customContent: undefined,
        },
      });

      const change = value.change().insertInline(inline);
      onChange(change);
      const callback = (insertion) => {
        const nodeIsThere = change.value.document.findDescendant((d) => d.key === inline.key);

        if (nodeIsThere) {
          const c = change.setNodeByKey(inline.key, { data: { customContent: insertion } });
          onChange(c, () => opts.focus('beginning', nodeIsThere));
        } else {
          opts.focus();
        }
      };

      window.dispatchEvent(new CustomEvent(`PIE-${customPluginProps.event}`, { detail: { ...customPluginProps, callback } }));
    },
    supports: (node) => node.object === 'inline' && node.type === type,
  };

  return {
    name: type,
    toolbar,
    renderNode(props) {
      if (props.node.type === type) {
        const { node } = props;
        const { data } = node;
        const jsonData = data.toJSON();
        const { customContent } = jsonData;

        return customContent;
      }
    },
    normalizeNode: (node) => {
      const textNodeMap = {};
      let index = 0;

      if (node.object !== 'document') return;

      node.findDescendant((d) => {
        if (d.object === 'text') {
          textNodeMap[index] = d;
        }

        index++;
      });
    },
  };
}

export const serialization = {
  deserialize(el /*, next*/) {
    // const customPluginData = el.dataset && el.dataset.customPluginData;

    // if (!customPluginData) return;

    let type = el.dataset && el.dataset.type;

    if (type !== 'custom-plugin') return;

    return {
      object: 'inline',
      type: type,
      isVoid: true,
      data: { customContent: el.innerHTML },
    };
  },
  serialize(object /*, children*/) {
    if (object.type !== 'custom-plugin') return;

    const { data } = object;
    const customContent = data.get('customContent');

    return <span data-type="custom-plugin">{customContent}</span>;
    // return <span data-custom-plugin-data={customContent} />;
  },
};
