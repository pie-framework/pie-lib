import React from 'react';
import { Inline } from 'slate';

export const CONTENT_TYPE = {
  TEXT: 'TEXT',
  // TODO HTML is still WIP, and is not working as expected
  HTML: 'HTML',
};

export const ICON_TYPE = {
  SVG: 'SVG',
};

export default function CustomPlugin(type, customPluginProps, opts) {
  const svg = customPluginProps.icon;

  let icon;

  switch (customPluginProps.iconType) {
    case ICON_TYPE.SVG:
      icon = <span style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: svg }} />;
      break;
    default:
      icon = <span>{customPluginProps.iconAlt}</span>;
      break;
  }

  const toolbar = {
    icon: icon,
    onClick: (value, onChange) => {
      const inline = Inline.create({
        type: type,
        isVoid: true,
        data: {
          customContent: undefined,
          contentType: CONTENT_TYPE.TEXT,
        },
      });

      const change = value.change().insertInline(inline);
      onChange(change);
      const callback = ({ customContent, contentType }) => {
        if (!customContent || !contentType || !CONTENT_TYPE[contentType]) {
          console.error(
            'callback parameter needs to contain customContent and contentType, where contentType is one of:',
            JSON.stringify(CONTENT_TYPE),
          );
          return;
        }

        const nodeIsThere = change.value.document.findDescendant((d) => d.key === inline.key);

        if (nodeIsThere) {
          const c = change.setNodeByKey(inline.key, { data: { customContent, contentType } });
          onChange(c, () => opts.focus('beginning', nodeIsThere));
        } else {
          opts.focus();
        }
      };

      window.dispatchEvent(
        new CustomEvent(`PIE-${customPluginProps.event}`, {
          detail: {
            ...customPluginProps,
            callback,
          },
        }),
      );
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
        const { customContent, contentType } = jsonData;

        switch (contentType) {
          case CONTENT_TYPE.TEXT:
          default:
            return customContent;
          case CONTENT_TYPE.HTML:
            return <span dangerouslySetInnerHTML={{ __html: customContent }} />;
        }
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
    let type = el.dataset && el.dataset.type;
    let contentType = el.dataset && el.dataset.contentType;

    if (type !== 'custom-plugin') return;

    let customContent;

    switch (contentType) {
      case CONTENT_TYPE.TEXT:
      default:
        customContent = el.innerHTML;
        break;
      case CONTENT_TYPE.HTML: {
        customContent = el.dataset && el.dataset.customPluginData;

        break;
      }
    }

    return {
      object: 'inline',
      type: type,
      isVoid: true,
      data: { customContent, contentType },
    };
  },
  serialize(object /*, children*/) {
    if (object.type !== 'custom-plugin') return;

    const { data } = object;
    const customContent = data.get('customContent');
    const contentType = data.get('contentType');

    switch (contentType) {
      case CONTENT_TYPE.TEXT:
      default:
        return (
          <span data-type="custom-plugin" data-content-type={contentType}>
            {customContent}
          </span>
        );
      case CONTENT_TYPE.HTML:
        return (
          <span
            data-type="custom-plugin"
            data-content-type={contentType}
            data-custom-plugin-data={decodeURIComponent(customContent)}
          />
        );
    }
  },
};
