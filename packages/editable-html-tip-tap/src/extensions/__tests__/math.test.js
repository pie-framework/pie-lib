import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { MathNode, MathNodeView } from '../math';

jest.mock('@tiptap/react', () => ({
  NodeViewWrapper: ({ children, ...props }) => (
    <div data-testid="node-view-wrapper" {...props}>
      {children}
    </div>
  ),
  ReactNodeViewRenderer: jest.fn((component) => component),
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
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

  it('renders toolbar with correct position', async () => {
    const { container } = render(<MathNodeView {...defaultProps} selected={true} />);
    await waitFor(() => {
      const toolbar = container.querySelector('[data-toolbar-for]');
      expect(toolbar).toBeInTheDocument();
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

  it('closes toolbar on outside click', async () => {
    const { queryByTestId } = render(<MathNodeView {...defaultProps} selected={true} />);

    await waitFor(() => {
      expect(queryByTestId('math-toolbar')).toBeInTheDocument();
    });

    fireEvent.click(document.body);

    await waitFor(() => {
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
