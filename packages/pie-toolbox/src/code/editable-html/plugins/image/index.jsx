import React from 'react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { jsx } from 'slate-hyperscript';
import debug from 'debug';
import { Editor, Transforms } from 'slate';

import Image from '@material-ui/icons/Image';
import ImageComponent from './component';
import ImageToolbar from './image-toolbar';
import InsertImageHandler from './insert-image-handler';
import { ReactEditor } from 'slate-react';

const log = debug('@pie-lib:editable-html:plugins:image');

export default function ImagePlugin(opts) {
  const toolbar = opts.insertImageRequested && {
    icon: <Image />,
    onClick: (editor) => {
      log('[toolbar] onClick');
      const inline = {
        type: 'image',
        data: {
          newImage: true,
          loaded: false,
          src: undefined,
        },
        children: [{ text: '' }],
      };

      editor.insertNode(inline);

      // get the element just inserted, needed because it focuses on the empty leaf inside
      const [node, nodePath] = Editor.parent(editor, editor.selection);

      opts.insertImageRequested(node, (onFinish) => new InsertImageHandler(node, nodePath, onFinish, editor));
    },
    customToolbar: (node, nodePath, editor, onToolbarDone) => {
      const alignment = node.data.alignment;
      const alt = node.data.alt;
      const imageLoaded = node.data.loaded !== false;
      const onChange = (newValues) => {
        const update = {
          ...node.data,
          ...newValues,
        };

        editor.apply({
          type: 'set_node',
          path: nodePath,
          properties: {
            data: node.data,
          },
          newProperties: { data: update },
        });

        onToolbarDone(null, false);
      };

      const Tb = () => (
        <ImageToolbar
          disableImageAlignmentButtons={opts.disableImageAlignmentButtons}
          alt={alt}
          imageLoaded={imageLoaded}
          alignment={alignment || 'left'}
          onChange={onChange}
        />
      );
      return Tb;
    },
    showDone: true,
  };

  return {
    name: 'image',
    toolbar,
    rules: (editor) => {
      const { insertData, isVoid, isInline } = editor;

      editor.isVoid = (element) => {
        return element.type === 'image' ? true : isVoid(element);
      };

      editor.isInline = (element) => {
        return element.type === 'image' ? true : isInline(element);
      };

      const isImageUrl = (url) => {
        if (!url || !isUrl(url)) {
          return false;
        }

        const ext = new URL(url).pathname.split('.').pop();

        return imageExtensions.includes(ext);
      };

      const insertImage = (editor, fileProvided) => {
        const image = {
          type: 'image',
          data: {
            loaded: false,
            src: '',
          },
          children: [{ text: '' }],
        };

        editor.insertNode(image);

        // get the element just inserted, needed because it focuses on the empty leaf inside
        const [node, nodePath] = Editor.parent(editor, editor.selection);

        opts.insertImageRequested(
          node,
          (onFinish) => new InsertImageHandler(node, nodePath, onFinish, editor, true),
          fileProvided,
        );
      };

      editor.insertData = (data) => {
        const text = data.getData('text/plain');
        const { files } = data;

        if (files && files.length > 0) {
          for (const file of files) {
            insertImage(editor, file);
          }
        } else if (isImageUrl(text)) {
          insertImage(editor, text);
        } else if (!editor.respAreaDrag) {
          insertData(data);
        }
      };

      return editor;
    },
    supports: (node) => node.type === 'image',
    deleteNode: (e, node, nodePath, editor, onChange) => {
      e.preventDefault();

      if (opts.onDelete) {
        const update = {
          ...node.data,
          deleteStatus: 'pending',
        };

        editor.apply({
          type: 'set_node',
          path: nodePath,
          properties: {
            data: node.data,
          },
          newProperties: { data: update },
        });

        editor.selection = null;
        onChange(editor);
        opts.onDelete(node.data.src, (err) => {
          if (!err) {
            editor.apply({
              type: 'remove_node',
              path: nodePath,
            });
          } else {
            log('[error]: ', err);
            editor.apply({
              type: 'set_node',
              path: nodePath,
              properties: {
                data: node.data,
              },
              newProperties: { data: { ...node.data, deleteStatus: 'failed' } },
            });
          }

          editor.selection = null;
          onChange(editor, () => {
            setTimeout(() => ReactEditor.focus(editor), 50);
          });
        });
      } else {
        editor.selection = null;
        editor.apply({
          type: 'remove_node',
          path: nodePath,
        });
        onChange(editor, () => {
          setTimeout(() => ReactEditor.focus(editor), 50);
        });
      }
    },
    stopReset: (value) => {
      const imgPendingInsertion = value.document.findDescendant((n) => {
        if (n.type !== 'image') {
          return;
        }
        return n.data.loaded === false;
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
            maxImageHeight: opts.maxImageHeight,
          },
          props,
        );
        return (
          <ImageComponent {...all} contentEditable={false}>
            {props.children}
          </ImageComponent>
        );
      }
    },
    normalizeNode: (node) => {
      const textNodeMap = {};
      const updateNodesArray = [];
      let index = 0;

      if (node.object !== 'document') return;

      node.findDescendant((d) => {
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

      return (change) => {
        change.withoutNormalization(() => {
          updateNodesArray.forEach((n) => change.insertTextByKey(n.key, 0, ' '));
        });
      };
    },
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

    const out = jsx('element', {
      type: 'image',
      data: {
        src: el.getAttribute('src'),
        width,
        height,
        margin: el.style.margin,
        justifyContent: el.style.justifyContent,
        alignment: el.getAttribute('alignment'),
        alt: el.getAttribute('alt'),
      },
    });
    log('return object: ', out);
    return out;
  },
  serialize(object /*, children*/) {
    if (object.type !== 'image') return;

    const { data } = object;
    const { alignment, alt, src, height, margin, justifyContent, width } = data;
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
          style.margin = 'auto 0 0 auto';
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
      alignment,
      alt,
    };

    return <img {...props} />;
  },
};
