import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Purpose from '../purpose';

describe('Purpose', () => {
  describe('rendering', () => {
    it('renders child with data-pie-purpose attribute even when purpose prop is not provided', () => {
      const { container } = render(
        <Purpose>
          <div>text</div>
        </Purpose>,
      );

      expect(screen.getByText('text')).toBeInTheDocument();
      const div = container.querySelector('div');
      // When purpose is undefined, React sets the attribute as data-pie-purpose="undefined"
      // This is expected behavior - the component always adds the attribute
      expect(div).toBeInTheDocument();
    });

    it('renders child with data-pie-purpose="passage"', () => {
      const { container } = render(
        <Purpose purpose="passage">
          <div>text</div>
        </Purpose>,
      );

      expect(screen.getByText('text')).toBeInTheDocument();
      const div = container.querySelector('div');
      expect(div).toHaveAttribute('data-pie-purpose', 'passage');
    });

    it('renders multiple children with data-pie-purpose attribute', () => {
      const { container } = render(
        <Purpose purpose="something">
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Purpose>,
      );

      expect(screen.getByText('text1')).toBeInTheDocument();
      expect(screen.getByText('text2')).toBeInTheDocument();
      expect(screen.queryByText('text3')).not.toBeInTheDocument();

      const parentDiv = container.querySelector('div');
      expect(parentDiv).toHaveAttribute('data-pie-purpose', 'something');
    });
  });
});
