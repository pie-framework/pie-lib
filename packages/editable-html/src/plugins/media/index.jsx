import React from 'react';
import ReactDOM from 'react-dom';
import { Inline } from 'slate';
import TheatersIcon from '@material-ui/icons/Theaters';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import debug from 'debug';

import MediaDialog from './media-dialog';

const log = debug('@pie-lib:editable-html:plugins:image');

const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-media-dialog');

  prevDialogs.forEach(s => s.remove());
};

export const insertDialog = ({ type, callback }) => {
  const newEl = document.createElement('div');

  removeDialogs();

  newEl.className = 'insert-media-dialog';

  const handleClose = (val, data) => {
    callback(val, data);
    newEl.remove();
  };

  const el = <MediaDialog type={type} disablePortal={true} open={true} handleClose={handleClose} />;

  ReactDOM.render(el, newEl);

  document.body.appendChild(newEl);
};

const types = ['audio', 'video'];

export default function MediaPlugin(type) {
  const toolbar = {
    icon: type === 'audio' ? <VolumeUpIcon /> : <TheatersIcon />,
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const inline = Inline.create({
        type: type,
        isVoid: true,
        data: {
          ends: undefined,
          height: undefined,
          title: undefined,
          starts: undefined,
          src: undefined,
          width: undefined
        }
      });

      const change = value.change().insertInline(inline);
      onChange(change);
      insertDialog({
        type,
        callback: (val, data) => {
          if (!val) {
            const c = change.removeNodeByKey(inline.key);

            onChange(c);
          } else {
            const c = change.setNodeByKey(inline.key, { data });

            onChange(c);
          }
        }
      });
    },
    supports: node => node.object === 'inline' && node.type === type
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
        const { data } = props.node;
        const jsonData = data.toJSON();

        return (
          <iframe
            data-type={type}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            {...jsonData}
          />
        );
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

        const isMedia = types.indexOf(d.type) >= 0;

        if (isMedia) {
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
    const type = el.dataset && el.dataset.type;
    const typeIndex = types.indexOf(type);

    if (typeIndex < 0) return;

    const { ends, starts, title } = el.dataset || {};

    log('deserialize: ', name);
    const style = el.style || { width: '', height: '' };
    const width = parseInt(style.width.replace('px', ''), 10) || null;
    const height = parseInt(style.height.replace('px', ''), 10) || null;

    const out = {
      object: 'inline',
      type: type,
      isVoid: true,
      data: {
        src: el.getAttribute('src'),
        ends,
        height,
        starts,
        title,
        width
      }
    };
    log('return object: ', out);
    return out;
  },
  serialize(object /*, children*/) {
    const typeIndex = types.indexOf(object.type);

    if (typeIndex < 0) return;

    const type = types[typeIndex];

    const { data } = object;
    const ends = data.get('ends');
    const src = data.get('src');
    const starts = data.get('starts');
    const title = data.get('title');
    const width = data.get('width');
    const height = data.get('height');
    const style = {};

    if (width) {
      style.width = `${width}px`;
    }

    if (height) {
      style.height = `${height}px`;
    }

    style.objectFit = 'contain';

    const props = {
      'data-ends': ends,
      'data-starts': starts,
      'data-title': title,
      src,
      style
    };

    return (
      <iframe
        data-type={type}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...props}
      />
    );
  }
};
