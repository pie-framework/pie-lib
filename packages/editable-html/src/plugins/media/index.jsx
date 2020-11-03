import React from 'react';
import ReactDOM from 'react-dom';
import { Inline } from 'slate';
import TheatersIcon from '@material-ui/icons/Theaters';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import debug from 'debug';

import MediaDialog from './media-dialog';
import MediaToolbar from './media-toolbar';
import MediaWrapper from './media-wrapper';

const log = debug('@pie-lib:editable-html:plugins:image');

const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-media-dialog');

  prevDialogs.forEach(s => s.remove());
};

export const insertDialog = props => {
  const newEl = document.createElement('div');
  const { type, callback, ...rest } = props;

  removeDialogs();

  newEl.className = 'insert-media-dialog';

  const handleClose = (val, data) => {
    callback(val, data);
    newEl.remove();
  };

  const el = (
    <MediaDialog {...rest} type={type} disablePortal={true} open={true} handleClose={handleClose} />
  );

  ReactDOM.render(el, newEl);

  document.body.appendChild(newEl);
};

const types = ['audio', 'video'];

export default function MediaPlugin(type, opts) {
  const toolbar = {
    icon: type === 'audio' ? <VolumeUpIcon /> : <TheatersIcon />,
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const inline = Inline.create({
        type: type,
        isVoid: true,
        data: {
          editing: false,
          ends: undefined,
          height: undefined,
          title: undefined,
          starts: undefined,
          src: undefined,
          url: undefined,
          width: undefined
        }
      });

      const change = value.change().insertInline(inline);
      onChange(change);
      insertDialog({
        type,
        callback: (val, data) => {
          const nodeIsThere = change.value.document.findDescendant(d => d.key === inline.key);

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
        const { node, key } = props;
        const { data } = node;
        const jsonData = data.toJSON();
        const { src, height, width, editing, ...rest } = jsonData;
        const handleEdit = () => {
          const change = opts.createChange();
          const c = change.setNodeByKey(key, {
            data: {
              ...jsonData,
              editing: true
            }
          });

          opts.onChange(c, () => {
            insertDialog({
              ...jsonData,
              edit: true,
              type,
              callback: (val, data) => {
                const { key } = node;

                const nodeIsThere = change.value.document.findDescendant(
                  d => d.type === type && d.data.get('editing')
                );

                if (nodeIsThere && val) {
                  const c = change.setNodeByKey(key, { data, editing: false });
                  opts.onChange(c, () => opts.focus('beginning', nodeIsThere));
                } else {
                  opts.focus();
                }
              }
            });
          });
        };
        const handleDelete = () => {
          const change = opts.createChange();
          const c = change.removeNodeByKey(node.key);

          opts.onChange(c);
        };
        const style = {};

        if (width) {
          style.width = `${width}px`;
        }

        if (height) {
          style.height = `${height}px`;
        }

        return (
          <MediaWrapper editor data-type={type} width={style.width} {...rest}>
            <iframe
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              src={src}
              editing={editing ? 1 : 0}
              {...rest}
              {...style}
            />
            <MediaToolbar onEdit={handleEdit} onRemove={handleDelete} />
          </MediaWrapper>
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

    const { ends, starts, title, editing, url } = el.dataset || {};

    log('deserialize: ', name);
    const width = parseInt(el.getAttribute('width'), 10) || null;
    const height = parseInt(el.getAttribute('height'), 10) || null;

    const out = {
      object: 'inline',
      type: type,
      isVoid: true,
      data: {
        src: el.getAttribute('src'),
        editing,
        ends,
        height,
        starts,
        title,
        width,
        url
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
    const editing = data.get('editing');
    const ends = data.get('ends');
    const src = data.get('src');
    const starts = data.get('starts');
    const title = data.get('title');
    const width = data.get('width');
    const height = data.get('height');
    const url = data.get('url');
    const style = {};

    if (width) {
      style.width = `${width}px`;
    }

    if (height) {
      style.height = `${height}px`;
    }

    const divProps = {
      'data-editing': editing,
      'data-ends': ends,
      'data-starts': starts,
      'data-title': title,
      'data-url': url
    };
    const props = {
      ...style,
      src
    };

    return (
      <iframe
        data-type={type}
        src={src}
        {...divProps}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...props}
      />
    );
  }
};
