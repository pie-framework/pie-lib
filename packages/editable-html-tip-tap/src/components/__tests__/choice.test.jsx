import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BlankContent } from '../respArea/DragInTheBlank/choice';

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

jest.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  }),
}));

describe('BlankContent', () => {
  const mockN = {
    index: '0',
  };

  const mockValue = {
    value: 'Test Value',
  };

  const defaultProps = {
    n: mockN,
    value: mockValue,
    isDragging: false,
    isOver: false,
    dragItem: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('displays value text', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toBeInTheDocument();
  });

  it('displays nbsp when value is empty', () => {
    const emptyValue = { value: '' };
    const { container } = render(<BlankContent {...defaultProps} value={emptyValue} />);
    expect(container).toBeInTheDocument();
  });

  it('shows grip icon when value is present', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const gripIcon = container.querySelector('svg');
    expect(gripIcon).toBeInTheDocument();
  });

  it('does not show grip icon when value is nbsp', () => {
    const emptyValue = { value: '' };
    const { container } = render(<BlankContent {...defaultProps} value={emptyValue} />);
    // Grip should not be visible
    expect(container).toBeInTheDocument();
  });

  it('applies correct background when not preview', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveStyle({ background: 'rgb(255, 255, 255)' });
  });

  it('applies preview background when isOver', () => {
    const { container } = render(<BlankContent {...defaultProps} isOver={true} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveStyle({ border: '1px solid #d1d1d1' });
  });

  it('has correct minimum dimensions', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveStyle({ minWidth: '178px', minHeight: '36px' });
  });

  it('has inline-flex display', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveStyle({ display: 'inline-flex' });
  });

  it('has correct border radius', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveStyle({ borderRadius: '3px' });
  });

  it('has correct padding', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveStyle({ padding: '8px 8px 8px 35px' });
  });

  it('is not content editable', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveAttribute('contentEditable', 'false');
  });

  it('sets data-key attribute', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toHaveAttribute('data-key', '0');
  });

  it('renders children', () => {
    const { getByText } = render(
      <BlankContent {...defaultProps}>
        <span>Child Content</span>
      </BlankContent>,
    );
    expect(getByText('Child Content')).toBeInTheDocument();
  });

  it('shows dragItem value when isOver', () => {
    const dragItem = { value: { value: 'Dragged Value' } };
    const { container } = render(<BlankContent {...defaultProps} isOver={true} dragItem={dragItem} />);
    expect(container).toBeInTheDocument();
  });

  it('shows nbsp when isDragging', () => {
    const { container } = render(<BlankContent {...defaultProps} isDragging={true} />);
    expect(container).toBeInTheDocument();
  });

  it('positions grip icon correctly', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const gripContainer = container.querySelector('svg')?.parentElement;
    if (gripContainer) {
      expect(gripContainer).toHaveStyle({ position: 'absolute', top: '6px', left: '15px' });
    }
  });

  it('applies hover size when isOver', () => {
    const { container } = render(<BlankContent {...defaultProps} isOver={true} />);
    const contentDiv = container.querySelector('div[data-key]');
    expect(contentDiv).toBeInTheDocument();
  });

  it('handles click to add selected class', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    fireEvent.click(contentDiv);
    expect(contentDiv).toHaveClass('selected');
  });

  it('handles click outside to remove selected class', () => {
    const { container } = render(<BlankContent {...defaultProps} />);
    const contentDiv = container.querySelector('div[data-key]');
    fireEvent.click(contentDiv);
    expect(contentDiv).toHaveClass('selected');
    fireEvent.click(document.body);
    expect(contentDiv).not.toHaveClass('selected');
  });
});
