import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Choice from '../choice';
import { choice } from '../../__tests__/utils';
import Choices from '../index';

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
  });
});
