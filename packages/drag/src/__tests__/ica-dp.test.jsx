import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import { ICADroppable } from '../ica-dp';

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

describe('ICADroppable', () => {
  const defaultProps = {
    id: 'ica-drop-1',
    children: <div data-testid="child-content">ICA Content</div>,
  };

  describe('rendering', () => {
    it('should render children correctly', () => {
      renderWithTheme(<ICADroppable {...defaultProps} />);
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('ICA Content')).toBeInTheDocument();
    });

    it('should render DroppablePlaceholder', () => {
      renderWithTheme(<ICADroppable {...defaultProps} />);
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
    });

    it('should render with string children', () => {
      renderWithTheme(<ICADroppable id="ica-1">Simple text</ICADroppable>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('should render with multiple children', () => {
      renderWithTheme(
        <ICADroppable id="ica-1">
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </ICADroppable>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should render with null children', () => {
      renderWithTheme(<ICADroppable id="ica-1">{null}</ICADroppable>);
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
    });
  });

  describe('DroppablePlaceholder props', () => {
    it('should pass id to DroppablePlaceholder', () => {
      renderWithTheme(<ICADroppable {...defaultProps} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', 'ica-drop-1');
    });

    it('should pass numeric id to DroppablePlaceholder', () => {
      renderWithTheme(<ICADroppable id={123}>Content</ICADroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', '123');
    });

    it('should pass disabled prop to DroppablePlaceholder', () => {
      renderWithTheme(<ICADroppable {...defaultProps} disabled={true} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
    });

    it('should pass disabled false to DroppablePlaceholder', () => {
      renderWithTheme(<ICADroppable {...defaultProps} disabled={false} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'false');
    });
  });

  describe('rest props spreading', () => {
    it('should spread additional props to DroppablePlaceholder', () => {
      renderWithTheme(
        <ICADroppable
          id="ica-1"
          customProp="custom-value"
          anotherProp={123}
        >
          Content
        </ICADroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.customProp).toBe('custom-value');
      expect(restData.anotherProp).toBe(123);
    });

    it('should pass classes prop through rest', () => {
      const classes = { root: 'custom-class' };
      renderWithTheme(
        <ICADroppable id="ica-1" classes={classes}>
          Content
        </ICADroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.classes).toEqual(classes);
    });

    it('should pass isVerticalPool prop through rest', () => {
      renderWithTheme(
        <ICADroppable id="ica-1" isVerticalPool={true}>
          Content
        </ICADroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.isVerticalPool).toBe(true);
    });

    it('should pass minHeight prop through rest', () => {
      renderWithTheme(
        <ICADroppable id="ica-1" minHeight={200}>
          Content
        </ICADroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.minHeight).toBe(200);
    });

    it('should pass multiple additional props', () => {
      renderWithTheme(
        <ICADroppable
          id="ica-1"
          classes={{ root: 'test' }}
          isVerticalPool={true}
          minHeight={150}
          customData="test-data"
        >
          Content
        </ICADroppable>
      );
      const placeholder = screen.getByTestId('droppable-placeholder');
      const restData = JSON.parse(placeholder.getAttribute('data-rest'));
      expect(restData.classes).toEqual({ root: 'test' });
      expect(restData.isVerticalPool).toBe(true);
      expect(restData.minHeight).toBe(150);
      expect(restData.customData).toBe('test-data');
    });
  });

  describe('edge cases', () => {
    it('should handle only required props', () => {
      renderWithTheme(<ICADroppable id="minimal">Content</ICADroppable>);
      expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle empty string id', () => {
      renderWithTheme(<ICADroppable id="">Content</ICADroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', '');
    });

    it('should handle complex string id', () => {
      renderWithTheme(<ICADroppable id="ica-category-1-item-5">Content</ICADroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', 'ica-category-1-item-5');
    });

    it('should handle zero as id', () => {
      renderWithTheme(<ICADroppable id={0}>Content</ICADroppable>);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-id', '0');
    });
  });

  describe('component behavior', () => {
    it('should act as a wrapper for DroppablePlaceholder', () => {
      const { container } = renderWithTheme(<ICADroppable {...defaultProps} />);
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toContainElement(screen.getByTestId('child-content'));
    });

    it('should maintain children structure', () => {
      renderWithTheme(
        <ICADroppable id="ica-1">
          <div data-testid="wrapper">
            <span data-testid="nested">Nested content</span>
          </div>
        </ICADroppable>
      );
      
      expect(screen.getByTestId('wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('should re-render when props change', () => {
      const { rerender } = renderWithTheme(
        <ICADroppable id="ica-1" disabled={false}>Initial</ICADroppable>
      );
      
      expect(screen.getByText('Initial')).toBeInTheDocument();
      
      rerender(
        <ICADroppable id="ica-1" disabled={true}>Updated</ICADroppable>
      );
      
      expect(screen.getByText('Updated')).toBeInTheDocument();
      const placeholder = screen.getByTestId('droppable-placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
    });
  });
});
