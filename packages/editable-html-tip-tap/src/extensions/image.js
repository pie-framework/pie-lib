import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin } from '@tiptap/pm/state';
import React from 'react';
import ImageComponent from './image-component';
import { node } from 'prop-types';

export const ImageUploadNode = Node.create({
  name: 'imageUploadNode',

  group: 'block',
  atom: true, // ✅ prevents content holes
  selectable: true, // optional
  draggable: true, // optional

  addAttributes() {
    return {
      nodeKey: { default: null },
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
              // adding a unique nodeKey attribute to help identify this node instance later due to issues with multiple images
              attrs: { nodeKey: `img-${Date.now()}-${Math.random().toString(36).slice(2)}` },
          });
        },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            const items = Array.from(event.clipboardData?.items || []);

            const imageItem = items.find((item) => item.kind === 'file' && item.type.startsWith('image/'));

            if (!imageItem) {
              return false;
            }

            const file = imageItem.getAsFile();

            if (!file) {
              return false;
            }

            // Example 1: insert as base64 immediately
            const reader = new FileReader();

            reader.onload = () => {
              const src = reader.result;

              if (typeof src !== 'string') {
                return;
              }

              editor.commands.insertContent({
                type: 'imageUploadNode',
                attrs: {
                  src,
                  loaded: true,
                  nodeKey: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                },
              });
            };

            reader.readAsDataURL(file);

            return true;
          },
        },
      }),
    ];
  },
});
