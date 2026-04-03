import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Node } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { NodeSelection, Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath } from '@pie-lib/math-rendering';

const ensureTextAfterMathPluginKey = new PluginKey('ensureTextAfterMath');

const generateAdditionalKeys = (keyData = []) => {
  return keyData.map((key) => ({
    name: key,
    latex: key,
    write: key,
    label: key,
  }));
};

export const EnsureTextAfterMathPlugin = (mathNodeName) =>
  new Plugin({
    key: ensureTextAfterMathPluginKey,
    appendTransaction: (transactions, oldState, newState) => {
      // Only act when the doc actually changed
      if (!transactions.some((tr) => tr.docChanged)) return null;

      const tr = newState.tr;
      let changed = false;

      newState.doc.descendants((node, pos) => {
        if (node.type.name === mathNodeName) {
          const nextPos = pos + node.nodeSize;
          const nextNode = newState.doc.nodeAt(nextPos);

          // If there's no node after, or the next node isn't text, insert a space
          if (!nextNode || nextNode.type.name !== 'text') {
            tr.insert(nextPos, newState.schema.text('\u200b'));
            changed = true;
          }
        }
      });

      return changed ? tr : null;
    },
  });

export const ZeroWidthSpaceHandlingPlugin = new Plugin({
  key: new PluginKey('zeroWidthSpaceHandling'),
  props: {
    handleKeyDown(view, event) {
      const { state, dispatch } = view;
      const { selection, doc } = state;
      const { from, empty } = selection;

      if (empty && event.key === 'Backspace' && from > 0) {
        const prevChar = doc.textBetween(from - 1, from, '\uFFFC', '\uFFFC');
        if (prevChar === '\u200b') {
          const tr = state.tr.delete(from - 2, from);
          dispatch(tr);
          return true; // handled
        }
      }

      if (empty && event.key === 'ArrowLeft' && from > 0) {
        const prevChar = doc.textBetween(from - 1, from, '\uFFFC', '\uFFFC');
        // If the previous character is the zero-width space...
        if (prevChar === '\u200b') {
          const posBefore = from - 1;
          const resolved = state.doc.resolve(posBefore - 1); // look just before the zwsp
          const maybeNode = resolved.nodeAfter || resolved.nodeBefore;

          // Check if there's an inline selectable node (e.g., your math node)
          if (maybeNode) {
            const nodePos = posBefore - maybeNode.nodeSize;
            const nodeResolved = state.doc.resolve(nodePos);
            const tr = state.tr.setSelection(NodeSelection.create(state.doc, nodeResolved.pos));
            dispatch(tr);
            return true;
          } else {
            // Just move the text cursor before the zwsp
            const tr = state.tr.setSelection(TextSelection.create(state.doc, from - 2));
            dispatch(tr);
            return true;
          }
        }
      }

      return false;
    },
  },
});

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

  addProseMirrorPlugins() {
    return [EnsureTextAfterMathPlugin(this.name), ZeroWidthSpaceHandlingPlugin];
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
      insertMath:
        (latex = '') =>
        ({ tr, editor, dispatch }) => {
          const { state } = editor.view;
          const node = state.schema.nodes.math.create({
            latex,
          });
          const { selection } = state;

          // The inserted node is typically just before the cursor
          const pos = selection.$from.pos;

          tr.insert(pos, node);

          if (node?.type?.name === this.name) {
            // Create a NodeSelection from the current doc
            const sel = NodeSelection.create(tr.doc, selection.$from.pos);

            // Build a fresh transaction from the current state and set the selection
            tr.setSelection(sel);
          }

          dispatch(tr);

          return true;
        },
      // insertMath: (latex = '') => ({ commands }) => {
      //   return commands.insertContent({
      //     type: this.name,
      //     attrs: { latex },
      //   });
      // },
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
    return ReactNodeViewRenderer((props) => <MathNodeView {...{ ...props, options: this.options }} />);
  },
});

export const MathNodeView = (props) => {
  const { node, updateAttributes, editor, selected, options } = props;
  const [showToolbar, setShowToolbar] = useState(selected);
  const toolbarRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { math: mathOptions = {} } = options || {};
  const {
    keypadMode,
    controlledKeypadMode = true,
    customKeys = [],
    keyPadCharacterRef,
    setKeypadInteraction,
  } = mathOptions;

  const latex = node.attrs.latex || '';

  useEffect(() => {
    if (selected) {
      setShowToolbar(true);
    }
  }, [selected]);

  useEffect(() => {
    editor._toolbarOpened = !!showToolbar;
  }, [showToolbar]);

  useEffect(() => {
    // Calculate position relative to selection
    const bodyRect = document.body.getBoundingClientRect();
    const { from } = editor.state.selection;
    const start = editor.view.coordsAtPos(from);
    setPosition({
      top: start.top + Math.abs(bodyRect.top) + 40, // shift above
      left: start.left,
    });

    const handleClickOutside = (event) => {
      const target = event?.target;

      // MUI's `Select` renders its dropdown options in a portal attached to `document.body`.
      // Those clicks should not dismiss the math toolbar.
      const equationEditorListboxes =
        document.querySelectorAll?.(
          '[id^="equation-editor-select"][id*="listbox"], [aria-labelledby="equation-editor-label"][role="listbox"]',
        ) || [];

      const equationEditorPopoverOpen = equationEditorListboxes.length > 0;
      const clickedEquationEditorSelect =
        !!(target?.id && target.id.includes('equation-editor-select')) ||
        !!target?.closest?.('[id*="equation-editor-select"]');

      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(target) &&
        !target?.closest?.('[data-inline-node]') &&
        !equationEditorPopoverOpen &&
        !clickedEquationEditorSelect
      ) {
        setShowToolbar(false);
      }
    };

    if (showToolbar) {
      // Use `click` (not `mousedown`) so interacting with browser UI like the scrollbar
      // doesn't automatically dismiss the math toolbar.
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [editor, showToolbar]);

  const handleChange = (newLatex) => {
    updateAttributes({ latex: newLatex });
  };

  const handleDone = (newLatex) => {
    updateAttributes({ latex: newLatex });
    setShowToolbar(false);

    editor._toolbarOpened = false;

    const { selection, tr, doc } = editor.state;
    const sel = TextSelection.create(doc, selection.from + 1);

    // Build a fresh transaction from the current state and set the selection
    tr.setSelection(sel);
    editor.view.dispatch(tr);
    editor.commands.focus();
  };

  return (
    <NodeViewWrapper
      className="math-node"
      style={{
        display: 'inline-flex',
        cursor: 'pointer',
        margin: '0 4px',
      }}
      data-selected={selected}
    >
      <div onClick={() => setShowToolbar(true)} contentEditable={false}>
        <MathPreview latex={latex} />
      </div>
      {showToolbar &&
        ReactDOM.createPortal(
          <div
            ref={toolbarRef}
            data-toolbar-for={editor.instanceId}
            style={{
              position: 'absolute',
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 20,
              background: 'var(--editable-html-toolbar-bg, #efefef)',
              boxShadow:
                '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
            }}
          >
            <MathToolbar
              latex={latex}
              autoFocus
              onChange={handleChange}
              onDone={handleDone}
              keypadMode={keypadMode}
              controlledKeypadMode={controlledKeypadMode}
              additionalKeys={generateAdditionalKeys(customKeys)}
              keyPadCharacterRef={keyPadCharacterRef}
              setKeypadInteraction={setKeypadInteraction}
            />
          </div>,
          document.body,
        )}
    </NodeViewWrapper>
  );
};
