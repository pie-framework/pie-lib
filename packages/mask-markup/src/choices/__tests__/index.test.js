import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Choice from '../choice';
import { choice } from '../../__tests__/utils';
import Choices from '../index';

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

// Mock @dnd-kit hooks to avoid DndContext requirement
jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  })),
}));

describe('index', () => {
  describe('Choices', () => {
    const defaultProps = {
      disabled: false,
      choices: [choice('Jumped', '0'), choice('Laughed', '1'), choice('Spoon', '2')],
      choicePosition: 'below',
      instanceId: 'test-instance',
    };

    it('renders correctly with default props', () => {
      const { container } = render(<Choices {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Jumped')).toBeInTheDocument();
      expect(screen.getByText('Laughed')).toBeInTheDocument();
      expect(screen.getByText('Spoon')).toBeInTheDocument();
    });

    it('renders correctly with disabled prop as true', () => {
      const { container } = render(<Choices {...defaultProps} disabled={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without duplicates', () => {
      const { container } = render(<Choices {...defaultProps} duplicates={undefined} value={{ 0: '0', 1: '1' }} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with duplicates', () => {
      const { container } = render(<Choices {...defaultProps} duplicates={true} value={{ 0: '0', 1: '1' }} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    describe('click-to-place into the pool', () => {
      it('places the selection into the pool when clicking the pool background', () => {
        const onPlacementClick = jest.fn();
        const selectedItem = { id: 'some-blank', fromChoice: false, type: 'MaskBlank' };
        const { container } = render(
          <Choices {...defaultProps} selectedItem={selectedItem} onPlacementClick={onPlacementClick} />,
        );

        fireEvent.click(container.firstChild);

        expect(onPlacementClick).toHaveBeenCalledWith(undefined);
      });

      it('does nothing when clicking the pool background with nothing selected', () => {
        const onPlacementClick = jest.fn();
        const { container } = render(<Choices {...defaultProps} onPlacementClick={onPlacementClick} />);

        fireEvent.click(container.firstChild);

        expect(onPlacementClick).not.toHaveBeenCalled();
      });

      it('clicking a specific choice selects it, not the pool background handler', () => {
        const onPlacementClick = jest.fn();
        const onSelectClick = jest.fn();
        const selectedItem = { id: 'some-blank', fromChoice: false, type: 'MaskBlank' };
        render(
          <Choices
            {...defaultProps}
            selectedItem={selectedItem}
            onSelectClick={onSelectClick}
            onPlacementClick={onPlacementClick}
          />,
        );

        fireEvent.click(screen.getByText('Jumped'));

        expect(onSelectClick).toHaveBeenCalled();
        expect(onPlacementClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('Choice', () => {
    const defaultProps = {
      disabled: false,
      choice: choice('Label', '1'),
      instanceId: 'test-instance',
    };

    describe('render', () => {
      it('renders correctly with default props', () => {
        const { container } = render(<Choice {...defaultProps} />);
        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText('Label')).toBeInTheDocument();
      });

      it('renders correctly with disabled prop as true', () => {
        const { container } = render(<Choice {...defaultProps} disabled={true} />);
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    describe('fraction math styling', () => {
      it('enlarges numerator/denominator digits adjacent to a fraction to 120%', () => {
        render(<Choice {...defaultProps} />);
        // The new rule targets mjx-mn digits that sit next to an mjx-mfrac.
        const rule = collectEmotionRules().find((r) => r.includes('mjx-mn') && r.includes('mjx-mfrac'));
        expect(rule).toBeDefined();
        expect(rule).toMatch(/mjx-mn:has\(~\s*mjx-mfrac\)/);
        expect(rule).toMatch(/mjx-mfrac\s*~\s*mjx-mn/);
        expect(rule).toMatch(/font-size:\s*120%\s*!important/i);
      });

      it('keeps the existing mjx-frac 120% rule', () => {
        render(<Choice {...defaultProps} />);
        const rule = collectEmotionRules().find((r) => /(^|[^-])mjx-frac/.test(r) && !r.includes('mjx-mfrac'));
        expect(rule).toBeDefined();
        expect(rule).toMatch(/font-size:\s*120%\s*!important/i);
      });
    });

    describe('click-to-select', () => {
      it('selects this choice on click when nothing else is selected', () => {
        const onSelectClick = jest.fn();
        const { container } = render(<Choice {...defaultProps} selectedItem={null} onSelectClick={onSelectClick} />);

        fireEvent.click(container.firstChild);

        expect(onSelectClick).toHaveBeenCalledWith({
          choice: defaultProps.choice,
          instanceId: defaultProps.instanceId,
          fromChoice: true,
          type: 'MaskBlank',
        });
      });

      it('toggles off (calls onSelectClick again) when clicking the already-selected choice', () => {
        const onSelectClick = jest.fn();
        const selectedItem = { choice: defaultProps.choice, instanceId: defaultProps.instanceId, fromChoice: true, type: 'MaskBlank' };
        const { container } = render(
          <Choice {...defaultProps} selectedItem={selectedItem} onSelectClick={onSelectClick} />,
        );

        fireEvent.click(container.firstChild);

        expect(onSelectClick).toHaveBeenCalledWith({
          choice: defaultProps.choice,
          instanceId: defaultProps.instanceId,
          fromChoice: true,
          type: 'MaskBlank',
        });
      });

      it('selects this choice even while a different item is already selected (pool items are never placement targets)', () => {
        const onSelectClick = jest.fn();
        const selectedItem = { id: 'some-blank', fromChoice: false, type: 'MaskBlank' };
        const { container } = render(
          <Choice {...defaultProps} selectedItem={selectedItem} onSelectClick={onSelectClick} />,
        );

        fireEvent.click(container.firstChild);

        expect(onSelectClick).toHaveBeenCalledWith({
          choice: defaultProps.choice,
          instanceId: defaultProps.instanceId,
          fromChoice: true,
          type: 'MaskBlank',
        });
      });

      it('does nothing on click when disabled', () => {
        const onSelectClick = jest.fn();
        const { container } = render(
          <Choice {...defaultProps} disabled={true} selectedItem={null} onSelectClick={onSelectClick} />,
        );

        fireEvent.click(container.firstChild);

        expect(onSelectClick).not.toHaveBeenCalled();
      });
    });
  });
});
