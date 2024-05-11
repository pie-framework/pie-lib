import React from 'react';
import ReactDOM from 'react-dom';
import { Node as SlateNode, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import TheatersIcon from '@material-ui/icons/Theaters';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import omit from 'lodash/omit';

import debug from 'debug';
import MediaDialog from './media-dialog';
import MediaToolbar from './media-toolbar';
import MediaWrapper from './media-wrapper';

const log = debug('@pie-lib:editable-html:plugins:image');

const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-media-dialog');

  prevDialogs.forEach((s) => s.remove());
};

export const insertDialog = (props) => {
  const newEl = document.createElement('div');
  const { type, callback, opts, ...rest } = props;
  const initialBodyOverflow = document.body.style.overflow;

  removeDialogs();

  newEl.className = 'insert-media-dialog';
  document.body.style.overflow = 'hidden';

  const handleClose = (val, data) => {
    callback(val, data);
    newEl.remove();
    document.body.style.overflow = initialBodyOverflow;
  };

  const el = (
    <MediaDialog
      {...rest}
      uploadSoundSupport={opts.uploadSoundSupport}
      type={type}
      disablePortal={true}
      open={true}
      handleClose={handleClose}
    />
  );

  ReactDOM.render(el, newEl);

  document.body.appendChild(newEl);
};

const getNodeBy = (editor, callback) => {
  const descendants = SlateNode.descendants(editor, {
    reverse: true,
  });

  for (const [descendant, descendantPath] of descendants) {
    if (callback(descendant, descendantPath)) {
      return [descendant, descendantPath];
    }
  }
};

const moveFocusAfterMedia = (editor, node) => {
  if (!editor || !node) {
    return;
  }

  setTimeout(() => {
    ReactEditor.focus(editor);
    Transforms.move(editor, { distance: 1, unit: 'offset' });
  }, 0);
};

const types = ['audio', 'video'];

export default function MediaPlugin(type, opts) {
  const toolbar = {
    icon: type === 'audio' ? <VolumeUpIcon /> : <TheatersIcon />,
    onClick: (editor) => {
      log('[toolbar] onClick');
      const inline = {
        type: type,
        isVoid: true,
        data: {
          newMedia: true,
          editing: false,
          ends: undefined,
          height: undefined,
          title: undefined,
          starts: undefined,
          src: undefined,
          url: undefined,
          width: undefined,
        },
        children: [{ text: '' }],
      };

      editor.insertNode(inline);

      insertDialog({
        type,
        opts,
        callback: (val, data) => {
          const nodePath = ReactEditor.findPath(editor, inline);

          if (inline) {
            if (!val) {
              editor.apply({
                type: 'remove_node',
                path: nodePath,
              });
            } else {
              editor.apply({
                type: 'set_node',
                path: nodePath,
                properties: {
                  data: inline.data,
                },
                newProperties: {
                  data: {
                    ...data,
                    newMedia: false,
                  },
                },
              });
            }
          }

          moveFocusAfterMedia(editor, inline);
        },
      });
    },
  };

  return {
    name: type,
    toolbar,
    rules: (editor) => {
      const { isVoid, isInline } = editor;

      editor.isVoid = (element) => {
        return ['audio', 'video'].includes(element.type) ? true : isVoid(element);
      };

      editor.isInline = (element) => {
        return ['audio', 'video'].includes(element.type) ? true : isInline(element);
      };

      return editor;
    },
    supports: (node) => node.type === type,
    renderNode(props) {
      if (props.node.type === type) {
        const { node, editor } = props;
        const { data } = node;
        const { src, height, width, editing, tag, ...rest } = omit(data, ['newMedia', 'urlToUse']);
        const attributes = { ...rest, ...props.attributes };
        const handleEdit = (event) => {
          const nodeToEdit = ReactEditor.toSlateNode(editor, event.target);
          const nodePath = ReactEditor.findPath(editor, nodeToEdit);

          editor.apply({
            type: 'set_node',
            path: nodePath,
            properties: {
              data: node.data,
            },
            newProperties: {
              data: {
                ...data,
                editing: true,
              },
            },
          });

          insertDialog({
            ...data,
            edit: true,
            type,
            opts,
            callback: (val, data) => {
              const nodePath = ReactEditor.findPath(editor, nodeToEdit);

              if (nodePath && val) {
                editor.apply({
                  type: 'set_node',
                  path: nodePath,
                  properties: {
                    data: node.data,
                  },
                  newProperties: {
                    data: {
                      ...data,
                      editing: true,
                    },
                  },
                });
              }
            },
          });
        };
        const handleDelete = (event) => {
          const nodeToEdit = ReactEditor.toSlateNode(editor, event.target);
          const nodePath = ReactEditor.findPath(editor, nodeToEdit);

          editor.apply({
            type: 'remove_node',
            path: nodePath,
          });
        };
        const computedProps = {};

        if (width) {
          computedProps.width = `${width}px`;
        }

        if (height) {
          computedProps.height = `${height}px`;
        }

        computedProps.editing = editing ? 1 : 0;

        if (tag === 'audio') {
          return (
            <MediaWrapper data-type={type} width={computedProps.width} attributes={attributes}>
              <audio controls="controls">
                <source type="audio/mp3" src={src} />
              </audio>
              <MediaToolbar hideEdit onRemove={handleDelete} />
              {props.children}
            </MediaWrapper>
          );
        }

        return (
          <MediaWrapper data-type={type} width={computedProps.width} attributes={attributes}>
            <div contentEditable={false}>
              <iframe
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                src={src}
                {...rest}
                {...computedProps}
              />
              <MediaToolbar onEdit={handleEdit} onRemove={handleDelete} />
            </div>
            {props.children}
          </MediaWrapper>
        );
      }
    },
  };
}

export const serialization = {
  deserialize(el /*, next*/) {
    let type = el.dataset && el.dataset.type;
    let tag = 'iframe';
    let src;
    const typeIndex = types.indexOf(type);

    if (typeIndex < 0) {
      if (el instanceof Element && el.tagName.toLowerCase() === 'audio') {
        type = 'audio';
        tag = 'audio';
        src = el.firstChild?.getAttribute('src');
      } else {
        return;
      }
    }

    const { ends, starts, title, editing, url } = el.dataset || {};

    log('deserialize: ', name);
    const width = parseInt(el.getAttribute('width'), 10) || null;
    const height = parseInt(el.getAttribute('height'), 10) || null;

    const out = jsx('element', {
      type,
      data: {
        tag,
        src: src || el.getAttribute('src'),
        editing,
        ends,
        height,
        starts,
        title,
        width,
        url,
      },
    });

    log('return object: ', out);
    return out;
  },
  serialize(object) {
    const typeIndex = types.indexOf(object.type);

    if (typeIndex < 0) {
      return;
    }

    const type = types[typeIndex];

    const { editing, tag, ends, src, starts, title, width, height, url } = object.data || {};
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
      'data-url': url,
    };
    const props = {
      ...style,
      src,
    };

    if (tag === 'audio') {
      return (
        <audio controls="controls">
          <source type="audio/mp3" src={src} />
        </audio>
      );
    }

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
  },
};
