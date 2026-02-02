import { Media, insertDialog } from '../media';

jest.mock('@tiptap/core', () => ({
  Node: { create: jest.fn((config) => config) },
  mergeAttributes: jest.fn((...args) => Object.assign({}, ...args)),
}));

jest.mock('@tiptap/react', () => ({
  NodeViewWrapper: ({ children }) => <div data-testid="node-view-wrapper">{children}</div>,
  ReactNodeViewRenderer: jest.fn((component) => component),
}));

jest.mock('react-dom', () => ({
  render: jest.fn(),
}));

jest.mock('../../components/media/MediaDialog', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="media-dialog" />),
}));

jest.mock('../../components/media/MediaToolbar', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="media-toolbar" />),
}));

describe('Media', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(Media.name).toBe('media');
    });

    it('is inline', () => {
      expect(Media.inline).toBe(true);
    });

    it('is in inline group', () => {
      expect(Media.group).toBe('inline');
    });

    it('is atomic', () => {
      expect(Media.atom).toBe(true);
    });
  });

  describe('addAttributes', () => {
    it('returns all media attributes with defaults', () => {
      const attributes = Media.addAttributes();

      expect(attributes).toHaveProperty('type');
      expect(attributes).toHaveProperty('src');
      expect(attributes).toHaveProperty('width');
      expect(attributes).toHaveProperty('height');
      expect(attributes).toHaveProperty('title');
      expect(attributes).toHaveProperty('starts');
      expect(attributes).toHaveProperty('ends');
      expect(attributes).toHaveProperty('editing');
      expect(attributes).toHaveProperty('tag');
      expect(attributes).toHaveProperty('url');

      expect(attributes.type.default).toBe('video');
      expect(attributes.src.default).toBeNull();
      expect(attributes.tag.default).toBe('iframe');
      expect(attributes.editing.default).toBe(false);
    });
  });

  describe('parseHTML', () => {
    it('returns parsing rules for iframe and audio', () => {
      const rules = Media.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(2);
      expect(rules[0].tag).toBe('iframe[data-type="video"]');
      expect(rules[1].tag).toBe('audio');
    });

    it('parses video iframe attributes', () => {
      const rules = Media.parseHTML();
      const mockEl = {
        getAttribute: jest.fn((attr) => {
          const attrs = {
            src: 'https://video.com/embed',
            width: '640',
            height: '480',
          };
          return attrs[attr] || null;
        }),
        dataset: {
          title: 'Test Video',
          starts: '10',
          ends: '60',
          url: 'https://video.com/watch',
        },
      };

      const result = rules[0].getAttrs(mockEl);

      expect(result.type).toBe('video');
      expect(result.tag).toBe('iframe');
      expect(result.src).toBe('https://video.com/embed');
      expect(result.width).toBe('640');
      expect(result.height).toBe('480');
      expect(result.title).toBe('Test Video');
    });

    it('parses audio element attributes', () => {
      const rules = Media.parseHTML();
      const mockEl = {
        querySelector: jest.fn(() => ({
          getAttribute: jest.fn(() => 'https://audio.com/file.mp3'),
        })),
      };

      const result = rules[1].getAttrs(mockEl);

      expect(result.type).toBe('audio');
      expect(result.tag).toBe('audio');
      expect(result.src).toBe('https://audio.com/file.mp3');
    });
  });

  describe('renderHTML', () => {
    it('renders audio element for audio type', () => {
      const HTMLAttributes = {
        tag: 'audio',
        src: 'test.mp3',
      };

      const result = Media.renderHTML({ HTMLAttributes });

      expect(result[0]).toBe('audio');
      expect(result[1]).toEqual({ controls: 'controls', controlsList: 'nodownload' });
      expect(result[2][0]).toBe('source');
      expect(result[2][1]).toEqual({ src: 'test.mp3', type: 'audio/mp3' });
    });

    it('renders iframe for video type', () => {
      const HTMLAttributes = {
        tag: 'iframe',
        src: 'https://video.com/embed',
        width: '640',
        height: '480',
      };

      const result = Media.renderHTML({ HTMLAttributes });

      expect(result[0]).toBe('iframe');
      expect(result[1]).toHaveProperty('data-type', 'video');
      expect(result[1]).toHaveProperty('frameborder', '0');
      expect(result[1]).toHaveProperty('src', 'https://video.com/embed');
      expect(result[1]).toHaveProperty('width', '640');
      expect(result[1]).toHaveProperty('height', '480');
    });

    it('renders iframe without dimensions if not provided', () => {
      const HTMLAttributes = {
        tag: 'iframe',
        src: 'https://video.com/embed',
      };

      const result = Media.renderHTML({ HTMLAttributes });

      expect(result[1]).not.toHaveProperty('width');
      expect(result[1]).not.toHaveProperty('height');
    });
  });

  describe('addCommands', () => {
    it('returns insertMedia and updateMedia commands', () => {
      const commands = Media.addCommands();

      expect(commands).toHaveProperty('insertMedia');
      expect(commands).toHaveProperty('updateMedia');
      expect(typeof commands.insertMedia).toBe('function');
      expect(typeof commands.updateMedia).toBe('function');
    });

    it('insertMedia inserts content with attributes', () => {
      const context = { name: 'media' };
      const commands = Media.addCommands.call(context);
      const mockCommands = {
        insertContent: jest.fn(() => true),
      };
      const attrs = { type: 'video', src: 'test.mp4' };

      const result = commands.insertMedia(attrs)({ commands: mockCommands });

      expect(mockCommands.insertContent).toHaveBeenCalledWith({
        type: 'media',
        attrs,
      });
      expect(result).toBe(true);
    });

    it('updateMedia updates attributes', () => {
      const context = { name: 'media' };
      const commands = Media.addCommands.call(context);
      const mockCommands = {
        updateAttributes: jest.fn(() => true),
      };
      const attrs = { width: '800' };

      const result = commands.updateMedia(attrs)({ commands: mockCommands });

      expect(mockCommands.updateAttributes).toHaveBeenCalledWith('media', attrs);
      expect(result).toBe(true);
    });
  });

  describe('addNodeView', () => {
    it('returns ReactNodeViewRenderer result', () => {
      const result = Media.addNodeView();

      expect(result).toBeDefined();
    });
  });
});

describe('insertDialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = 'auto';
  });

  it('creates dialog element', () => {
    const mockCallback = jest.fn();
    const props = {
      type: 'video',
      callback: mockCallback,
      options: {},
    };

    insertDialog(props);

    const dialog = document.querySelector('.insert-media-dialog');
    expect(dialog).toBeTruthy();
  });

  it('sets body overflow to hidden', () => {
    const mockCallback = jest.fn();
    const props = {
      type: 'video',
      callback: mockCallback,
      options: {},
    };

    insertDialog(props);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('removes previous dialogs', () => {
    const existingDialog = document.createElement('div');
    existingDialog.className = 'insert-media-dialog';
    document.body.appendChild(existingDialog);

    const mockCallback = jest.fn();
    const props = {
      type: 'video',
      callback: mockCallback,
      options: {},
    };

    insertDialog(props);

    const dialogs = document.querySelectorAll('.insert-media-dialog');
    expect(dialogs).toHaveLength(1);
  });
});
