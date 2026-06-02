import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { EnsureTextAfterMathPlugin, MathNode, MathNodeView, ZeroWidthSpaceHandlingPlugin } from '../math';

jest.mock('@tiptap/react', () => ({
  NodeViewWrapper: ({ children, ...props }) => (
    <div data-testid="node-view-wrapper" {...props}>
      {children}
    </div>
  ),
  ReactNodeViewRenderer: jest.fn((component) => component),
}));

const mockCreatePortal = jest.fn((node) => node);
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (...args) => mockCreatePortal(...args),
}));

jest.mock('@pie-lib/math-toolbar', () => {
  const React = require('react');
  return {
    MathPreview: ({ latex }) => <div data-testid="math-preview">{latex}</div>,
    MathToolbar: ({ latex, onChange, onDone }) => {
      const [localLatex, setLocalLatex] = React.useState(latex);
      return (
        <div data-testid="math-toolbar">
          <input
            data-testid="math-input"
            value={localLatex}
            onChange={(e) => {
              setLocalLatex(e.target.value);
              onChange(e.target.value);
            }}
          />
          <button data-testid="done-button" onClick={() => onDone(localLatex)}>
            Done
          </button>
        </div>
      );
    },
  };
});

jest.mock('@pie-lib/math-rendering', () => ({
  wrapMath: (latex, wrapper) => latex,
}));

jest.mock('@tiptap/core', () => ({
  Node: {
    create: jest.fn((config) => config),
  },
}));

jest.mock('prosemirror-state', () => ({
  Plugin: jest.fn(function (config) {
    return config;
  }),
  PluginKey: jest.fn(function (key) {
    this.key = key;
  }),
  TextSelection: {
    create: jest.fn((doc, pos) => ({ type: 'text', pos })),
  },
  NodeSelection: {
    create: jest.fn((doc, pos) => ({ type: 'node', pos })),
  },
}));

describe('MathNode', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(MathNode.name).toBe('math');
    });

    it('is inline', () => {
      expect(MathNode.inline).toBe(true);
    });

    it('is in inline group', () => {
      expect(MathNode.group).toBe('inline');
    });

    it('is atomic', () => {
      expect(MathNode.atom).toBe(true);
    });
  });

  describe('addAttributes', () => {
    it('returns required attributes', () => {
      const attributes = MathNode.addAttributes();

      expect(attributes).toHaveProperty('latex');
      expect(attributes).toHaveProperty('wrapper');
      expect(attributes).toHaveProperty('html');

      expect(attributes.latex).toEqual({ default: '' });
      expect(attributes.wrapper).toEqual({ default: null });
      expect(attributes.html).toEqual({ default: null });
    });
  });

  describe('parseHTML', () => {
    it('returns parsing rules for latex', () => {
      const rules = MathNode.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(2);
      expect(rules[0]).toHaveProperty('tag', 'span[data-latex]');
    });

    it('returns parsing rules for mathml', () => {
      const rules = MathNode.parseHTML();
      expect(rules[1]).toHaveProperty('tag', 'span[data-type="mathml"]');
    });
  });

  describe('renderHTML', () => {
    it('renders mathml when html attribute is present', () => {
      const result = MathNode.renderHTML({
        HTMLAttributes: {
          html: '<math><mi>x</mi></math>',
        },
      });

      expect(result[0]).toBe('span');
      expect(result[1]).toHaveProperty('data-type', 'mathml');
    });

    it('renders latex when html attribute is not present', () => {
      const result = MathNode.renderHTML({
        HTMLAttributes: {
          latex: 'x^2',
        },
      });

      expect(result[0]).toBe('span');
      expect(result[1]).toHaveProperty('data-latex', '');
      expect(result[1]).toHaveProperty('data-raw', 'x^2');
    });
  });

  describe('addCommands', () => {
    it('returns insertMath command', () => {
      const commands = MathNode.addCommands();

      expect(commands).toHaveProperty('insertMath');
      expect(typeof commands.insertMath).toBe('function');
    });
  });

  describe('addNodeView', () => {
    it('returns ReactNodeViewRenderer result', () => {
      const result = MathNode.addNodeView();

      expect(result).toBeDefined();
    });
  });

  describe('addProseMirrorPlugins', () => {
    it('registers ensure-text-after-math and zero-width-space plugins', () => {
      const plugins = MathNode.addProseMirrorPlugins();

      expect(plugins).toHaveLength(2);
      expect(plugins[0].appendTransaction).toBeDefined();
      expect(plugins[1].props.handleKeyDown).toBeDefined();
    });
  });
});

describe('EnsureTextAfterMathPlugin', () => {
  it('inserts a zero-width space after a math node when no text follows', () => {
    const plugin = EnsureTextAfterMathPlugin('math');
    const textNode = { type: { name: 'text' } };
    const mathNode = { type: { name: 'math' }, nodeSize: 3 };
    const tr = { insert: jest.fn() };

    const newState = {
      schema: { text: jest.fn((value) => ({ type: textNode.type, text: value })) },
      tr,
      doc: {
        descendants: (cb) => cb(mathNode, 5),
        nodeAt: jest.fn(() => null),
      },
    };

    const result = plugin.appendTransaction([{ docChanged: true }], {}, newState);

    expect(tr.insert).toHaveBeenCalledWith(8, expect.anything());
    expect(result).toBe(tr);
  });

  it('does not insert when text already follows the math node', () => {
    const plugin = EnsureTextAfterMathPlugin('math');
    const tr = { insert: jest.fn() };
    const mathNode = { type: { name: 'math' }, nodeSize: 3 };

    const newState = {
      schema: { text: jest.fn() },
      tr,
      doc: {
        descendants: (cb) => cb(mathNode, 5),
        nodeAt: jest.fn(() => ({ type: { name: 'text' } })),
      },
    };

    const result = plugin.appendTransaction([{ docChanged: true }], {}, newState);

    expect(tr.insert).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns null when the document did not change', () => {
    const plugin = EnsureTextAfterMathPlugin('math');

    const result = plugin.appendTransaction([{ docChanged: false }], {}, {});
    expect(result).toBeNull();
  });
});

describe('ZeroWidthSpaceHandlingPlugin', () => {
  const createDefaultDoc = () => ({
    textBetween: jest.fn(() => '\u200b'),
    resolve: jest.fn(() => ({
      nodeAfter: null,
      nodeBefore: null,
    })),
  });

  const createView = ({ state: stateOverrides = {} } = {}) => {
    const dispatch = jest.fn();
    const tr = {
      delete: jest.fn().mockReturnThis(),
      setSelection: jest.fn().mockReturnThis(),
    };

    return {
      state: {
        selection: { from: 2, empty: true },
        doc: createDefaultDoc(),
        tr,
        ...stateOverrides,
        doc: { ...createDefaultDoc(), ...stateOverrides.doc },
      },
      dispatch,
    };
  };

  it('deletes math and zero-width space on Backspace', () => {
    const view = createView();
    const event = { key: 'Backspace' };
    const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, event);

    expect(handled).toBe(true);
    expect(view.state.tr.delete).toHaveBeenCalledWith(0, 2);
    expect(view.dispatch).toHaveBeenCalledWith(view.state.tr);
  });

  it('selects the math node on ArrowLeft before a zero-width space', () => {
    const mathNode = { nodeSize: 3 };
    const view = createView({
      state: {
        doc: {
          resolve: jest
            .fn()
            .mockReturnValueOnce({ nodeAfter: mathNode, nodeBefore: null })
            .mockReturnValueOnce({ pos: 4 }),
        },
      },
    });
    const { NodeSelection } = require('prosemirror-state');

    const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'ArrowLeft' });

    expect(handled).toBe(true);
    expect(NodeSelection.create).toHaveBeenCalledWith(view.state.doc, 4);
    expect(view.dispatch).toHaveBeenCalled();
  });

  it('moves the text cursor before the zero-width space when no inline node precedes it', () => {
    const view = createView();
    const { TextSelection } = require('prosemirror-state');

    const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'ArrowLeft' });

    expect(handled).toBe(true);
    expect(TextSelection.create).toHaveBeenCalledWith(view.state.doc, 0);
    expect(view.dispatch).toHaveBeenCalled();
  });

  it('returns false for unrelated keys', () => {
    const view = createView({
      state: {
        doc: {
          textBetween: jest.fn(() => 'a'),
          resolve: jest.fn(),
        },
      },
    });

    const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'Enter' });
    expect(handled).toBe(false);
  });
});

describe('MathNodeView', () => {
  const createMockEditor = () => ({
    state: {
      selection: {
        from: 0,
        to: 1,
      },
      tr: {
        setSelection: jest.fn().mockReturnThis(),
      },
      doc: {},
    },
    view: {
      coordsAtPos: jest.fn(() => ({ top: 100, left: 50 })),
      dispatch: jest.fn(),
    },
    commands: {
      focus: jest.fn(),
    },
    instanceId: 'editor-123',
    _toolbarOpened: false,
  });

  const mockNode = {
    attrs: {
      latex: 'x^2',
    },
  };

  let defaultProps;

  beforeAll(() => {
    Object.defineProperty(document.body, 'getBoundingClientRect', {
      value: jest.fn(() => ({ top: 0, left: 0 })),
      configurable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreatePortal.mockImplementation((node) => node);
    defaultProps = {
      node: mockNode,
      updateAttributes: jest.fn(),
      editor: createMockEditor(),
      selected: false,
      options: {},
    };
  });

  it('renders without crashing', () => {
    const { container } = render(<MathNodeView {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders NodeViewWrapper', () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} />);
    expect(getByTestId('node-view-wrapper')).toBeInTheDocument();
  });

  it('displays math preview', () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} />);
    expect(getByTestId('math-preview')).toBeInTheDocument();
  });

  it('shows toolbar when selected', async () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);
    await waitFor(() => {
      expect(getByTestId('math-toolbar')).toBeInTheDocument();
    });
  });

  it('does not show toolbar when not selected', () => {
    const { queryByTestId } = render(<MathNodeView {...defaultProps} selected={false} />);
    expect(queryByTestId('math-toolbar')).not.toBeInTheDocument();
  });

  it('adds data-toolbar-for attribute with editor instanceId', async () => {
    const { container } = render(<MathNodeView {...defaultProps} selected={true} />);
    await waitFor(() => {
      const toolbar = container.querySelector('[data-toolbar-for]');
      expect(toolbar).toHaveAttribute('data-toolbar-for', 'editor-123');
    });
  });

  describe('toolbar positioning', () => {
    it('uses a fixed top offset and horizontal position from coordsAtPos', async () => {
      const { container } = render(<MathNodeView {...defaultProps} selected={true} />);
      await waitFor(() => {
        const toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar.style.top).toBe('40px');
        expect(toolbar.style.left).toBe('50px');
      });
    });

    it('keeps the fixed top offset when the editor container is scrolled', async () => {
      const containerEl = document.createElement('div');
      containerEl.getBoundingClientRect = jest.fn(() => ({ top: -200, left: 0, width: 600, height: 400 }));

      const editor = {
        ...defaultProps.editor,
        _tiptapContainerEl: containerEl,
      };

      const { container } = render(<MathNodeView {...defaultProps} editor={editor} selected={true} />);
      await waitFor(() => {
        const toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar.style.top).toBe('40px');
        expect(toolbar.style.left).toBe('50px');
      });
    });

    it('applies absolute positioning style to toolbar', async () => {
      const { container } = render(<MathNodeView {...defaultProps} selected={true} />);
      await waitFor(() => {
        const toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar.style.position).toBe('absolute');
      });
    });

    it('updates horizontal position from coordsAtPos when selection changes', async () => {
      const editor = {
        ...defaultProps.editor,
        view: {
          ...defaultProps.editor.view,
          coordsAtPos: jest.fn(() => ({ top: 200, left: 150 })),
          dispatch: jest.fn(),
        },
      };

      const { container } = render(<MathNodeView {...defaultProps} editor={editor} selected={true} />);
      await waitFor(() => {
        const toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar.style.top).toBe('40px');
        expect(toolbar.style.left).toBe('150px');
      });
    });

    it('portals toolbar into _tiptapContainerEl when available', async () => {
      const containerEl = document.createElement('div');
      containerEl.getBoundingClientRect = jest.fn(() => ({ top: 0, left: 0, width: 600, height: 400 }));

      const editor = {
        ...defaultProps.editor,
        _tiptapContainerEl: containerEl,
      };

      mockCreatePortal.mockClear();
      render(<MathNodeView {...defaultProps} editor={editor} selected={true} />);
      await waitFor(() => {
        expect(mockCreatePortal).toHaveBeenCalled();
        const lastCall = mockCreatePortal.mock.calls[mockCreatePortal.mock.calls.length - 1];
        expect(lastCall[1]).toBe(containerEl);
      });
    });

    it('portals toolbar into document.body when _tiptapContainerEl is not set', async () => {
      const editor = {
        ...defaultProps.editor,
        _tiptapContainerEl: undefined,
      };

      mockCreatePortal.mockClear();
      render(<MathNodeView {...defaultProps} editor={editor} selected={true} />);
      await waitFor(() => {
        expect(mockCreatePortal).toHaveBeenCalled();
        const lastCall = mockCreatePortal.mock.calls[mockCreatePortal.mock.calls.length - 1];
        expect(lastCall[1]).toBe(document.body);
      });
    });
  });

  it('calls updateAttributes when latex changes', async () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);
    await waitFor(() => {
      const input = getByTestId('math-input');
      fireEvent.change(input, { target: { value: 'y^2' } });
    });
    expect(defaultProps.updateAttributes).toHaveBeenCalledWith({ latex: 'y^2' });
  });

  it('closes toolbar and updates attributes when done', async () => {
    const updateAttributes = jest.fn();
    const { getByTestId } = render(
      <MathNodeView {...defaultProps} updateAttributes={updateAttributes} selected={true} />,
    );

    await waitFor(() => {
      expect(getByTestId('done-button')).toBeInTheDocument();
    });

    const doneButton = getByTestId('done-button');
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(updateAttributes).toHaveBeenCalledWith({ latex: 'x^2' });
    });
  });

  it('sets editor._toolbarOpened when toolbar is shown', async () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);
    await waitFor(() => {
      expect(getByTestId('math-toolbar')).toBeInTheDocument();
      expect(defaultProps.editor._toolbarOpened).toBe(true);
    });
  });

  it('unsets editor._toolbarOpened when toolbar is closed', async () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);

    await waitFor(() => {
      expect(getByTestId('done-button')).toBeInTheDocument();
    });

    const doneButton = getByTestId('done-button');
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(defaultProps.editor._toolbarOpened).toBe(false);
    });
  });

  it('closes toolbar on outside click and runs handleDone', async () => {
    const updateAttributes = jest.fn();
    const editor = createMockEditor();
    const { TextSelection } = require('prosemirror-state');
    const { queryByTestId } = render(
      <MathNodeView {...defaultProps} editor={editor} updateAttributes={updateAttributes} selected={true} />,
    );

    await waitFor(() => {
      expect(queryByTestId('math-toolbar')).toBeInTheDocument();
    });

    fireEvent.click(document.body);

    await waitFor(() => {
      expect(queryByTestId('math-toolbar')).not.toBeInTheDocument();
      expect(updateAttributes).toHaveBeenCalledWith({ latex: 'x^2' });
      expect(TextSelection.create).toHaveBeenCalledWith(editor.state.doc, 1);
      expect(editor.state.tr.setSelection).toHaveBeenCalled();
      expect(editor.view.dispatch).toHaveBeenCalledWith(editor.state.tr);
      expect(editor.commands.focus).toHaveBeenCalled();
      expect(editor._toolbarOpened).toBe(false);
    });
  });

  it('does not close toolbar when clicking the math node preview', async () => {
    const { getByTestId, queryByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);

    await waitFor(() => {
      expect(queryByTestId('math-toolbar')).toBeInTheDocument();
    });

    fireEvent.click(getByTestId('math-preview'));

    await waitFor(() => {
      expect(queryByTestId('math-toolbar')).toBeInTheDocument();
    });
  });

  it('does not close toolbar when clicking equation editor dropdown', async () => {
    const { queryByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);

    await waitFor(() => {
      expect(queryByTestId('math-toolbar')).toBeInTheDocument();
    });

    // Simulate MUI Select's portal dropdown container.
    const dropdown = document.createElement('div');
    dropdown.id = 'equation-editor-select-listbox';
    document.body.appendChild(dropdown);

    fireEvent.click(dropdown);

    await waitFor(() => {
      expect(queryByTestId('math-toolbar')).toBeInTheDocument();
    });

    document.body.removeChild(dropdown);
  });

  it('renders with empty latex', () => {
    const nodeWithEmptyLatex = { attrs: { latex: '' } };
    const { getByTestId } = render(<MathNodeView {...defaultProps} node={nodeWithEmptyLatex} />);
    expect(getByTestId('math-preview')).toBeInTheDocument();
  });

  it('has correct styling on NodeViewWrapper', () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} />);
    const wrapper = getByTestId('node-view-wrapper');
    expect(wrapper).toHaveStyle({ display: 'inline-flex', cursor: 'pointer' });
  });
});
