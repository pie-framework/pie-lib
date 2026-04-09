import { ImageUploadNode } from '../image';

jest.mock('@tiptap/core', () => ({
  Node: { create: jest.fn((config) => config) },
  mergeAttributes: jest.fn((...args) => Object.assign({}, ...args)),
}));

jest.mock('@tiptap/react', () => ({
  ReactNodeViewRenderer: jest.fn((component) => component),
}));

jest.mock('../image-component', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="image-component" />),
}));

describe('ImageUploadNode', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(ImageUploadNode.name).toBe('imageUploadNode');
    });

    it('is in block group', () => {
      expect(ImageUploadNode.group).toBe('block');
    });

    it('is atomic', () => {
      expect(ImageUploadNode.atom).toBe(true);
    });

    it('is selectable', () => {
      expect(ImageUploadNode.selectable).toBe(true);
    });

    it('is draggable', () => {
      expect(ImageUploadNode.draggable).toBe(true);
    });
  });

  describe('addAttributes', () => {
    it('returns all required attributes with defaults', () => {
      const attributes = ImageUploadNode.addAttributes();

      expect(attributes).toHaveProperty('loaded');
      expect(attributes).toHaveProperty('deleteStatus');
      expect(attributes).toHaveProperty('alignment');
      expect(attributes).toHaveProperty('percent');
      expect(attributes).toHaveProperty('width');
      expect(attributes).toHaveProperty('height');
      expect(attributes).toHaveProperty('src');
      expect(attributes).toHaveProperty('alt');

      expect(attributes.loaded).toEqual({ default: false });
      expect(attributes.deleteStatus).toEqual({ default: null });
      expect(attributes.alignment).toEqual({ default: null });
      expect(attributes.percent).toEqual({ default: null });
      expect(attributes.width).toEqual({ default: null });
      expect(attributes.height).toEqual({ default: null });
      expect(attributes.src).toEqual({ default: null });
      expect(attributes.alt).toEqual({ default: null });
    });
  });

  describe('parseHTML', () => {
    it('returns array with div selector', () => {
      const rules = ImageUploadNode.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(1);
      expect(rules[0]).toHaveProperty('tag', 'div[data-type="image-upload-node"]');
    });
  });

  describe('renderHTML', () => {
    it('renders img tag with data-type attribute', () => {
      const HTMLAttributes = {
        src: 'test.jpg',
        width: 100,
        height: 100,
      };

      const result = ImageUploadNode.renderHTML({ HTMLAttributes });

      expect(result[0]).toBe('img');
      expect(result[1]).toEqual({
        ...HTMLAttributes,
        'data-type': 'image-upload-node',
      });
    });

    it('merges attributes correctly', () => {
      const HTMLAttributes = {
        src: 'test.jpg',
        alt: 'Test image',
      };

      const result = ImageUploadNode.renderHTML({ HTMLAttributes });

      expect(result[1].src).toBe('test.jpg');
      expect(result[1].alt).toBe('Test image');
      expect(result[1]['data-type']).toBe('image-upload-node');
    });
  });

  describe('addNodeView', () => {
    it('returns ReactNodeViewRenderer result', () => {
      const result = ImageUploadNode.addNodeView();

      expect(result).toBeDefined();
    });
  });

  describe('addCommands', () => {
    it('returns setImageUploadNode command', () => {
      const context = { name: 'imageUploadNode' };
      const commands = ImageUploadNode.addCommands.call(context);

      expect(commands).toHaveProperty('setImageUploadNode');
      expect(typeof commands.setImageUploadNode).toBe('function');
    });

    it('setImageUploadNode returns false when insertImageRequested is not configured', () => {
      const context = { name: 'imageUploadNode' };
      const commands = ImageUploadNode.addCommands.call(context);

      const result = commands.setImageUploadNode()({ editor: {} });

      expect(result).toBe(false);
    });

    it('setImageUploadNode calls insertImageRequested and returns true', () => {
      const mockInsertImageRequested = jest.fn();
      const context = { name: 'imageUploadNode', options: { imageHandling: { insertImageRequested: mockInsertImageRequested } } };
      const commands = ImageUploadNode.addCommands.call(context);

      const mockRun = jest.fn();
      const mockEditor = {
        chain: () => ({ focus: () => ({ insertContent: () => ({ run: mockRun }) }) }),
      };

      const result = commands.setImageUploadNode()({ editor: mockEditor });

      expect(mockInsertImageRequested).toHaveBeenCalledWith(null, expect.any(Function));
      expect(result).toBe(true);
    });
  });
});
