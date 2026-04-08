import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

/**
 * After ProseMirror repairs an empty document, it often inserts a `paragraph`.
 * We want a lone empty top-level block to be `div` (DivNode) so typing stays `<div>A</div>`.
 */
export const EnsureEmptyRootIsDiv = Extension.create({
  name: 'ensureEmptyRootIsDiv',

  addProseMirrorPlugins() {
    const key = new PluginKey(this.name);

    return [
      new Plugin({
        key,
        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some((tr) => tr.docChanged)) {
            return null;
          }

          const { doc } = newState;
          if (doc.childCount !== 1) {
            return null;
          }

          const first = doc.firstChild;
          if (first.type.name !== 'paragraph' || first.content.size > 0) {
            return null;
          }

          const divType = newState.schema.nodes.div;
          if (!divType) {
            return null;
          }

          // Top-level content positions are 0 .. doc.content.size. The first block spans
          // [0, first.nodeSize). Using start=1 replaces the wrong slice and can leave the
          // document inconsistent after a full delete (Cmd+A, Backspace).
          const start = 0;
          const end = first.nodeSize;
          return newState.tr.replaceWith(start, end, divType.create());
        },
      }),
    ];
  },
});
