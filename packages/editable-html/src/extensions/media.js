import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { mergeAttributes, Node } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import MediaDialog from '../plugins/media/media-dialog';
import MediaToolbar from '../plugins/media/media-toolbar';

export const Media = Node.create({
  name: 'media',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      type: { default: 'video' },
      src: { default: null },
      width: { default: null },
      height: { default: null },
      title: { default: null },
      starts: { default: null },
      ends: { default: null },
      editing: { default: false },
      tag: { default: 'iframe' }, // 'iframe' or 'audio'
      url: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[data-type="video"]',
        getAttrs: (el) => ({
          type: 'video',
          tag: 'iframe',
          src: el.getAttribute('src'),
          width: el.getAttribute('width'),
          height: el.getAttribute('height'),
          title: el.dataset.title,
          starts: el.dataset.starts,
          ends: el.dataset.ends,
          url: el.dataset.url,
        }),
      },
      {
        tag: 'audio',
        getAttrs: (el) => ({
          type: 'audio',
          tag: 'audio',
          src: el.querySelector('source')?.getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { tag, src, width, height } = HTMLAttributes;

    if (tag === 'audio') {
      return ['audio', { controls: 'controls', controlsList: 'nodownload' }, ['source', { src, type: 'audio/mp3' }]];
    }

    return [
      'iframe',
      mergeAttributes(
        {
          'data-type': 'video',
          frameborder: '0',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowfullscreen: '',
          src,
        },
        width ? { width } : {},
        height ? { height } : {},
      ),
    ];
  },

  addCommands() {
    return {
      insertMedia: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs });
      },
      updateMedia: (attrs) => ({ commands }) => {
        return commands.updateAttributes(this.name, attrs);
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer((props) => <MediaNodeView {...{ ...props, options: this.options }} />);
  },
});

const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-media-dialog');

  prevDialogs.forEach((s) => s.remove());
};

export const insertDialog = (props) => {
  const newEl = document.createElement('div');
  const { type, callback, options, ...rest } = props;
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
      uploadSoundSupport={options.uploadSoundSupport}
      type={type}
      disablePortal={true}
      open={true}
      handleClose={handleClose}
    />
  );

  ReactDOM.render(el, newEl);

  document.body.appendChild(newEl);
};

export default function MediaNodeView({ editor, node, updateAttributes, deleteNode, options }) {
  const { type, src, width, height, tag } = node.attrs;

  const handleEdit = () => {
    insertDialog({
      ...node.attrs,
      edit: true,
      callback: (val, data) => {
        if (val) {
          updateAttributes(data);
        } else {
          deleteNode();
        }

        editor.chain().focus().run();
      },
    });
  };

  useEffect(() => {
    insertDialog({
      ...node.attrs,
      options: options,
      edit: true,
      callback: (val, data) => {
        if (val) {
          updateAttributes(data);
        } else {
          deleteNode();
        }

        editor.chain().focus().run();
      },
    });
  }, []);

  return (
    <NodeViewWrapper data-type={type} style={{ width, height }}>
      {tag === 'audio' ? (
        <audio controls controlsList="nodownload">
          <source src={src} />
        </audio>
      ) : (
        <iframe src={src} allowFullScreen frameBorder="0" />
      )}

      <MediaToolbar onEdit={handleEdit} onRemove={deleteNode} />
    </NodeViewWrapper>
  );
}
