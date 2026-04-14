import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import ImageComponent from './image-component';

export const ImageUploadNode = Node.create({
  name: 'imageUploadNode',

  group: 'block',
  atom: true, // ✅ prevents content holes
  selectable: true, // optional
  draggable: true, // optional

  addAttributes() {
    return {
      loaded: { default: false },
      deleteStatus: { default: null },
      alignment: { default: null },
      percent: { default: null },
      width: { default: null },
      height: { default: null },
      src: { default: null },
      alt: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[data-type="image-upload-node"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload-node' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer((props) => <ImageComponent {...{ ...props, options: this.options }} />);
  },

  addCommands() {
    return {
      setImageUploadNode:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});
