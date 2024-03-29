import React from 'react';
import { htmlToValue } from '../../serialization';

// We're possibly going to have to support content types, so starting it as an enum
export const CONTENT_TYPE = {
  FRAGMENT: 'FRAGMENT',
};

// We're possibly going to have to support multiple icon types, so starting it as an enum
export const ICON_TYPE = {
  SVG: 'SVG',
};

const getIcon = (customPluginProps) => {
  const svg = customPluginProps.icon;

  switch (customPluginProps.iconType) {
    case ICON_TYPE.SVG:
      return <span style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: svg }} />;
    default:
      return <span>{customPluginProps.iconAlt}</span>;
  }
};

export default function CustomPlugin(type, customPluginProps) {
  const toolbar = {
    icon: getIcon(customPluginProps),
    onClick: (value, onChange, getFocusedValue) => {
      const editorDOM = document.querySelector(`[data-key="${value.document.key}"]`);
      let valueToUse = value;
      const callback = ({ customContent, contentType }, focus) => {
        valueToUse = getFocusedValue();

        switch (contentType) {
          case CONTENT_TYPE.FRAGMENT:
          default: {
            const contentValue = htmlToValue(customContent);
            const change = valueToUse.change().insertFragment(contentValue.document);

            valueToUse = change.value;
            onChange(change);

            break;
          }
        }

        if (focus) {
          if (editorDOM) {
            editorDOM.focus();
          }
        }
      };

      // NOTE: the emitted event (custom event named by client) will be suffixed with "PIE-"
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
          case CONTENT_TYPE.FRAGMENT:
          default:
            return customContent;
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
