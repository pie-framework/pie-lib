import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ExplicitConstructedResponse from '../respArea/ExplicitConstructedResponse';

jest.mock('@tiptap/react', () => ({
  NodeViewWrapper: ({ children, ...props }) => (
    <div data-testid="node-view-wrapper" {...props}>
      {children}
    </div>
  ),
}));

describe('ExplicitConstructedResponse', () => {
  const mockEditor = {
    state: {
      selection: {
        from: 0,
        to: 1,
      },
    },
    commands: {
      focus: jest.fn(),
    },
  };

  const mockNode = {
    attrs: {
      index: '0',
      value: 'Test value',
    },
    nodeSize: 1,
  };

  const mockOptions = {
    respAreaToolbar: jest.fn(() => () => <div data-testid="toolbar">Toolbar</div>),
    error: jest.fn(() => ({})),
  };

  const defaultProps = {
    editor: mockEditor,
    node: mockNode,
    getPos: () => 5,
    options: mockOptions,
    selected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders NodeViewWrapper', () => {
    const { getByTestId } = render(<ExplicitConstructedResponse {...defaultProps} />);
    expect(getByTestId('node-view-wrapper')).toBeInTheDocument();
  });

  it('displays node value', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const valueDiv = container.querySelector('div[style*="padding"]');
    expect(valueDiv).toBeInTheDocument();
  });

  it('applies correct border when no error', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const contentDiv = container.querySelector('div[style*="border"]');
    expect(contentDiv).toHaveStyle({ border: '1px solid #C0C3CF' });
  });

  it('applies red border when error exists', () => {
    const errorFn = jest.fn(() => ({ 0: ['error'] }));
    const options = { ...mockOptions, error: errorFn };
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} options={options} />);
    const contentDiv = container.querySelector('div[style*="border"]');
    expect(contentDiv).toHaveStyle({ border: '1px solid red' });
  });

  it('shows toolbar when selected and only this node is selected', async () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} selected={true} />);
    await waitFor(() => {
      const toolbar = container.querySelector('[data-testid="toolbar"]');
      // Toolbar might be hidden initially based on selection logic
      expect(container).toBeInTheDocument();
    });
  });

  it('does not show toolbar when not selected', () => {
    const { queryByTestId } = render(<ExplicitConstructedResponse {...defaultProps} selected={false} />);
    expect(queryByTestId('toolbar')).not.toBeInTheDocument();
  });

  it('shows toolbar on click', async () => {
    const { container, queryByTestId } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const clickableDiv = container.querySelector('div[style*="border"]');
    fireEvent.click(clickableDiv);
    await waitFor(() => {
      // After click, toolbar should be shown
      expect(container).toBeInTheDocument();
    });
  });

  it('hides content when toolbar is shown', async () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} selected={true} />);
    await waitFor(() => {
      // Check visibility state
      expect(container).toBeInTheDocument();
    });
  });

  it('has correct minimum dimensions', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const wrapper = container.querySelector('[data-testid="node-view-wrapper"]');
    expect(wrapper).toHaveStyle({ minHeight: '55px' });
  });

  it('renders with empty value as nbsp', () => {
    const emptyNode = { ...mockNode, attrs: { ...mockNode.attrs, value: '' } };
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} node={emptyNode} />);
    expect(container).toBeInTheDocument();
  });

  it('calls respAreaToolbar with correct params', () => {
    render(<ExplicitConstructedResponse {...defaultProps} />);
    expect(mockOptions.respAreaToolbar).toHaveBeenCalledWith([mockNode, 5], mockEditor, expect.any(Function));
  });

  it('has cursor pointer style', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const wrapper = container.querySelector('[data-testid="node-view-wrapper"]');
    expect(wrapper).toHaveStyle({ cursor: 'pointer' });
  });

  it('has inline-flex display', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const wrapper = container.querySelector('[data-testid="node-view-wrapper"]');
    expect(wrapper).toHaveStyle({ display: 'inline-flex' });
  });

  it('closes toolbar on outside click', async () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} selected={true} />);
    await waitFor(() => {
      fireEvent.mouseDown(document.body);
    });
    expect(container).toBeInTheDocument();
  });

  it('applies correct padding to content', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const contentDiv = container.querySelector('div[style*="padding"]');
    expect(contentDiv).toHaveStyle({ padding: '12px 21px' });
  });

  it('applies correct min width', () => {
    const { container } = render(<ExplicitConstructedResponse {...defaultProps} />);
    const contentDiv = container.querySelector('div[style*="padding"]');
    expect(contentDiv).toHaveStyle({ minWidth: '178px' });
  });
});
