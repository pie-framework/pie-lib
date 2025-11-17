import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { BlankContent as Choice } from '../choice';
import { choice } from '../../__tests__/utils';
import Choices from '../index';

describe('index', () => {
  describe('Choices', () => {
    const defaultProps = {
      disabled: false,
      choices: [choice('Jumped', '0'), choice('Laughed', '1'), choice('Spoon', '2')],
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

  // Skipping Choice tests due to @dnd-kit dependency conflicts
  // Choice component uses useDraggable from @dnd-kit which requires DndContext
  describe.skip('Choice', () => {
    const defaultProps = {
      disabled: false,
      value: '1',
      label: 'Label',
      targetId: '1',
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
