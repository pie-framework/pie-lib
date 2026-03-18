import { DivNode } from '../div-node';

jest.mock('@tiptap/core', () => ({
  Node: {
    create: jest.fn((config) => config),
  },
}));

describe('DivNode', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(DivNode.name).toBe('div');
    });

    it('is block level', () => {
      expect(DivNode.group).toBe('block');
      expect(DivNode.content).toBe('inline*');
    });
  });

  describe('parseHTML', () => {
    it('parses <div> tags', () => {
      const rules = DivNode.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(1);
      expect(rules[0]).toHaveProperty('tag', 'div');
    });
  });

  describe('renderHTML', () => {
    it('renders a <div> tag', () => {
      const result = DivNode.renderHTML({ HTMLAttributes: { class: 'foo' } });

      expect(result[0]).toBe('div');
      expect(result[1]).toEqual({ class: 'foo' });
    });
  });

  describe('addKeyboardShortcuts', () => {
    it('does nothing when current block is not div', () => {
      const mockEditor = {
        state: {
          selection: {
            $from: {
              parent: { type: { name: 'paragraph' } },
            },
          },
        },
      };

      const shortcuts = DivNode.addKeyboardShortcuts.call({ editor: mockEditor });
      const handled = shortcuts.Enter();

      expect(handled).toBe(false);
    });

    it('turns div into paragraph and splits when Enter is pressed in a div', () => {
      const chain = {
        focus: jest.fn(() => chain),
        setNode: jest.fn(() => chain),
        splitBlock: jest.fn(() => chain),
        run: jest.fn(() => true),
      };

      const mockEditor = {
        state: {
          selection: {
            $from: {
              parent: { type: { name: 'div' } },
            },
          },
        },
        chain: () => chain,
      };

      const shortcuts = DivNode.addKeyboardShortcuts.call({ editor: mockEditor });
      const handled = shortcuts.Enter();

      expect(chain.focus).toHaveBeenCalled();
      expect(chain.setNode).toHaveBeenCalledWith('paragraph');
      expect(chain.splitBlock).toHaveBeenCalled();
      expect(chain.run).toHaveBeenCalled();
      expect(handled).toBe(true);
    });
  });
});
