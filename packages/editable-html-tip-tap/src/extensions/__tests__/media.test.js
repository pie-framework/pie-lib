import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { insertDialog, Media } from '../media';

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
  default: jest.fn(({ onEdit, onRemove }) => (
    <div data-testid="media-toolbar">
      <button onClick={onEdit}>Edit Settings</button>
      <button onClick={onRemove}>Remove</button>
    </div>
  )),
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

describe('MediaNodeView', () => {
  let mockEditor;
  let mockUpdateAttributes;
  let mockDeleteNode;
  let mockInsertDialog;

  beforeEach(() => {
    // Reset the insertDialog mock
    jest.clearAllMocks();

    mockEditor = {
      chain: jest.fn(() => ({
        focus: jest.fn(() => ({
          run: jest.fn(),
        })),
      })),
    };

    mockUpdateAttributes = jest.fn();
    mockDeleteNode = jest.fn();

    // Mock insertDialog at the module level
    mockInsertDialog = require('../media').insertDialog;
  });

  describe('dialog auto-opening behavior', () => {
    it('should NOT open dialog on mount when media has existing src (audio)', () => {
      const node = {
        attrs: {
          type: 'audio',
          tag: 'audio',
          src: 'https://example.com/audio.mp3',
          width: null,
          height: null,
        },
      };

      const MediaNodeView = require('../media').default;

      render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      expect(mockInsertDialog).not.toHaveBeenCalled();
    });

    it('should NOT open dialog on mount when media has existing src (video)', () => {
      const node = {
        attrs: {
          type: 'video',
          tag: 'iframe',
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          width: '640',
          height: '480',
        },
      };

      const MediaNodeView = require('../media').default;

      render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      expect(mockInsertDialog).not.toHaveBeenCalled();
    });

    it('should open dialog on mount when media has no src (new insertion)', () => {
      const node = {
        attrs: {
          type: 'video',
          tag: 'iframe',
          src: null,
          width: null,
          height: null,
        },
      };

      const MediaNodeView = require('../media').default;

      render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{ uploadSoundSupport: true }}
        />
      );

      expect(mockInsertDialog).toHaveBeenCalledTimes(1);
      expect(mockInsertDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'video',
          src: null,
          edit: true,
          options: { uploadSoundSupport: true },
          callback: expect.any(Function),
        })
      );
    });

    it('should call deleteNode when dialog callback receives false (new media canceled)', () => {
      const node = {
        attrs: {
          type: 'audio',
          tag: 'audio',
          src: null,
        },
      };

      const MediaNodeView = require('../media').default;

      render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      // Get the callback that was passed to insertDialog
      const callbackArg = mockInsertDialog.mock.calls[0][0].callback;

      // Simulate user canceling the dialog
      callbackArg(false, {});

      expect(mockDeleteNode).toHaveBeenCalled();
      expect(mockUpdateAttributes).not.toHaveBeenCalled();
    });

    it('should call updateAttributes when dialog callback receives true with data', () => {
      const node = {
        attrs: {
          type: 'audio',
          tag: 'audio',
          src: null,
        },
      };

      const MediaNodeView = require('../media').default;

      render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      // Get the callback that was passed to insertDialog
      const callbackArg = mockInsertDialog.mock.calls[0][0].callback;

      // Simulate user confirming with data
      const newData = { src: 'https://example.com/new-audio.mp3' };
      callbackArg(true, newData);

      expect(mockUpdateAttributes).toHaveBeenCalledWith(newData);
      expect(mockDeleteNode).not.toHaveBeenCalled();
    });
  });

  describe('edit button functionality', () => {
    it('should open dialog when edit button is clicked on existing media', () => {
      const node = {
        attrs: {
          type: 'audio',
          tag: 'audio',
          src: 'https://example.com/audio.mp3',
        },
      };

      const MediaNodeView = require('../media').default;

      const { getByText } = render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      // Dialog should not have been called on mount
      expect(mockInsertDialog).not.toHaveBeenCalled();

      // Click the edit button
      fireEvent.click(getByText('Edit Settings'));

      // Now dialog should be called
      expect(mockInsertDialog).toHaveBeenCalledTimes(1);
      expect(mockInsertDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          src: 'https://example.com/audio.mp3',
          edit: true,
          callback: expect.any(Function),
        })
      );
    });

    it('should NOT call deleteNode when editing existing media and dialog is canceled', () => {
      const node = {
        attrs: {
          type: 'video',
          tag: 'iframe',
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
      };

      const MediaNodeView = require('../media').default;

      const { getByText } = render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      // Click edit button
      fireEvent.click(getByText('Edit Settings'));

      // Get the callback from the edit handler
      const callbackArg = mockInsertDialog.mock.calls[0][0].callback;

      // Simulate canceling the edit
      callbackArg(false, {});

      // deleteNode should NOT be called for existing media
      expect(mockDeleteNode).not.toHaveBeenCalled();
      expect(mockUpdateAttributes).not.toHaveBeenCalled();
    });
  });

  describe('rendering', () => {
    it('should render audio element when tag is audio', () => {
      const node = {
        attrs: {
          type: 'audio',
          tag: 'audio',
          src: 'https://example.com/audio.mp3',
        },
      };

      const MediaNodeView = require('../media').default;

      const { container } = render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      const audio = container.querySelector('audio');
      expect(audio).toBeInTheDocument();
      expect(audio.querySelector('source')).toHaveAttribute('src', 'https://example.com/audio.mp3');
    });

    it('should render iframe when tag is iframe', () => {
      const node = {
        attrs: {
          type: 'video',
          tag: 'iframe',
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          width: '640',
          height: '480',
        },
      };

      const MediaNodeView = require('../media').default;

      const { container } = render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('should render MediaToolbar with correct props', () => {
      const node = {
        attrs: {
          type: 'audio',
          tag: 'audio',
          src: 'https://example.com/audio.mp3',
        },
      };

      const MediaNodeView = require('../media').default;

      const { getByText } = render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      expect(getByText('Edit Settings')).toBeInTheDocument();
      expect(getByText('Remove')).toBeInTheDocument();
    });

    it('should call deleteNode when remove button is clicked', () => {
      const node = {
        attrs: {
          type: 'audio',
          tag: 'audio',
          src: 'https://example.com/audio.mp3',
        },
      };

      const MediaNodeView = require('../media').default;

      const { getByText } = render(
        <MediaNodeView
          editor={mockEditor}
          node={node}
          updateAttributes={mockUpdateAttributes}
          deleteNode={mockDeleteNode}
          options={{}}
        />
      );

      fireEvent.click(getByText('Remove'));

      expect(mockDeleteNode).toHaveBeenCalled();
    });
  });
});
