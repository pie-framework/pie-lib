// InlineNodes.js
import React from 'react';
import { Node, ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react";
import ExplicitConstructedResponse from '../plugins/respArea/explicit-constructed-response';
import DragInTheBlank from '../plugins/respArea/drag-in-the-blank';
import InlineDropdown from '../plugins/respArea/inline-dropdown';
import { Extension } from "@tiptap/core";
import { MathToolbar } from "@pie-lib/math-toolbar";
import tippy from "tippy.js";

export const ResponseAreaExtension = Extension.create({
  name: 'responseArea',
  addCommands() {
    return {
      insertResponseArea: (type) => ({ tr, state, dispatch }) => {
        const { schema, selection } = state;
        const position = selection.$from.pos;
        const RESP_MAP = {
          'drag-in-the-blank': 'drag_in_the_blank',
          'explicit-constructed-response': 'explicit_constructed_response',
          'inline-dropdown': 'inline_dropdown',
        };

        const node = schema.nodes[RESP_MAP[type]].create({
          index: '1',
          id: '1',
          value: '',
        });

        if (dispatch) {
          tr.insert(position, node);
          dispatch(tr);
        }

        return true;
      },
    };
  },
});

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
    return ReactNodeViewRenderer((props) => <ExplicitConstructedResponse {...{ ...props, options: this.options }} />);
  },
});

/**
 * MathTemplated Node
 */
export const MathTemplatedNode = Node.create({
  name: 'math_templated',
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
        tag: 'span[data-type="math_templated"]',
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
        'data-type': 'math_templated',
        'data-index': HTMLAttributes.index,
        'data-value': HTMLAttributes.value,
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(() => <div></div>);
  },
});

/**
 * DragInTheBlank Node
 */
export const DragInTheBlankNode = Node.create({
  name: 'drag_in_the_blank',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      index: { default: null },
      id: { default: null },
      value: { default: '' },
      inTable: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-type="drag_in_the_blank"]',
        getAttrs: (el) => ({
          index: el.dataset.index,
          id: el.dataset.id,
          value: el.dataset.value,
          inTable: el.dataset.inTable,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        'data-type': 'drag_in_the_blank',
        'data-index': HTMLAttributes.index,
        'data-id': HTMLAttributes.id,
        'data-value': HTMLAttributes.value,
        'data-in-table': HTMLAttributes.inTable,
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer((props) => <DragInTheBlank {...{ ...props, options: this.options }} />);
  },
});

/**
 * InlineDropdown Node
 */
export const InlineDropdownNode = Node.create({
  name: 'inline_dropdown',
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
        tag: 'span[data-type="inline_dropdown"]',
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
        'data-type': 'inline_dropdown',
        'data-index': HTMLAttributes.index,
        'data-value': HTMLAttributes.value,
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer((props) => <InlineDropdown {...{ ...props, options: this.options }} />);
  },
});
