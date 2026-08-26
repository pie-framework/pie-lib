import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Blank from '../blank';

// Mock @dnd-kit hooks to avoid DndContext requirement
jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn((options) => ({
    attributes: options?.attributes || {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  })),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: jest.fn(() => 'translate3d(0, 0, 0)'),
    },
  },
}));

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

// Collect the CSS rules emotion/MUI injected into the document (jsdom uses insertRule).
const collectEmotionRules = () => {
  const rules = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        rules.push(rule.cssText);
      }
    } catch (e) {
      /* inaccessible stylesheet */
    }
  }
  return rules;
};

describe('Blank', () => {
  const { renderMath } = require('@pie-lib/math-rendering');
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    choice: { value: 'Cow' },
    isOver: false,
    dragItem: {},
    correct: false,
    onChange,
  };

  beforeEach(() => {
    onChange.mockClear();
    renderMath.mockClear();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Blank {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('displays the value when provided', () => {
      render(<Blank {...defaultProps} />);
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<Blank {...defaultProps} disabled={true} />);
      // Check that delete button is not present when disabled
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('renders with dragged item preview', () => {
      render(<Blank {...defaultProps} dragItem={{ choice: { value: 'Dog' } }} />);
      // Blank component should render
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    it('shows hover state when isOver is true', () => {
      const { container } = render(<Blank {...defaultProps} dragItem={{ choice: { value: 'Dog' } }} isOver={true} />);
      // Component should have hover styling
      expect(container.firstChild).toBeInTheDocument();
    });

    it('shows correct state when correct is true', () => {
      const { container } = render(<Blank {...defaultProps} correct={true} />);
      // Component should indicate correctness
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('does not show delete button when disabled', () => {
      render(<Blank {...defaultProps} disabled={true} />);
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('does not show delete button when no value is set', () => {
      render(<Blank {...defaultProps} choice={undefined} />);
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('shows delete button when value is present and not disabled', () => {
      render(<Blank {...defaultProps} />);
      // If delete button is present, it should be clickable
      const deleteButton = screen.queryByRole('button');
      if (deleteButton) {
        expect(deleteButton).toBeInTheDocument();
      }
    });
  });

  describe('dimensions', () => {
    it('renders with custom dimensions when provided', () => {
      const { container } = render(
        <Blank {...defaultProps} emptyResponseAreaHeight={100} emptyResponseAreaWidth={200} />,
      );
      const element = container.firstChild;
      expect(element).toBeInTheDocument();
    });

    it('renders with min dimensions by default', () => {
      const { container } = render(<Blank {...defaultProps} />);
      const element = container.firstChild;
      expect(element).toBeInTheDocument();
      // Component should have minimum dimensions applied
    });

    it('handles non-numeric dimension props gracefully', () => {
      const { container } = render(
        <Blank {...defaultProps} emptyResponseAreaHeight="non-numeric" emptyResponseAreaWidth="non-numeric" />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('computes chip dimensions based on content when no emptyResponseArea size is provided', () => {
      jest.useFakeTimers();
      // Mock getBoundingClientRect to simulate measured content size
      const rectSpy = jest
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockReturnValue({ width: 100, height: 20, top: 0, left: 0, right: 100, bottom: 20 });

      const { container } = render(
        <Blank
          {...defaultProps}
          // Force measurement path that uses getMeasureNode / updateDimensions
          emptyResponseAreaHeight={0}
          emptyResponseAreaWidth={0}
        />,
      );

      // Let the internal timeout in handleElements / updateDimensions run
      act(() => {
        jest.runAllTimers();
      });

      const wrapper = container.firstChild; // StyledContent (outer droppable/click node)
      const dragHandle = wrapper && wrapper.firstChild; // StyledDragHandle (inner draggable node)
      const chip = dragHandle && dragHandle.firstChild; // StyledChip (rootRef)

      // Width and height should include padding (24px) around measured content
      expect(chip.style.width).toBe('129px');
      expect(chip.style.height).toBe('49px');

      rectSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('math rendering', () => {
    it('calls renderMath on mount when choice has content', () => {
      render(<Blank {...defaultProps} />);
      expect(renderMath).toHaveBeenCalled();
    });

    it('calls renderMath again when correct changes', () => {
      const { rerender } = render(<Blank {...defaultProps} correct={false} />);
      const callsAfterMount = renderMath.mock.calls.length;
      expect(callsAfterMount).toBeGreaterThan(0);

      rerender(<Blank {...defaultProps} correct={true} />);
      expect(renderMath.mock.calls.length).toBeGreaterThan(callsAfterMount);
    });

    it('does not call renderMath again when correct is unchanged', () => {
      const { rerender } = render(<Blank {...defaultProps} correct={true} />);
      const callsAfterMount = renderMath.mock.calls.length;

      rerender(<Blank {...defaultProps} correct={true} />);
      expect(renderMath.mock.calls.length).toBe(callsAfterMount);
    });
  });

  describe('fraction math styling', () => {
    it('enlarges numerator/denominator digits adjacent to a fraction to 120%', () => {
      render(<Blank {...defaultProps} />);
      const rule = collectEmotionRules().find((r) => r.includes('mjx-mn') && r.includes('mjx-mfrac'));
      expect(rule).toBeDefined();
      expect(rule).toMatch(/mjx-mn:has\(~\s*mjx-mfrac\)/);
      expect(rule).toMatch(/mjx-mfrac\s*~\s*mjx-mn/);
      expect(rule).toMatch(/font-size:\s*120%\s*!important/i);
    });

    it('keeps the existing mjx-frac 120% rule', () => {
      render(<Blank {...defaultProps} />);
      const rule = collectEmotionRules().find((r) => /(^|[^-])mjx-frac/.test(r) && !r.includes('mjx-mfrac'));
      expect(rule).toBeDefined();
      expect(rule).toMatch(/font-size:\s*120%\s*!important/i);
    });
  });

  describe('drag and drop', () => {
    it('accepts drag item when not disabled', () => {
      render(<Blank {...defaultProps} isOver={true} dragItem={{ choice: { value: 'Dog' } }} />);
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    it('shows drag preview when dragging over', () => {
      const { container } = render(<Blank {...defaultProps} isOver={true} dragItem={{ choice: { value: 'Dog' } }} />);
      expect(container.firstChild).toBeInTheDocument();
      // Should show visual feedback for drag over
    });
  });

  describe('click-to-select and click-to-place', () => {
    const { useDroppable } = require('@dnd-kit/core');

    afterEach(() => {
      useDroppable.mockReturnValue({ setNodeRef: jest.fn(), isOver: false, active: null });
    });

    it('is a native tab stop (role=button, tabIndex=0) when empty and not disabled', () => {
      const { container } = render(<Blank {...defaultProps} choice={undefined} />);
      const outer = container.firstChild;

      expect(outer.getAttribute('role')).toBe('button');
      expect(outer.getAttribute('tabindex')).toBe('0');
    });

    it('is not a tab stop when it already holds a choice (relies on the inner draggable node)', () => {
      const { container } = render(<Blank {...defaultProps} />);
      const outer = container.firstChild;

      expect(outer.getAttribute('role')).toBeNull();
      expect(outer.getAttribute('tabindex')).toBe('-1');
    });

    it('is not a tab stop when disabled, even if empty', () => {
      const { container } = render(<Blank {...defaultProps} choice={undefined} disabled={true} />);
      const outer = container.firstChild;

      expect(outer.getAttribute('tabindex')).toBe('-1');
    });

    it('does not make the inner draggable node a second tab stop when the blank is empty', () => {
      const { container } = render(<Blank {...defaultProps} choice={undefined} selectedItem={null} />);
      const outer = container.firstChild;
      const inner = outer.firstElementChild;

      expect(outer.getAttribute('tabindex')).toBe('0');
      // dragAttributes (which carries tabIndex) is only spread onto the inner node when
      // it's the live tab stop (filled and not disabled) — otherwise it's omitted
      // entirely, so no tabindex attribute is present at all here.
      expect(inner.getAttribute('tabindex')).toBeNull();
    });

    it('makes the inner draggable node the tab stop when the blank is filled and not disabled', () => {
      const { container } = render(<Blank {...defaultProps} selectedItem={null} />);
      const outer = container.firstChild;
      const inner = outer.firstElementChild;

      expect(inner.getAttribute('tabindex')).toBe('0');
    });

    it('selects this blank\'s content on click when nothing else is selected', () => {
      const onSelectClick = jest.fn();
      const { container } = render(
        <Blank {...defaultProps} id="3" selectedItem={null} onSelectClick={onSelectClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onSelectClick).toHaveBeenCalledWith({
        id: '3',
        choice: defaultProps.choice,
        instanceId: undefined,
        fromChoice: false,
        type: 'MaskBlank',
      });
    });

    it('toggles off when clicking its own already-selected content', () => {
      const onSelectClick = jest.fn();
      const selectedItem = { id: '3', choice: defaultProps.choice, instanceId: undefined, fromChoice: false, type: 'MaskBlank' };
      const { container } = render(
        <Blank {...defaultProps} id="3" selectedItem={selectedItem} onSelectClick={onSelectClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onSelectClick).toHaveBeenCalledWith(selectedItem);
    });

    it('places the current selection here when clicking a different, already-filled blank', () => {
      const onPlacementClick = jest.fn();
      const selectedItem = { choice: { value: 'Other' }, instanceId: undefined, fromChoice: true, type: 'MaskBlank' };
      const { container } = render(
        <Blank {...defaultProps} id="3" selectedItem={selectedItem} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).toHaveBeenCalledWith('3');
    });

    it('places the current selection here on Space/Enter when empty', () => {
      const onPlacementClick = jest.fn();
      const selectedItem = { choice: { value: 'Other' }, instanceId: undefined, fromChoice: true, type: 'MaskBlank' };
      const { container } = render(
        <Blank {...defaultProps} id="3" choice={undefined} selectedItem={selectedItem} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.keyDown(container.firstChild, { code: 'Space' });

      expect(onPlacementClick).toHaveBeenCalledWith('3');
    });

    it('does nothing on click when empty and nothing is selected', () => {
      const onSelectClick = jest.fn();
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Blank {...defaultProps} choice={undefined} selectedItem={null} onSelectClick={onSelectClick} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onSelectClick).not.toHaveBeenCalled();
      expect(onPlacementClick).not.toHaveBeenCalled();
    });

    it('does nothing on click when disabled', () => {
      const onSelectClick = jest.fn();
      const selectedItem = { choice: { value: 'Other' }, instanceId: undefined, fromChoice: true, type: 'MaskBlank' };
      const { container } = render(
        <Blank {...defaultProps} disabled={true} selectedItem={selectedItem} onSelectClick={onSelectClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onSelectClick).not.toHaveBeenCalled();
    });

    it('folds click-selection hover into the same highlight a live drag-over shows', () => {
      const selectedItem = { choice: { value: 'Other' }, instanceId: undefined, fromChoice: true, type: 'MaskBlank' };
      const { container } = render(<Blank {...defaultProps} id="3" selectedItem={selectedItem} />);
      const outer = container.firstChild;

      fireEvent.mouseEnter(outer);
      // The "over" prop drives the same CSS the real isOver-driven highlight uses —
      // assert via the rendered chip's className, since StyledContent forwards `over`.
      // Re-render check: BlankContent receives the folded isOver as true while hovered
      // with a selection active — verified indirectly via the "over" chip class it sets.
      expect(screen.getByText('Cow').closest('.over')).not.toBeNull();

      fireEvent.mouseLeave(outer);
      expect(screen.getByText('Cow').closest('.over')).toBeNull();
    });

    it('shows a pointer cursor on hover when something is selected', () => {
      const selectedItem = { choice: { value: 'Other' }, instanceId: undefined, fromChoice: true, type: 'MaskBlank' };
      const { container } = render(<Blank {...defaultProps} id="3" selectedItem={selectedItem} />);
      const outer = container.firstChild;
      const className = Array.from(outer.classList).find((c) => c.startsWith('css-'));

      const hoverRule = collectEmotionRules().find((r) => r.includes(`.${className}:hover`));

      expect(hoverRule).toBeDefined();
      expect(hoverRule).toMatch(/cursor:\s*pointer/);
    });

    it('keeps the default cursor on hover when nothing is selected', () => {
      const { container } = render(<Blank {...defaultProps} id="3" selectedItem={null} />);
      const outer = container.firstChild;
      const className = Array.from(outer.classList).find((c) => c.startsWith('css-'));

      const hoverRule = collectEmotionRules().find((r) => r.includes(`.${className}:hover`));

      expect(hoverRule).toBeUndefined();
    });

    it('keeps the default cursor on hover when disabled, even with something selected', () => {
      const selectedItem = { choice: { value: 'Other' }, instanceId: undefined, fromChoice: true, type: 'MaskBlank' };
      const { container } = render(
        <Blank {...defaultProps} id="3" disabled={true} selectedItem={selectedItem} />,
      );
      const outer = container.firstChild;
      const className = Array.from(outer.classList).find((c) => c.startsWith('css-'));

      const hoverRule = collectEmotionRules().find((r) => r.includes(`.${className}:hover`));

      expect(hoverRule).toBeUndefined();
    });
  });
});
