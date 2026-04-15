jest.mock('@tiptap/core', () => ({
  Node: { create: jest.fn((config) => config) },
  mergeAttributes: jest.fn((...args) => Object.assign({}, ...args)),
}));

jest.mock('@tiptap/pm/state', () => ({
  Plugin: jest.fn(function MockPlugin(spec) {
    this.spec = spec;
    return { spec };
  }),
}));

jest.mock('@tiptap/react', () => ({
  ReactNodeViewRenderer: jest.fn((component) => component),
}));

jest.mock('../image-component', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="image-component" />),
}));

import { Plugin } from '@tiptap/pm/state';
import { ImageUploadNode } from '../image';

function setupPastePlugin() {
  const insertContent = jest.fn();
  const editor = { commands: { insertContent } };
  Plugin.mockClear();
  ImageUploadNode.addProseMirrorPlugins.call({ editor });
  expect(Plugin).toHaveBeenCalledTimes(1);
  const handlePaste = Plugin.mock.calls[0][0].props.handlePaste;
  return { handlePaste, insertContent, editor };
}

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
      expect(rules[0]).toHaveProperty('tag', 'img[data-type="image-upload-node"]');
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

    it('setImageUploadNode inserts content', () => {
      const context = { name: 'imageUploadNode' };
      const commands = ImageUploadNode.addCommands.call(context);
      const mockCommands = {
        insertContent: jest.fn(() => true),
      };
      const result = commands.setImageUploadNode()({ commands: mockCommands });
      expect(mockCommands.insertContent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'imageUploadNode',
          attrs: expect.objectContaining({ nodeKey: expect.any(String) }),
        }),
      );
      expect(result).toBe(true);
    });
  });

  describe('addProseMirrorPlugins', () => {
    const mockView = {};

    beforeEach(() => {
      jest.spyOn(global, 'FileReader').mockImplementation(function MockFileReader() {
        this.readAsDataURL = function readAsDataURL() {
          this.result = 'data:image/png;base64,Zm9v';
          queueMicrotask(() => {
            if (this.onload) {
              this.onload();
            }
          });
        };
      });
    });

    afterEach(() => {
      global.FileReader.mockRestore();
    });

    it('registers one paste plugin', () => {
      const insertContent = jest.fn();
      const editor = { commands: { insertContent } };
      Plugin.mockClear();
      const plugins = ImageUploadNode.addProseMirrorPlugins.call({ editor });
      expect(plugins).toHaveLength(1);
      expect(Plugin).toHaveBeenCalledTimes(1);
    });

    it('handlePaste returns false when clipboard has no image file', () => {
      const { handlePaste } = setupPastePlugin();
      const event = {
        clipboardData: {
          items: [{ kind: 'string', type: 'text/plain', getAsFile: () => null }],
        },
      };
      expect(handlePaste(mockView, event)).toBe(false);
    });

    it('handlePaste returns false when clipboardData is missing', () => {
      const { handlePaste } = setupPastePlugin();
      const event = {};
      expect(handlePaste(mockView, event)).toBe(false);
    });

    it('handlePaste returns false when the file item has no file', () => {
      const { handlePaste } = setupPastePlugin();
      const event = {
        clipboardData: {
          items: [{ kind: 'file', type: 'image/png', getAsFile: () => null }],
        },
      };
      expect(handlePaste(mockView, event)).toBe(false);
    });

    it('handlePaste returns true and inserts imageUploadNode with data URL after read', async () => {
      const { handlePaste, insertContent } = setupPastePlugin();
      const file = new File([new Uint8Array([1, 2, 3])], 'p.png', { type: 'image/png' });
      const event = {
        clipboardData: {
          items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
        },
      };

      expect(handlePaste(mockView, event)).toBe(true);
      expect(insertContent).not.toHaveBeenCalled();

      await new Promise((resolve) => queueMicrotask(resolve));

      expect(insertContent).toHaveBeenCalledWith({
        type: 'imageUploadNode',
        attrs: {
          src: 'data:image/png;base64,Zm9v',
          loaded: true,
        },
      });
    });
  });
});
