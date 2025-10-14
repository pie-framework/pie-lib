import React, { useState } from 'react';
import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactRenderer, ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath, mmlToLatex, renderMath } from '@pie-lib/math-rendering';
import tippy from 'tippy.js';

export const MathNode = Node.create({
  name: 'math',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      latex: { default: '' },
      wrapper: { default: null },
      html: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-latex]',
        getAttrs: (el) => ({
          latex: el.getAttribute('data-raw') || el.textContent,
        }),
      },
      {
        tag: 'span[data-type="mathml"]',
        getAttrs: (el) => ({
          html: el.innerHTML,
        }),
      },
    ];
  },

  addCommands() {
    return {
      insertMath: (latex = '') => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { latex },
        });
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    if (HTMLAttributes.html) {
      return ['span', { 'data-type': 'mathml', dangerouslySetInnerHTML: { __html: HTMLAttributes.html } }];
    }

    return [
      'span',
      { 'data-latex': '', 'data-raw': HTMLAttributes.latex },
      wrapMath(HTMLAttributes.latex, HTMLAttributes.wrapper),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView);
  },
});

export const MathNodeView = (props) => {
  const { node, updateAttributes, editor, selected, getPos } = props;
  const [showToolbar, setShowToolbar] = useState(false);

  const latex = node.attrs.latex || '';

  const handleChange = (newLatex) => {
    updateAttributes({ latex: newLatex });
  };

  const handleDone = (newLatex) => {
    updateAttributes({ latex: newLatex });
    setShowToolbar(false);
    editor.commands.focus();
  };

  return (
    <NodeViewWrapper className="math-node inline-flex items-center" data-selected={selected}>
      <div onClick={() => setShowToolbar(true)} contentEditable={false}>
        <MathPreview latex={latex} />
      </div>

      {showToolbar && (
        <div className="absolute z-50 bg-white shadow-lg rounded p-2">
          <MathToolbar latex={latex} onChange={handleChange} onDone={handleDone} keypadMode="basic" />
        </div>
      )}
    </NodeViewWrapper>
  );
};

export const MathToolbarExtension = Extension.create({
  name: 'mathToolbar',

  addStorage() {
    return {
      renderer: null,
      popup: null,
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: new PluginKey('math-toolbar-plugin'),
        props: {},
        view: () => ({
          update: (view, prevState) => {
            const { from, to } = view.state.selection;
            const node = view.state.doc.nodeAt(from);

            // Check if selection is on a math node
            const isMathActive = node?.type?.name === 'math';

            if (!isMathActive) {
              this.storage.popup?.destroy?.();
              this.storage.popup = null;
              return;
            }

            // Create toolbar renderer if needed
            if (!this.storage.renderer) {
              const latex = node.attrs.latex || '';
              this.storage.renderer = new ReactRenderer(MathToolbar, {
                editor: extension.editor,
                props: {
                  node,
                  latex,
                  onDone: (latex) => {
                    this.editor.chain().focus().updateAttributes('math', { latex }).run();
                  },
                },
              });
            }

            // Create popup if needed
            if (!this.storage.popup) {
              const dom = view.nodeDOM(from);
              this.storage.popup = tippy('body', {
                getReferenceClientRect: () => dom.getBoundingClientRect(),
                appendTo: () => document.body,
                content: this.storage.renderer.element,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })[0];

              this.storage.popup.show();
            }
          },
          destroy: () => {
            this.storage.popup?.destroy?.();
            this.storage.renderer?.destroy?.();
          },
        }),
      }),
    ];
  },
});

