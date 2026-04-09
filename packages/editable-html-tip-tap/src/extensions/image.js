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
        tag: 'div[data-type="image-upload-node"]',
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
          ({ editor }) => {
            const { insertImageRequested } = this.options?.imageHandling || {};
            if (!insertImageRequested) return false;

            insertImageRequested(null, (onFinish) => {
              return {
                fileChosen: (file) => {
                  if (!file) {
                    onFinish(false);
                    return;
                  }

                  // only insert after file is chosen
                  editor
                    .chain()
                    .focus()
                    .insertContent({
                      type: this.name,
                      attrs: {
                        src: URL.createObjectURL(file), // or leave null if upload handles it
                      },
                    })
                    .run();

                  onFinish(true);
                },

                cancel: () => {
                  onFinish(false);
                },
              };
            });

            return true;
          },
    };
  },
});
