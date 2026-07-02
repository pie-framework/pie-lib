import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import { EnsureTextAfterMathPlugin, MathNode, MathNodeView, ZeroWidthSpaceHandlingPlugin } from '../math';
import * as toolbarUtils from '../../utils/toolbar';

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

    it('insertMath opens the toolbar after inserting a math node', () => {
      const setToolbarOpenedSpy = jest.spyOn(toolbarUtils, 'setToolbarOpened');
      const mathNode = { type: { name: 'math' }, nodeSize: 1 };
      const tr = {
        insert: jest.fn().mockReturnThis(),
        setSelection: jest.fn().mockReturnThis(),
        doc: {},
      };
      const editor = {
        view: {
          state: {
            schema: { nodes: { math: { create: jest.fn(() => mathNode) } } },
            selection: { $from: { pos: 1 } },
          },
        },
      };
      const dispatch = jest.fn();
      const insertMath = MathNode.addCommands().insertMath('x^2');

      insertMath({ tr, editor, dispatch });

      expect(tr.insert).toHaveBeenCalledWith(1, mathNode);
      expect(tr.setSelection).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(tr);
      expect(setToolbarOpenedSpy).toHaveBeenCalledWith(editor, true);

      setToolbarOpenedSpy.mockRestore();
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
  const createDocWithMathAndZwsp = (resolveOverrides = {}) => ({
    resolve: jest.fn((pos) => ({
      nodeAfter: null,
      nodeBefore: null,
      pos,
      ...resolveOverrides[pos],
    })),
    nodeAt: jest.fn((pos) => {
      if (pos === 1) {
        return { type: { name: 'text' }, textContent: '\u200b' };
      }
      if (pos === 0) {
        return { type: { name: 'math' }, nodeSize: 1 };
      }
      return null;
    }),
  });

  const createDocWithRegularTextBeforeCursor = () => ({
    resolve: jest.fn((pos) => ({ nodeAfter: null, nodeBefore: null, pos })),
    nodeAt: jest.fn((pos) => {
      if (pos === 1) {
        return { type: { name: 'text' }, textContent: 'a' };
      }
      return null;
    }),
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
        doc: createDocWithMathAndZwsp(),
        tr,
        ...stateOverrides,
      },
      dispatch,
    };
  };

  describe('Backspace', () => {
    it('deletes the inline node and zero-width space before the cursor', () => {
      const view = createView();
      const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'Backspace' });

      expect(handled).toBe(true);
      expect(view.state.tr.delete).toHaveBeenCalledWith(0, 2);
      expect(view.dispatch).toHaveBeenCalledWith(view.state.tr);
    });

    it('returns false when regular text precedes the cursor', () => {
      const view = createView({
        state: {
          doc: createDocWithRegularTextBeforeCursor(),
        },
      });

      const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'Backspace' });

      expect(handled).toBe(false);
      expect(view.state.tr.delete).not.toHaveBeenCalled();
      expect(view.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('ArrowLeft', () => {
    it('selects the inline node before a zero-width space', () => {
      const mathNode = { nodeSize: 3 };
      const view = createView({
        state: {
          doc: createDocWithMathAndZwsp({
            0: { nodeAfter: mathNode, nodeBefore: null, pos: 0 },
          }),
        },
      });
      const { NodeSelection } = require('prosemirror-state');

      const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'ArrowLeft' });

      expect(handled).toBe(true);
      expect(view.state.doc.resolve).toHaveBeenCalledWith(0);
      expect(NodeSelection.create).toHaveBeenCalledWith(view.state.doc, 0);
      expect(view.dispatch).toHaveBeenCalled();
    });

    it('moves the text cursor before the zero-width space when no inline node precedes it', () => {
      const view = createView();
      const { TextSelection } = require('prosemirror-state');

      const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'ArrowLeft' });

      expect(handled).toBe(true);
      expect(view.state.doc.resolve).toHaveBeenCalledWith(0);
      expect(TextSelection.create).toHaveBeenCalledWith(view.state.doc, 0);
      expect(view.dispatch).toHaveBeenCalled();
    });

    it('returns false when regular text precedes the cursor', () => {
      const view = createView({
        state: {
          doc: createDocWithRegularTextBeforeCursor(),
        },
      });

      const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'ArrowLeft' });

      expect(handled).toBe(false);
      expect(view.state.tr.setSelection).not.toHaveBeenCalled();
      expect(view.dispatch).not.toHaveBeenCalled();
    });
  });

  it('returns false for unrelated keys', () => {
    const view = createView();

    const handled = ZeroWidthSpaceHandlingPlugin.props.handleKeyDown(view, { key: 'Enter' });
    expect(handled).toBe(false);
  });
});

describe('MathNodeView', () => {
  const createEditorElement = (rect = { top: 0, left: 0, width: 600, height: 400 }) => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'getBoundingClientRect', {
      value: jest.fn(() => rect),
      configurable: true,
    });
    return element;
  };

  const createMockEditor = () => ({
    state: {
      selection: {
        from: 0,
        to: 1,
        node: { type: { name: 'math' } },
      },
      tr: {
        setSelection: jest.fn().mockReturnThis(),
        setMeta: jest.fn().mockReturnThis(),
      },
      doc: {},
    },
    view: {
      coordsAtPos: jest.fn(() => ({ top: 100, left: 50 })),
      dispatch: jest.fn(),
    },
    options: {
      element: createEditorElement(),
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
    nodeSize: 1,
  };

  let defaultProps;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreatePortal.mockImplementation((node) => node);
    defaultProps = {
      node: mockNode,
      updateAttributes: jest.fn(),
      editor: createMockEditor(),
      selected: false,
      options: {},
      getPos: jest.fn(() => 0),
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
    it('positions relative to portal container using coordsAtPos', async () => {
      const { container } = render(<MathNodeView {...defaultProps} selected={true} />);
      await waitFor(() => {
        const toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar.style.top).toBe('100px');
        expect(toolbar.style.left).toBe('50px');
      });
    });

    it('offsets position by portal container getBoundingClientRect', async () => {
      const containerEl = document.createElement('div');
      containerEl.getBoundingClientRect = jest.fn(() => ({ top: 100, left: 50, width: 600, height: 400 }));

      const editor = {
        ...defaultProps.editor,
        _tiptapContainerEl: containerEl,
      };

      const { container } = render(<MathNodeView {...defaultProps} editor={editor} selected={true} />);
      await waitFor(() => {
        const toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar.style.top).toBe('0px');
        expect(toolbar.style.left).toBe('0px');
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

    it('renders above other editor overlays with a high z-index', async () => {
      const { container } = render(<MathNodeView {...defaultProps} selected={true} />);
      await waitFor(() => {
        const toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar.style.zIndex).toBe('1000');
      });
    });

    it('updates position from coordsAtPos when selection changes', async () => {
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
        expect(toolbar.style.top).toBe('200px');
        expect(toolbar.style.left).toBe('150px');
      });
    });

    it('clamps toolbar position to viewport margins', async () => {
      const originalInnerHeight = window.innerHeight;
      const originalInnerWidth = window.innerWidth;

      Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 200 });
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 300 });

      const editor = {
        ...defaultProps.editor,
        view: {
          ...defaultProps.editor.view,
          coordsAtPos: jest.fn(() => ({ top: 190, left: 280, bottom: 195 })),
          dispatch: jest.fn(),
        },
      };

      const { container } = render(<MathNodeView {...defaultProps} editor={editor} selected={true} />);

      let toolbar;
      await waitFor(() => {
        toolbar = container.querySelector('[data-toolbar-for]');
        expect(toolbar).toBeInTheDocument();
      });

      Object.defineProperty(toolbar, 'offsetHeight', { configurable: true, value: 100 });
      Object.defineProperty(toolbar, 'offsetWidth', { configurable: true, value: 150 });

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
        await new Promise((resolve) => requestAnimationFrame(resolve));
      });

      await waitFor(() => {
        expect(parseInt(toolbar.style.top, 10)).toBeLessThanOrEqual(200 - 100 - 8);
        expect(parseInt(toolbar.style.left, 10)).toBeLessThanOrEqual(300 - 150 - 8);
        expect(parseInt(toolbar.style.top, 10)).toBeGreaterThanOrEqual(8);
        expect(parseInt(toolbar.style.left, 10)).toBeGreaterThanOrEqual(8);
      });

      Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: originalInnerHeight });
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: originalInnerWidth });
    });

    it('attaches scroll and resize listeners while toolbar is open', async () => {
      const addSpy = jest.spyOn(window, 'addEventListener');
      render(<MathNodeView {...defaultProps} selected={true} />);
      await waitFor(() => {
        expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
        expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      });
      addSpy.mockRestore();
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

  it('unsets editor._toolbarOpened when toolbar is closed and node is not selected', async () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} selected={false} />);

    fireEvent.click(getByTestId('math-preview'));

    await waitFor(() => {
      expect(getByTestId('math-toolbar')).toBeInTheDocument();
      expect(defaultProps.editor._toolbarOpened).toBe(true);
    });

    fireEvent.click(getByTestId('done-button'));

    await waitFor(() => {
      expect(defaultProps.editor._toolbarOpened).toBe(false);
    });
  });

  it('keeps editor._toolbarOpened true while the math node remains selected', async () => {
    const { getByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);

    await waitFor(() => {
      expect(getByTestId('done-button')).toBeInTheDocument();
      expect(defaultProps.editor._toolbarOpened).toBe(true);
    });

    fireEvent.click(getByTestId('done-button'));

    await waitFor(() => {
      expect(defaultProps.editor._toolbarOpened).toBe(true);
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
      expect(editor._toolbarOpened).toBe(true);
    });
  });

  it('re-registers click listener when node changes', async () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const nodeA = { attrs: { latex: 'x^2' } };
    const nodeB = { attrs: { latex: 'y^2' } };

    const { rerender } = render(<MathNodeView {...defaultProps} node={nodeA} selected={true} />);

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    const initialCallCount = addEventListenerSpy.mock.calls.length;

    rerender(<MathNodeView {...defaultProps} node={nodeB} selected={true} />);

    await waitFor(() => {
      expect(removeEventListenerSpy).toHaveBeenCalled();
      expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
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

  describe('unique math-node class per instance', () => {
    let dateNowSpy;

    beforeEach(() => {
      let timestamp = 1000;
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => timestamp++);
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    it('assigns a timestamp-based class to NodeViewWrapper', () => {
      const { getByTestId } = render(<MathNodeView {...defaultProps} />);
      const wrapper = getByTestId('node-view-wrapper');

      expect(wrapper.className).toMatch(/^math-node-\d+$/);
    });

    it('assigns a different class to each MathNodeView instance', () => {
      const { getAllByTestId } = render(
        <>
          <MathNodeView {...defaultProps} />
          <MathNodeView {...defaultProps} node={{ attrs: { latex: 'y^2' } }} />
        </>,
      );

      const wrappers = getAllByTestId('node-view-wrapper');
      expect(wrappers[0].className).toBe('math-node-1000');
      expect(wrappers[1].className).toBe('math-node-1001');
    });

    it('closes toolbar when clicking a different math node', async () => {
      const updateAttributes = jest.fn();
      const editorA = createMockEditor();
      const editorB = createMockEditor();

      const { getAllByTestId, queryAllByTestId } = render(
        <>
          <MathNodeView {...defaultProps} editor={editorA} updateAttributes={updateAttributes} selected={false} />
          <MathNodeView {...defaultProps} editor={editorB} node={{ attrs: { latex: 'y^2' } }} selected={false} />
        </>,
      );

      fireEvent.click(getAllByTestId('math-preview')[0]);

      await waitFor(() => {
        expect(queryAllByTestId('math-toolbar')).toHaveLength(1);
      });

      const secondPreview = getAllByTestId('math-preview')[1];
      fireEvent.click(secondPreview);

      await waitFor(() => {
        expect(queryAllByTestId('math-toolbar')).toHaveLength(1);
        expect(updateAttributes).toHaveBeenCalledWith({ latex: 'x^2' });
        expect(editorA._toolbarOpened).toBe(false);
        expect(getAllByTestId('math-input')[0]).toHaveValue('y^2');
      });
    });
  });

  describe('selection-based toolbar guard', () => {
    it('opens toolbar when selected transitions to true and the editor has a NodeSelection on math', async () => {
      const { queryByTestId, rerender } = render(<MathNodeView {...defaultProps} selected={false} />);
      expect(queryByTestId('math-toolbar')).not.toBeInTheDocument();

      rerender(<MathNodeView {...defaultProps} selected={true} />);
      await waitFor(() => {
        expect(queryByTestId('math-toolbar')).toBeInTheDocument();
      });
    });

    it('does not open toolbar when selected briefly becomes true but editor selection has no node (Cmd+A / drag case)', async () => {
      const editor = {
        ...defaultProps.editor,
        state: {
          ...defaultProps.editor.state,
          selection: { from: 0, to: 100 }, // no .node — TextSelection / AllSelection shape
        },
      };

      const { queryByTestId, rerender } = render(
        <MathNodeView {...defaultProps} editor={editor} selected={false} />,
      );
      rerender(<MathNodeView {...defaultProps} editor={editor} selected={true} />);

      await act(async () => {});
      expect(queryByTestId('math-toolbar')).not.toBeInTheDocument();
    });

    it('does not open toolbar when selected briefly becomes true but NodeSelection targets a non-math node', async () => {
      const editor = {
        ...defaultProps.editor,
        state: {
          ...defaultProps.editor.state,
          selection: { from: 0, to: 1, node: { type: { name: 'image' } } },
        },
      };

      const { queryByTestId, rerender } = render(
        <MathNodeView {...defaultProps} editor={editor} selected={false} />,
      );
      rerender(<MathNodeView {...defaultProps} editor={editor} selected={true} />);

      await act(async () => {});
      expect(queryByTestId('math-toolbar')).not.toBeInTheDocument();
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
