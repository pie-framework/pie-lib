import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import { MatchListDroppable } from '../match-list-dp';

// Mock DroppablePlaceholder
jest.mock('../droppable-placeholder', () => ({
  DroppablePlaceholder: ({ id, children, disabled, ...rest }) => (
    <div
      data-testid="droppable-placeholder"
      data-id={id}
      data-disabled={disabled}
      data-rest={JSON.stringify(rest)}
    >
      {children}
    </div>
  ),
}));

describe('MatchListDroppable', () => {
  const defaultProps = {
    id: 'match-list-drop-1',
    children: <div data-testid="child-content">Match List Content</div>,
  };

  describe('rendering', () => {
    it('should render children correctly', () => {
      renderWithTheme(<MatchListDroppable {...defaultProps} />);
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Match List Content')).toBeInTheDocument();
    });

    it('should render DroppablePlaceholder', () => {
      renderWithTheme(<MatchListDroppable {...defaultProps} />);
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
    });

    it('should render with string children', () => {
      renderWithTheme(<MatchListDroppable id="ml-1">Simple text</MatchListDroppable>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('should render with multiple children', () => {
      renderWithTheme(
        <MatchListDroppable id="ml-1">
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </MatchListDroppable>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should render with null children', () => {
      renderWithTheme(<MatchListDroppable id="ml-1">{null}</MatchListDroppable>);
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
    });
  });

  describe('DroppablePlaceholder props', () => {
    it('should pass id to DroppablePlaceholder', () => {
      renderWithTheme(<MatchListDroppable {...defaultProps} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', 'match-list-drop-1');
    });

    it('should pass numeric id to DroppablePlaceholder', () => {
      renderWithTheme(<MatchListDroppable id={456}>Content</MatchListDroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', '456');
    });

    it('should pass disabled prop to DroppablePlaceholder', () => {
      renderWithTheme(<MatchListDroppable {...defaultProps} disabled={true} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
    });

    it('should pass disabled false to DroppablePlaceholder', () => {
      renderWithTheme(<MatchListDroppable {...defaultProps} disabled={false} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'false');
    });
  });

  describe('onRemoveAnswer prop', () => {
    it('should accept onRemoveAnswer callback', () => {
      const onRemoveAnswer = jest.fn();
      renderWithTheme(
        <MatchListDroppable {...defaultProps} onRemoveAnswer={onRemoveAnswer} />
      );
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
      // onRemoveAnswer should be handled in parent's onDragEnd
    });

    it('should not call onRemoveAnswer during render', () => {
      const onRemoveAnswer = jest.fn();
      renderWithTheme(
        <MatchListDroppable {...defaultProps} onRemoveAnswer={onRemoveAnswer} />
      );
      expect(onRemoveAnswer).not.toHaveBeenCalled();
    });

    it('should work without onRemoveAnswer callback', () => {
      renderWithTheme(<MatchListDroppable {...defaultProps} />);
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
    });
  });

  describe('rest props spreading', () => {
    it('should spread additional props to DroppablePlaceholder', () => {
      renderWithTheme(
        <MatchListDroppable
          id="ml-1"
          customProp="custom-value"
          anotherProp={789}
        >
          Content
        </MatchListDroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.customProp).toBe('custom-value');
      expect(restData.anotherProp).toBe(789);
    });

    it('should pass classes prop through rest', () => {
      const classes = { root: 'custom-class', hover: 'hover-class' };
      renderWithTheme(
        <MatchListDroppable id="ml-1" classes={classes}>
          Content
        </MatchListDroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.classes).toEqual(classes);
    });

    it('should pass isVerticalPool prop through rest', () => {
      renderWithTheme(
        <MatchListDroppable id="ml-1" isVerticalPool={false}>
          Content
        </MatchListDroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.isVerticalPool).toBe(false);
    });

    it('should pass minHeight prop through rest', () => {
      renderWithTheme(
        <MatchListDroppable id="ml-1" minHeight={250}>
          Content
        </MatchListDroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.minHeight).toBe(250);
    });

    it('should pass multiple additional props together', () => {
      const onRemoveAnswer = jest.fn();
      renderWithTheme(
        <MatchListDroppable
          id="ml-1"
          disabled={true}
          onRemoveAnswer={onRemoveAnswer}
          classes={{ root: 'test' }}
          isVerticalPool={true}
          minHeight={100}
          customData="match-list-data"
        >
          Content
        </MatchListDroppable>
      );
      
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
      
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.classes).toEqual({ root: 'test' });
      expect(restData.isVerticalPool).toBe(true);
      expect(restData.minHeight).toBe(100);
      expect(restData.customData).toBe('match-list-data');
    });
  });

  describe('edge cases', () => {
    it('should handle only required props', () => {
      renderWithTheme(<MatchListDroppable id="minimal">Content</MatchListDroppable>);
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle empty string id', () => {
      renderWithTheme(<MatchListDroppable id="">Content</MatchListDroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', '');
    });

    it('should handle complex string id', () => {
      renderWithTheme(<MatchListDroppable id="ml-prompt-1-answer-3">Content</MatchListDroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', 'ml-prompt-1-answer-3');
    });

    it('should handle zero as id', () => {
      renderWithTheme(<MatchListDroppable id={0}>Content</MatchListDroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', '0');
    });

    it('should handle minHeight of 0', () => {
      renderWithTheme(<MatchListDroppable id="ml-1" minHeight={0}>Content</MatchListDroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.minHeight).toBe(0);
    });

    it('should handle very large minHeight', () => {
      renderWithTheme(<MatchListDroppable id="ml-1" minHeight={9999}>Content</MatchListDroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.minHeight).toBe(9999);
    });
  });

  describe('component behavior', () => {
    it('should act as a wrapper for DroppablePlaceholder', () => {
      renderWithTheme(<MatchListDroppable {...defaultProps} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toContainElement(screen.getByTestId('child-content'));
    });

    it('should maintain children structure', () => {
      renderWithTheme(
        <MatchListDroppable id="ml-1">
          <div data-testid="wrapper">
            <span data-testid="nested">Nested content</span>
          </div>
        </MatchListDroppable>
      );
      
      expect(screen.getByTestId('wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('should re-render when props change', () => {
      const onRemoveAnswer1 = jest.fn();
      const onRemoveAnswer2 = jest.fn();
      
      const { rerender } = renderWithTheme(
        <MatchListDroppable id="ml-1" disabled={false} onRemoveAnswer={onRemoveAnswer1}>
          Initial
        </MatchListDroppable>
      );
      
      expect(screen.getByText('Initial')).toBeInTheDocument();
      
      rerender(
        <MatchListDroppable id="ml-1" disabled={true} onRemoveAnswer={onRemoveAnswer2}>
          Updated
        </MatchListDroppable>
      );
      
      expect(screen.getByText('Updated')).toBeInTheDocument();
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
    });
  });
});
