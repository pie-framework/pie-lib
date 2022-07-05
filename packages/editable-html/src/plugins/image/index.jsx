import { Data, Inline } from 'slate';

import Image from '@material-ui/icons/Image';
import ImageComponent from './component';
import ImageToolbar from './image-toolbar';
import InsertImageHandler from './insert-image-handler';
import React from 'react';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:image');

export default function ImagePlugin(opts) {
  const toolbar = opts.insertImageRequested && {
    icon: <Image />,
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const inline = Inline.create({
        type: 'image',
        isVoid: true,
        data: {
          loaded: false,
          src: undefined
        }
      });

      const change = value.change().insertInline(inline);
      onChange(change);
      opts.insertImageRequested(getValue => new InsertImageHandler(inline, getValue, onChange));
    },
    supports: node => node.object === 'inline' && node.type === 'image',
    customToolbar: (node, value, onToolbarDone) => {
      const alignment = node.data.get('alignment');
      const onChange = alignment => {
        const update = {
          ...node.data.toObject(),
          alignment
        };

        const change = value.change().setNodeByKey(node.key, { data: update });
        onToolbarDone(change, false);
      };

      const Tb = () => <ImageToolbar alignment={alignment || 'left'} onChange={onChange} />;
      return Tb;
    },
    showDone: true
  };

  return {
    name: 'image',
    toolbar,
    deleteNode: (e, node, value, onChange) => {
      e.preventDefault();
      if (opts.onDelete) {
        const update = node.data.merge(Data.create({ deleteStatus: 'pending' }));

        let change = value.change().setNodeByKey(node.key, { data: update });

        onChange(change);
        opts.onDelete(node.data.get('src'), (err, v) => {
          if (!err) {
            change = v.change().removeNodeByKey(node.key);
          } else {
            log('[error]: ', err);
            change = v
              .change()
              .setNodeByKey(node.key, node.data.merge(Data.create({ deleteStatus: 'failed' })));
          }
          onChange(change);
        });
      } else {
        let change = value.change().removeNodeByKey(node.key);
        onChange(change);
      }
    },
    stopReset: value => {
      const imgPendingInsertion = value.document.findDescendant(n => {
        if (n.type !== 'image') {
          return;
        }
        return n.data.get('loaded') === false;
      });
      /** don't reset if there is an image pending insertion */
      return imgPendingInsertion !== undefined && imgPendingInsertion !== null;
    },
    renderNode(props) {
      if (props.node.type === 'image') {
        const all = Object.assign(
          {
            onDelete: opts.onDelete,
            onFocus: opts.onFocus,
            onBlur: opts.onBlur,
            maxImageWidth: opts.maxImageWidth,
            maxImageHeight: opts.maxImageHeight
          },
          props
        );
        return <ImageComponent {...all} />;
      }
    },
    normalizeNode: node => {
      const textNodeMap = {};
      const updateNodesArray = [];
      let index = 0;

      if (node.object !== 'document') return;

      node.findDescendant(d => {
        if (d.object === 'text') {
          textNodeMap[index] = d;
        }

        if (d.type === 'image') {
          if (index > 0 && textNodeMap[index - 1] && textNodeMap[index - 1].text === '') {
            updateNodesArray.push(textNodeMap[index - 1]);
          }
        }

        index++;
      });

      if (!updateNodesArray.length) return;

      return change => {
        change.withoutNormalization(() => {
          updateNodesArray.forEach(n => change.insertTextByKey(n.key, 0, ' '));
        });
      };
    }
  };
}

export const serialization = {
  deserialize(el /*, next*/) {
    const name = el.tagName.toLowerCase();
    if (name !== 'img') return;

    log('deserialize: ', name);
    const style = el.style || { width: '', height: '', margin: '', justifyContent: '' };
    const width = parseInt(style.width.replace('px', ''), 10) || null;
    const height = parseInt(style.height.replace('px', ''), 10) || null;

    const out = {
      object: 'inline',
      type: 'image',
      isVoid: true,
      data: {
        src: el.getAttribute('src'),
        width,
        height,
        margin: el.style.margin,
        justifyContent: el.style.justifyContent,
        alignment: el.getAttribute('alignment')
      }
    };
    log('return object: ', out);
    return out;
  },
  serialize(object /*, children*/) {
    if (object.type !== 'image') return;

    const { data } = object;
    const src = data.get('src');
    const width = data.get('width');
    const height = data.get('height');
    const alignment = data.get('alignment');
    const margin = data.get('margin');
    const justifyContent = data.get('margin');
    const style = {};
    if (width) {
      style.width = `${width}px`;
    }

    if (height) {
      style.height = `${height}px`;
    }

    style.margin = margin;
    style.justifyContent = justifyContent;

    if (alignment) {
      switch (alignment) {
        case 'left':
          style.justifyContent = 'flex-start';
          style.margin = '0';
          break;
        case 'center':
          style.justifyContent = 'center';
          style.margin = '0 auto';
          break;
        case 'right':
          style.justifyContent = 'flex-end';
          style.margin = 'auto 0 0 auto ';
          break;
        default:
          style.justifyContent = 'flex-start';
          break;
      }
    }

    style.objectFit = 'contain';

    const props = {
      src,
      style,
      alignment
    };

    return <img {...props} />;
  }
};
