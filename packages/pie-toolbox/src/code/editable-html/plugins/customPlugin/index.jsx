import React from 'react';
import { htmlToValue } from "../../serialization";
// import { Inline } from "slate";

export const CONTENT_TYPE = {
  FRAGMENT: 'FRAGMENT'
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
    onClick: (value, onChange, getFocusedValue) => {
      const editorDOM = document.querySelector(`[data-key="${value.document.key}"]`);
      let valueToUse = value;
      const callback = ({ customContent, contentType }, focus) => {
        valueToUse = getFocusedValue();

        switch (contentType) {
          case CONTENT_TYPE.FRAGMENT:
          default: {
            const contentValue = htmlToValue(customContent);
            const change = valueToUse
              .change()
              .insertFragment(contentValue.document);

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

export const serialization = {
  deserialize(el /*, next*/) {
    let type = el.dataset && el.dataset.type;
    let contentType = el.dataset && el.dataset.contentType;

    console.log('deserialize type', type);
    if (type !== "custom-plugin") return;

    let customContent;

    switch (contentType) {
      case CONTENT_TYPE.FRAGMENT:
      default:
        customContent = el.innerHTML;
        break;
    }

    return {
      object: "inline",
      type: type,
      isVoid: true,
      data: { customContent, contentType }
    };
  },
  serialize(object /*, children*/) {
    console.log('serialize object.type', object.type);

    if (object.type !== "custom-plugin") return;

    const { data } = object;
    const customContent = data.get("customContent");
    const contentType = data.get("contentType");

    switch (contentType) {
      case CONTENT_TYPE.FRAGMENT:
      default:
        return (
          <span data-type="custom-plugin" data-content-type={contentType}>
            {customContent}
          </span>
        );
    }
  }
};
