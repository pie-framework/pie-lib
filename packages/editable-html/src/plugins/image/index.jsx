import { Block, Data } from 'slate';

import Image from 'material-ui-icons/Image';
import ImageComponent from './component';
import ImageToolbar from './image-toolbar';
import InsertImageHandler from './insert-image-handler';
import React from 'react';
import debug from 'debug';

const log = debug('editable-html:plugins:image');

export default function ImagePlugin(opts) {

  const toolbar = opts.insertImageRequested && {
    icon: <Image />,
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const block = Block.create({
        type: 'image',
        isVoid: true,
        data: {
          loaded: false,
          src: undefined
        }
      });

      const change = value.change().insertBlock(block);
      onChange(change);
      opts.insertImageRequested((getValue) => new InsertImageHandler(block, getValue, onChange));

    },
    supports: node => (node.kind === 'block' && node.type === 'image'),
    customToolbar: node => ImageToolbar
  }

  return {
    toolbar,
    deleteNode: (e, node, value, onChange) => {
      e.preventDefault();
      if (opts.onDelete) {
        const update = node.data.merge(Data.create({ deleteStatus: 'pending' }));

        let change = value
          .change()
          .setNodeByKey(node.key, { data: update });

        onChange(change);
        opts.onDelete(node.data.get('src'), (err, v) => {
          if (!err) {
            change = v.change().removeNodeByKey(node.key);
          } else {
            log('[error]: ', err);
            change = v.change().setNodeByKey(node.key, node.data.merge(Data.create({ deleteStatus: 'failed' })));
          }
          onChange(change);
        });

      } else {
        let change = value.change().removeNodeByKey(node.key);
        onChange(change);
      }
    },
    stopReset: (value) => {
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
        const all = Object.assign({
          onDelete: opts.onDelete,
          onFocus: opts.onFocus,
          onBlur: opts.onBlur
        }, props);
        return <ImageComponent {...all} />
      }
    }
  }
}

export const serialization = {


  deserialize(el, next) {
    const name = el.tagName.toLowerCase();
    if (name !== 'img') return;

    log('deserialize: ', name);
    const style = el.style || { width: '', height: '' };
    const width = parseInt(style.width.replace('px', ''), 10) || null;
    const height = parseInt(style.height.replace('px', ''), 10) || null;

    const out = {
      kind: 'block',
      type: 'image',
      isVoid: true,
      nodes: [],
      data: {
        src: el.getAttribute('src'),
        width, height
      }
    }
    log('return object: ', out);
    return out;
  },
  serialize(object, children) {
    if (object.type !== 'image') return;

    const { data } = object;
    const src = data.get('src');
    const width = data.get('width');
    const height = data.get('height');
    const style = {};
    if (width) {
      style.width = `${width}px`;
    }

    if (height) {
      style.height = `${height}px`;
    }

    const props = {
      src,
      style
    }

    return <img {...props}></img>;
  }
};