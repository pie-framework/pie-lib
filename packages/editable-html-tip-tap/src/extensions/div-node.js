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
    return {
      Enter: () => {
        const { state } = this.editor;
        const { $from } = state.selection;

        if ($from.parent.type.name !== 'div') {
          return false;
        }

        return this.editor
          .chain()
          .focus()
          .setNode('paragraph') // divul curent devine <p>
          .splitBlock() // se creează încă un <p>
          .run();
      },
    };
  },
});
