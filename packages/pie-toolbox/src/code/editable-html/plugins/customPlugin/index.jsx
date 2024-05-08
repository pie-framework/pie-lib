import React from 'react';
import { htmlToValue } from '../../new-serialization';
import {ReactEditor} from "slate-react";
import {Editor, Text, Transforms} from "slate";

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
    onClick: (editor) => {
      const callback = ({ customContent, contentType }, focus) => {
        switch (contentType) {
          case CONTENT_TYPE.FRAGMENT:
          default: {
            const contentValue = htmlToValue(customContent);

            const [nodeAtSelection, nodePath] = Editor.node(editor, editor.selection);

            if (Text.isText(nodeAtSelection)) {
              const block = { type: 'paragraph', children: [] };

              Transforms.wrapNodes(editor, block, { at: nodePath });
            }

            editor.insertNode(contentValue);
            Transforms.move(editor, { distance: 1, unit: 'offset' });

            break;
          }
        }

        if (focus) {
          ReactEditor.focus(editor);
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
