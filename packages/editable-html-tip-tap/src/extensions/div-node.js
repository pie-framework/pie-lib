// DivNode.ts
import { Node } from '@tiptap/core';

export const DivNode = Node.create({
  name: 'div',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0];
  },

  addKeyboardShortcuts() {
    const isInsideListItem = ($from) => {
      for (let depth = $from.depth; depth >= 0; depth -= 1) {
        if ($from.node(depth).type.name === 'listItem') {
          return true;
        }
      }
      return false;
    };

    return {
      Enter: () => {
        const { state } = this.editor;
        const { $from } = state.selection;

        if ($from.parent.type.name !== 'div') {
          return false;
        }
        if (isInsideListItem($from)) {
          return false;
        }

        return this.editor
          .chain()
          .focus()
          .setNode('paragraph') // current div becomes <p>
          .splitBlock() // create another <p>
          .run();
      },

      // When the cursor is in a div and the user presses Backspace,
      // ProseMirror's default handler may try to join/delete the block node
      // once it becomes empty. That triggers the Enter shortcut above
      // (div → p conversion + split), making it look like a new line is
      // inserted instead of deleting.
      // We handle two cases explicitly:
      //  1. The div already IS empty → swallow the event (nothing to delete).
      //  2. The div has exactly ONE character left → delete just that character
      //     using a precise transaction, then stop. This prevents ProseMirror
      //     from following up with a block-join that triggers the Enter handler.
      Backspace: () => {
        const { state } = this.editor;
        const { $from, empty: selectionEmpty } = state.selection;

        if ($from.parent.type.name !== 'div') {
          return false;
        }

        if (!selectionEmpty) {
          return false;
        }

        const parentText = $from.parent.textContent;

        if (parentText.length === 0) {
          return state.doc.childCount === 1 ? true : false;
        }

        if (parentText.length === 1 && $from.parentOffset === 1) {
          const { tr } = state;
          tr.delete($from.pos - 1, $from.pos);
          this.editor.view.dispatch(tr);
          return true;
        }

        return false;
      },
    };
  },
});
