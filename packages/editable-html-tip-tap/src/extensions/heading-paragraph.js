import { Node, mergeAttributes } from '@tiptap/core';

/**
 * HeadingParagraph extension
 *
 * Renders as <p data-heading="heading1"> in the HTML output instead of <h3>.
 * This provides semantic heading styling without using a native heading element,
 * as required by PIE's accessibility conventions.
 */
export const HeadingParagraph = Node.create({
  name: 'headingParagraph',

  group: 'block',

  content: 'inline*',

  defining: true,

  addAttributes() {
    return {
      'data-heading': {
        default: 'heading1',
        parseHTML: (element) => element.getAttribute('data-heading'),
        renderHTML: (attributes) => ({
          'data-heading': attributes['data-heading'],
        }),
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'p[data-heading]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleHeadingParagraph:
        () =>
        ({ commands, editor }) => {
          if (editor.isActive('headingParagraph')) {
            return commands.setNode('paragraph');
          }
          return commands.setNode('headingParagraph', { 'data-heading': 'heading1' });
        },
    };
  },
});
