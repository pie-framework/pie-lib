import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

/**
 * Some list operations preserve/create `paragraph` children in `listItem`.
 * Normalize direct `listItem > paragraph` children into `div` so list content
 * stays consistent with DivNode-based editing.
 */
export const EnsureListItemContentIsDiv = Extension.create({
  name: 'ensureListItemContentIsDiv',

  addProseMirrorPlugins() {
    const key = new PluginKey(this.name);

    return [
      new Plugin({
        key,
        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some((tr) => tr.docChanged)) {
            return null;
          }

          const { doc, schema } = newState;
          const divType = schema.nodes.div;
          if (!divType) {
            return null;
          }

          const positionsToConvert = [];

          doc.descendants((node, pos) => {
            if (node.type.name !== 'listItem') {
              return;
            }

            let childOffset = 1;
            node.forEach((child) => {
              if (child.type.name === 'paragraph') {
                positionsToConvert.push({
                  pos: pos + childOffset,
                  attrs: child.attrs,
                });
              }
              childOffset += child.nodeSize;
            });
          });

          if (positionsToConvert.length === 0) {
            return null;
          }

          const tr = newState.tr;
          positionsToConvert
            .sort((a, b) => b.pos - a.pos)
            .forEach(({ pos, attrs }) => tr.setNodeMarkup(pos, divType, attrs));

          return tr;
        },
      }),
    ];
  },
});
