// InlineNodes.js
import React from 'react';
import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import ExplicitConstructedResponse from '../plugins/respArea/explicit-constructed-response';
import DragInTheBlank from '../plugins/respArea/drag-in-the-blank';
import InlineDropdown from '../plugins/respArea/inline-dropdown';

/**
 * ExplicitConstructedResponse Node
 */
export const ExplicitConstructedResponseNode = Node.create({
  name: 'explicit_constructed_response',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      index: { default: null },
      value: { default: '' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-type="explicit_constructed_response"]',
        getAttrs: (el) => ({
          index: el.dataset.index,
          value: el.dataset.value,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        'data-type': 'explicit_constructed_response',
        'data-index': HTMLAttributes.index,
        'data-value': HTMLAttributes.value,
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ExplicitConstructedResponse);
  },
});
