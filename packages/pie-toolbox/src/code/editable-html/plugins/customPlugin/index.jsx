import React from 'react';
import ReactDOM from 'react-dom';
import { Inline } from 'slate';
import Star from '@material-ui/icons/Star';
import debug from 'debug';

import CustomDialog from './custom-dialog';

const log = debug('@pie-lib:editable-html:plugins:image');

const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-custom-dialog');

  prevDialogs.forEach((s) => s.remove());
};

export const insertDialog = (props) => {
  const newEl = document.createElement('div');
  const { type, callback, opts, ...rest } = props;
  const initialBodyOverflow = document.body.style.overflow;

  removeDialogs();

  newEl.className = 'insert-custom-dialog';
  document.body.style.overflow = 'hidden';

  const handleClose = (val, data) => {
    callback(val, data);
    newEl.remove();
    document.body.style.overflow = initialBodyOverflow;
  };

  const el = (
    <CustomDialog
      {...rest}
      type={type}
      disablePortal={true}
      open={true}
      handleClose={handleClose}
    />
  );

  ReactDOM.render(el, newEl);

  document.body.appendChild(newEl);
};

export default function CustomPlugin(type, opts) {
  const toolbar = {
    icon: <Star />,
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const inline = Inline.create({
        type: type,
        isVoid: true,
        data: {
          customContent: undefined,
        },
      });

      const change = value.change().insertInline(inline);
      onChange(change);
      insertDialog({
        type,
        opts,
        callback: (val, data) => {
          const nodeIsThere = change.value.document.findDescendant((d) => d.key === inline.key);

          if (nodeIsThere) {
            if (!val) {
              const c = change.removeNodeByKey(inline.key);
              onChange(c, () => opts.focus());
            } else {
              const c = change.setNodeByKey(inline.key, { data });
              onChange(c, () => opts.focus('beginning', nodeIsThere));
            }
          } else {
            opts.focus();
          }
        },
      });
    },
    supports: (node) => node.object === 'inline' && node.type === type,
  };

  return {
    name: type,
    toolbar,
    deleteNode: (e, node, value, onChange) => {
      e.preventDefault();
      const change = value.change().removeNodeByKey(node.key);

      onChange(change);
    },
    renderNode(props) {
      if (props.node.type === type) {
        const { node } = props;
        const { data } = node;
        const jsonData = data.toJSON();
        const { customContent } = jsonData;

        return <span dangerouslySetInnerHTML={{ __html: customContent }} />;
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
    const customPluginData = el.dataset && el.dataset.customPluginData;

    if (!customPluginData) return;

    return {
      object: 'inline',
      type: 'custom-plugin',
      isVoid: true,
      data: { customContent: customPluginData },
    };
  },
  serialize(object /*, children*/) {
    if (object.type !== 'custom-plugin') return;

    const { data } = object;
    const customContent = decodeURIComponent(data.get('customContent'));

    return <span data-custom-plugin-data={customContent} />;
  },
};
