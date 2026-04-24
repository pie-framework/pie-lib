import {
  DragInTheBlankNode,
  ExplicitConstructedResponseNode,
  InlineDropdownNode,
  ResponseAreaExtension,
} from '../responseArea';

jest.mock('@tiptap/core', () => ({
  Extension: { create: jest.fn((config) => config) },
  Node: { create: jest.fn((config) => config) },
}));

jest.mock('@tiptap/react', () => ({
  Node: { create: jest.fn((config) => config) },
  ReactNodeViewRenderer: jest.fn((component) => component),
}));

jest.mock('prosemirror-state', () => ({
  Plugin: jest.fn(function (config) {
    return config;
  }),
  PluginKey: jest.fn(function (key) {
    this.key = key;
  }),
  TextSelection: {
    near: jest.fn((pos, dir) => ({ type: 'text', pos, dir })),
    create: jest.fn((doc, pos) => ({ type: 'text', pos })),
  },
  NodeSelection: {
    create: jest.fn((doc, pos) => ({ type: 'node', pos })),
  },
}));

jest.mock('../../components/respArea/ExplicitConstructedResponse', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="explicit-constructed-response" />),
}));

jest.mock('../../components/respArea/DragInTheBlank/DragInTheBlank', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="drag-in-the-blank" />),
}));

jest.mock('../../components/respArea/InlineDropdown', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="inline-dropdown" />),
}));

describe('ResponseAreaExtension', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(ResponseAreaExtension.name).toBe('responseArea');
    });
  });

  describe('addOptions', () => {
    it('returns default options', () => {
      const options = ResponseAreaExtension.addOptions();

      expect(options).toHaveProperty('maxResponseAreas', null);
      expect(options).toHaveProperty('error', null);
      expect(options).toHaveProperty('options', null);
      expect(options).toHaveProperty('respAreaToolbar', null);
      expect(options).toHaveProperty('onHandleAreaChange', null);
    });
  });

  describe('addProseMirrorPlugins', () => {
    it('returns empty array when no type specified', () => {
      const context = {
        options: {},
      };

      const plugins = ResponseAreaExtension.addProseMirrorPlugins.call(context);

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins).toHaveLength(0);
    });

    it('returns plugin array when type is specified', () => {
      const context = {
        options: {
          type: 'explicit-constructed-response',
          maxResponseAreas: 5,
        },
      };

      const plugins = ResponseAreaExtension.addProseMirrorPlugins.call(context);

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins).toHaveLength(1);
      expect(plugins[0]).toHaveProperty('key');
      expect(plugins[0]).toHaveProperty('view');
    });
  });

  describe('addCommands', () => {
    it('returns insertResponseArea command', () => {
      const commands = ResponseAreaExtension.addCommands();

      expect(commands).toHaveProperty('insertResponseArea');
      expect(typeof commands.insertResponseArea).toBe('function');
    });

    it('returns refreshResponseArea command', () => {
      const commands = ResponseAreaExtension.addCommands();

      expect(commands).toHaveProperty('refreshResponseArea');
      expect(typeof commands.refreshResponseArea).toBe('function');
    });

    it('refreshResponseArea handles node with attrs safely', () => {
      const context = {
        options: {
          type: 'explicit-constructed-response',
          maxResponseAreas: 5,
        },
      };

      const commands = ResponseAreaExtension.addCommands.call(context);
      const refreshCommand = commands.refreshResponseArea();

      // Mock transaction and state
      const mockNode = {
        attrs: {
          index: '0',
          value: 'test',
        },
      };

      const mockTr = {
        setNodeMarkup: jest.fn(),
        setSelection: jest.fn(),
      };

      const mockState = {
        selection: {
          from: 0,
          $from: {
            nodeAfter: mockNode,
          },
        },
        tr: mockTr,
      };

      const mockCommands = {
        focus: jest.fn(),
      };

      const mockDispatch = jest.fn();

      refreshCommand({
        tr: mockTr,
        state: mockState,
        commands: mockCommands,
        dispatch: mockDispatch,
      });

      expect(mockTr.setNodeMarkup).toHaveBeenCalled();
    });

    it('refreshResponseArea handles node without attrs safely (optional chaining)', () => {
      const context = {
        options: {
          type: 'explicit-constructed-response',
          maxResponseAreas: 5,
        },
      };

      const commands = ResponseAreaExtension.addCommands.call(context);
      const refreshCommand = commands.refreshResponseArea();

      // Mock transaction and state with node that has no attrs
      const mockNode = null;

      const mockTr = {
        setNodeMarkup: jest.fn(),
        setSelection: jest.fn(),
      };

      const mockState = {
        selection: {
          from: 0,
          $from: {
            nodeAfter: mockNode,
          },
        },
        tr: mockTr,
      };

      const mockCommands = {
        focus: jest.fn(),
      };

      const mockDispatch = jest.fn();

      // This should not throw an error due to optional chaining on node?.attrs
      expect(() => {
        refreshCommand({
          tr: mockTr,
          state: mockState,
          commands: mockCommands,
          dispatch: mockDispatch,
        });
      }).not.toThrow();
    });

    it('refreshResponseArea updates timestamp in node attributes', () => {
      const context = {
        options: {
          type: 'explicit-constructed-response',
          maxResponseAreas: 5,
        },
      };

      const commands = ResponseAreaExtension.addCommands.call(context);
      const refreshCommand = commands.refreshResponseArea();

      const mockNode = {
        attrs: {
          index: '0',
          value: 'test',
          updated: '1234567890',
        },
      };

      const mockTr = {
        setNodeMarkup: jest.fn((pos, type, attrs) => {
          // Verify that updated timestamp is being set
          expect(attrs.updated).toBeDefined();
          expect(attrs.updated).not.toBe('1234567890');
        }),
        setSelection: jest.fn(),
      };

      const mockState = {
        selection: {
          from: 0,
          $from: {
            nodeAfter: mockNode,
          },
        },
        tr: mockTr,
      };

      const mockCommands = {
        focus: jest.fn(),
      };

      const mockDispatch = jest.fn();

      refreshCommand({
        tr: mockTr,
        state: mockState,
        commands: mockCommands,
        dispatch: mockDispatch,
      });

      expect(mockTr.setNodeMarkup).toHaveBeenCalled();
    });

    describe('insertResponseArea', () => {
      beforeEach(() => {
        jest.resetModules();
      });

      const buildInsertCommand = () => {
        const { ResponseAreaExtension } = require('../responseArea');
        const context = {
          options: {
            type: 'inline-dropdown',
            maxResponseAreas: 5,
          },
        };
        const commands = ResponseAreaExtension.addCommands.call(context);
        return commands.insertResponseArea('inline-dropdown');
      };

      const createDoc = (existingCount, typeName = 'inline_dropdown') => ({
        descendants: jest.fn((callback) => {
          for (let i = 0; i < existingCount; i += 1) {
            callback({ type: { name: typeName } }, i);
          }
        }),
        content: { size: 50 },
      });

      it('assigns index 1 and id 1 on the first insert', () => {
        const insert = buildInsertCommand();
        const mockInlineNode = { nodeSize: 1 };
        const create = jest.fn(() => mockInlineNode);
        const mockDoc = createDoc(0);
        const mockTr = {
          insert: jest.fn(),
          doc: mockDoc,
          setSelection: jest.fn(),
        };
        const state = {
          schema: {
            nodes: {
              inline_dropdown: { create },
            },
          },
          doc: mockDoc,
          selection: { from: 5 },
        };
        const mockDispatch = jest.fn();
        const mockCommands = { focus: jest.fn() };

        const result = insert({
          tr: mockTr,
          state,
          dispatch: mockDispatch,
          commands: mockCommands,
        });

        expect(result).toBe(true);
        expect(create).toHaveBeenCalledWith({
          index: '1',
          id: '1',
          value: '',
        });
        expect(mockTr.insert).toHaveBeenCalledWith(5, mockInlineNode);
        expect(mockDispatch).toHaveBeenCalled();
      });

      it('assigns consecutive indices on repeated inserts', () => {
        const insert = buildInsertCommand();
        const mockInlineNode = { nodeSize: 1 };
        const create = jest.fn(() => mockInlineNode);
        const mockDoc = createDoc(0);

        const runOnce = () => {
          const mockTr = {
            insert: jest.fn(),
            doc: mockDoc,
            setSelection: jest.fn(),
          };
          const state = {
            schema: {
              nodes: {
                inline_dropdown: { create },
              },
            },
            doc: mockDoc,
            selection: { from: 1 },
          };
          insert({
            tr: mockTr,
            state,
            dispatch: jest.fn(),
            commands: { focus: jest.fn() },
          });
        };

        runOnce();
        runOnce();

        expect(create.mock.calls[0][0]).toEqual({ index: '1', id: '1', value: '' });
        expect(create.mock.calls[1][0]).toEqual({ index: '2', id: '2', value: '' });
      });

      it('returns false when maxResponseAreas is reached', () => {
        const insert = buildInsertCommand();
        const mockInlineNode = { nodeSize: 1 };
        const create = jest.fn(() => mockInlineNode);
        const mockDoc = createDoc(5);
        const mockTr = {
          insert: jest.fn(),
          doc: mockDoc,
          setSelection: jest.fn(),
        };
        const state = {
          schema: {
            nodes: {
              inline_dropdown: { create },
            },
          },
          doc: mockDoc,
          selection: { from: 5 },
        };

        const result = insert({
          tr: mockTr,
          state,
          dispatch: jest.fn(),
          commands: { focus: jest.fn() },
        });

        expect(result).toBe(false);
        expect(create).not.toHaveBeenCalled();
        expect(mockTr.insert).not.toHaveBeenCalled();
      });
    });
  });
});

describe('ExplicitConstructedResponseNode', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(ExplicitConstructedResponseNode.name).toBe('explicit_constructed_response');
    });

    it('is inline', () => {
      expect(ExplicitConstructedResponseNode.inline).toBe(true);
    });

    it('is in inline group', () => {
      expect(ExplicitConstructedResponseNode.group).toBe('inline');
    });

    it('is atomic', () => {
      expect(ExplicitConstructedResponseNode.atom).toBe(true);
    });
  });

  describe('addAttributes', () => {
    it('returns required attributes', () => {
      const attributes = ExplicitConstructedResponseNode.addAttributes();

      expect(attributes).toHaveProperty('index');
      expect(attributes).toHaveProperty('value');
      expect(attributes).toHaveProperty('updated');

      expect(attributes.index).toEqual({ default: null });
      expect(attributes.value).toEqual({ default: '' });
      expect(attributes.updated).toEqual({ default: '' });
    });
  });

  describe('parseHTML', () => {
    it('returns parsing rules', () => {
      const rules = ExplicitConstructedResponseNode.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(1);
      expect(rules[0]).toHaveProperty('tag');
    });
  });

  describe('renderHTML', () => {
    it('renders span with attributes', () => {
      const result = ExplicitConstructedResponseNode.renderHTML({
        HTMLAttributes: {
          index: '1',
          id: '1',
          value: 'test',
        },
      });

      expect(result[0]).toBe('span');
      expect(result[1]).toHaveProperty('data-type', 'explicit_constructed_response');
    });
  });

  describe('addNodeView', () => {
    it('returns ReactNodeViewRenderer result', () => {
      const result = ExplicitConstructedResponseNode.addNodeView();

      expect(result).toBeDefined();
    });
  });
});

describe('DragInTheBlankNode', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(DragInTheBlankNode.name).toBe('drag_in_the_blank');
    });

    it('is inline', () => {
      expect(DragInTheBlankNode.inline).toBe(true);
    });

    it('is in inline group', () => {
      expect(DragInTheBlankNode.group).toBe('inline');
    });

    it('is atomic', () => {
      expect(DragInTheBlankNode.atom).toBe(true);
    });
  });

  describe('addAttributes', () => {
    it('returns required attributes', () => {
      const attributes = DragInTheBlankNode.addAttributes();

      expect(attributes).toHaveProperty('index');
      expect(attributes).toHaveProperty('id');
      expect(attributes).toHaveProperty('value');
      expect(attributes).toHaveProperty('inTable');
      expect(attributes).toHaveProperty('updated');

      expect(attributes.index).toEqual({ default: null });
      expect(attributes.id).toEqual({ default: null });
      expect(attributes.value).toEqual({ default: '' });
      expect(attributes.inTable).toEqual({ default: null });
      expect(attributes.updated).toEqual({ default: '' });
    });
  });

  describe('parseHTML', () => {
    it('returns parsing rules', () => {
      const rules = DragInTheBlankNode.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(1);
      expect(rules[0]).toHaveProperty('tag');
    });
  });

  describe('renderHTML', () => {
    it('renders span with attributes', () => {
      const result = DragInTheBlankNode.renderHTML({
        HTMLAttributes: {
          index: '1',
          id: '1',
          value: 'test',
        },
      });

      expect(result[0]).toBe('span');
      expect(result[1]).toHaveProperty('data-type', 'drag_in_the_blank');
    });
  });

  describe('addNodeView', () => {
    it('returns ReactNodeViewRenderer result', () => {
      const result = DragInTheBlankNode.addNodeView();

      expect(result).toBeDefined();
    });
  });
});

describe('InlineDropdownNode', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(InlineDropdownNode.name).toBe('inline_dropdown');
    });

    it('is inline', () => {
      expect(InlineDropdownNode.inline).toBe(true);
    });

    it('is in inline group', () => {
      expect(InlineDropdownNode.group).toBe('inline');
    });

    it('is atomic', () => {
      expect(InlineDropdownNode.atom).toBe(true);
    });
  });

  describe('addAttributes', () => {
    it('returns required attributes', () => {
      const attributes = InlineDropdownNode.addAttributes();

      expect(attributes).toHaveProperty('index');
      expect(attributes).toHaveProperty('value');
      expect(attributes).toHaveProperty('updated');

      expect(attributes.index).toEqual({ default: null });
      expect(attributes.value).toEqual({ default: '' });
      expect(attributes.updated).toEqual({ default: '' });
    });
  });

  describe('parseHTML', () => {
    it('returns parsing rules', () => {
      const rules = InlineDropdownNode.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(1);
      expect(rules[0]).toHaveProperty('tag');
    });
  });

  describe('renderHTML', () => {
    it('renders span with attributes', () => {
      const result = InlineDropdownNode.renderHTML({
        HTMLAttributes: {
          index: '1',
          id: '1',
          value: 'test',
        },
      });

      expect(result[0]).toBe('span');
      expect(result[1]).toHaveProperty('data-type', 'inline_dropdown');
    });
  });

  describe('addNodeView', () => {
    it('returns ReactNodeViewRenderer result', () => {
      const result = InlineDropdownNode.addNodeView();

      expect(result).toBeDefined();
    });
  });
});
