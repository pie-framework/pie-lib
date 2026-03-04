import React from 'react';
import { NodeSelection, Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import ExplicitConstructedResponse from '../components/respArea/ExplicitConstructedResponse';
import DragInTheBlank from '../components/respArea/DragInTheBlank/DragInTheBlank';
import InlineDropdown from '../components/respArea/InlineDropdown';
import MathTemplated from '../components/respArea/MathTemplated';

const lastIndexMap = {};

const normalizeType = (type) => String(type || '').replace(/-/g, '_');

const getAttrIndex = (node) => (node && node.attrs && node.attrs.index != null ? String(node.attrs.index) : null);

const collectNodesOfType = (doc, typeName) => {
  const results = [];

  doc.descendants((node, pos) => {
    if (node.type && node.type.name === typeName) {
      const index = getAttrIndex(node);
      if (index != null) results.push({ index, pos, node });
    }
    return true;
  });

  return results;
};

const countNodesOfType = (doc, typeName) => {
  let count = 0;
  doc.descendants((node) => {
    if (node.type && node.type.name === typeName) count += 1;
    return true;
  });
  return count;
};

const getDefaultNode = ({ schema, typeName, index }) => {
  const nodeType = schema.nodes[typeName];
  if (!nodeType) return null;

  // mirror your Slate "getDefaultElement(opts, newIndex)"
  // customize attrs as needed:
  return nodeType.create({
    index: String(index),
    id: String(index),
    value: '',
  });
};

// Find a good cursor position *after* an inserted node.
const selectionAfterPos = (doc, pos) => {
  const $pos = doc.resolve(Math.min(pos, doc.content.size));
  return TextSelection.near($pos, 1);
};

export const ResponseAreaExtension = Extension.create({
  name: 'responseArea',

  addOptions() {
    return {
      maxResponseAreas: null,
      error: null,
      options: null,
      respAreaToolbar: null,
      onHandleAreaChange: null,
    };
  },

  addProseMirrorPlugins() {
    if (!this.options.type) {
      return [];
    }

    const typeName = normalizeType(this.options.type);
    const key = new PluginKey(`response-area-watcher:${typeName}`);

    return [
      new Plugin({
        key,

        view: (view) => {
          // Lazy init lastIndexMap[typeName]
          if (lastIndexMap[typeName] === undefined) {
            lastIndexMap[typeName] = 0;

            view.state.doc.descendants((node) => {
              if (node.type && node.type.name === typeName) {
                const idx = getAttrIndex(node);
                if (idx != null) {
                  const n = parseInt(idx, 10);
                  if (!Number.isNaN(n) && n > lastIndexMap[typeName]) {
                    lastIndexMap[typeName] = n;
                  }
                }
              }
              return true;
            });
          }

          return {
            update: (view, prevState) => {
              const state = view.state;
              if (prevState.doc.eq(state.doc)) return;

              const currentList = collectNodesOfType(state.doc, typeName);
              const oldList = collectNodesOfType(prevState.doc, typeName);

              if (this.options.toolbar) {
                this.options.toolbar.disabled = currentList.length >= this.options.maxResponseAreas;
              }

              // Removed elements (same logic as Slate)
              if (oldList.length > currentList.length) {
                const currentIndexSet = new Set(currentList.map((x) => x.index));

                const removed = oldList.filter((x) => !currentIndexSet.has(x.index));

                if (removed.length && typeof this.options.onHandleAreaChange === 'function') {
                  this.options.onHandleAreaChange(removed);
                }
              }
            },
          };
        },
      }),
    ];
  },

  addCommands() {
    return {
      insertResponseArea:
        (type) =>
        ({ tr, state, dispatch, commands }) => {
          const typeName = normalizeType(type);

          // --- Slate: currentRespAreaList + max check ---
          const currentCount = countNodesOfType(state.doc, typeName);
          if (currentCount >= this.options.maxResponseAreas) {
            return false;
          }

          // --- Slate: indexing logic (kept identical) ---
          if (lastIndexMap[typeName] === undefined) lastIndexMap[typeName] = 0;

          const prevIndex = lastIndexMap[typeName];
          const newIndex = prevIndex === 0 ? prevIndex : prevIndex + 1;

          // Slate increments map even if newIndex === 0
          lastIndexMap[typeName] += 1;

          const newInline = getDefaultNode({
            schema: state.schema,
            typeName,
            index: newIndex,
          });

          if (!newInline) return false;

          // --- Insert logic ---
          const { selection } = state;
          let insertPos = selection.from;

          // If we're in a NodeSelection, insert before/after is ambiguous;
          // We'll insert at its "from" (like your current code).
          // If insertion fails, we fallback to end of doc.
          const tryInsertAt = (pos) => {
            try {
              tr.insert(pos, newInline);
              return pos;
            } catch (e) {
              return null;
            }
          };

          let usedPos = tryInsertAt(insertPos);

          // Slate branch: "markup empty and there's no focus"
          // ProseMirror doesn't expose "no focus" the same way, so the closest
          // equivalent fallback is inserting at end of document.
          if (usedPos == null) {
            usedPos = tryInsertAt(tr.doc.content.size);
          }
          if (usedPos == null) return false;

          // Optionally select the node you just inserted (like your original command)
          // tr.setSelection(NodeSelection.create(tr.doc, usedPos))

          // --- Cursor move behavior for certain types (Slate: moveFocusTo next text) ---
          if (['math_templated', 'inline_dropdown', 'explicit_constructed_response'].includes(typeName)) {
            tr.setSelection(NodeSelection.create(tr.doc, usedPos));
          } else {
            const after = usedPos + newInline.nodeSize;
            tr.setSelection(selectionAfterPos(tr.doc, after));
          }

          if (dispatch) {
            commands.focus();
            dispatch(tr);
          }

          return true;
        },
      refreshResponseArea:
        () =>
        ({ tr, state, commands, dispatch }) => {
          const { selection } = state;
          const node = selection.$from.nodeAfter;
          const nodePos = selection.from;

          tr.setNodeMarkup(nodePos, undefined, { ...node.attrs, updated: `${Date.now()}` });
          tr.setSelection(NodeSelection.create(tr.doc, nodePos));

          if (dispatch) {
            commands.focus();
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
      updated: { default: '' },
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
      updated: { default: '' },
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
    return ReactNodeViewRenderer((props) => <MathTemplated {...{ ...props, options: this.options }} />);
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
      updated: { default: '' },
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
      updated: { default: '' },
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
