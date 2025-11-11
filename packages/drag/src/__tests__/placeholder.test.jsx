import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { PlaceHolder } from '../placeholder';

describe('placeholder', () => {
  const renderComponent = (extras = {}) => {
    const props = { ...extras };
    return render(<PlaceHolder {...props}>Foo</PlaceHolder>);
  };

  describe('rendering', () => {
    it('renders children content', () => {
      renderComponent();
      expect(screen.getByText('Foo')).toBeInTheDocument();
    });

    it('renders with regular placeholder class', () => {
      const { container } = renderComponent();
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('placeholder');
    });

    it('applies over class when isOver is true', () => {
      const { container } = renderComponent({ isOver: true });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('over');
    });

    it('applies disabled class when disabled is true', () => {
      const { container } = renderComponent({ disabled: true });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('disabled');
    });

    it('applies custom className', () => {
      const { container } = renderComponent({ className: 'bar' });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('bar');
      expect(placeholder).toHaveClass('placeholder');
    });

    it('applies choice type class', () => {
      const { container } = renderComponent({ type: 'choice' });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('choice');
    });

    it('applies board class when choiceBoard is true', () => {
      const { container } = renderComponent({ choiceBoard: true });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('board');
    });

    it('applies categorizeBoard class when choiceBoard and isCategorize are true', () => {
      const { container } = renderComponent({ choiceBoard: true, isCategorize: true });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('categorizeBoard');
    });

    it('applies verticalPool class when isVerticalPool is true', () => {
      const { container } = renderComponent({ isVerticalPool: true });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveClass('verticalPool');
    });
  });

  describe('grid styles', () => {
    it('applies grid column styles', () => {
      const { container } = renderComponent({
        grid: { columns: 3 },
      });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
    });

    it('applies grid row styles with default value', () => {
      const { container } = renderComponent({
        grid: { rows: 2 },
      });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveStyle({ gridTemplateRows: 'repeat(2, 1fr)' });
    });

    it('applies grid row styles with custom rowsRepeatValue', () => {
      const { container } = renderComponent({
        grid: {
          rows: 2,
          columns: 1,
          rowsRepeatValue: 'min-content',
        },
      });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveStyle({
        gridTemplateRows: 'repeat(2, min-content)',
        gridTemplateColumns: 'repeat(1, 1fr)',
      });
    });
  });

  describe('min height', () => {
    it('applies minHeight style when provided', () => {
      const { container } = renderComponent({ minHeight: 200 });
      const placeholder = container.firstChild;
      expect(placeholder).toHaveStyle({ minHeight: '200px' });
    });
  });
});
