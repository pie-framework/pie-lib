import React from 'react';
import { render, screen } from '@testing-library/react';
import Readable from '../readable';

describe('Readable', () => {
  describe('rendering', () => {
    it('renders child with data-pie-readable attribute set to true', () => {
      const { container } = render(
        <Readable>
          <div>text</div>
        </Readable>,
      );

      expect(screen.getByText('text')).toBeInTheDocument();
      const div = container.querySelector('div');
      expect(div).toHaveAttribute('data-pie-readable', 'true');
    });

    it('renders multiple children with data-pie-readable attribute', () => {
      const { container } = render(
        <Readable>
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Readable>,
      );

      expect(screen.getByText('text1')).toBeInTheDocument();
      expect(screen.getByText('text2')).toBeInTheDocument();
      expect(screen.queryByText('text3')).not.toBeInTheDocument();

      const parentDiv = container.querySelector('div');
      expect(parentDiv).toHaveAttribute('data-pie-readable', 'true');
    });

    it('renders with data-pie-readable set to false when false prop is provided', () => {
      const { container } = render(
        <Readable false>
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Readable>,
      );

      expect(screen.getByText('text1')).toBeInTheDocument();
      expect(screen.getByText('text2')).toBeInTheDocument();
      expect(screen.queryByText('text3')).not.toBeInTheDocument();

      const parentDiv = container.querySelector('div');
      expect(parentDiv).toHaveAttribute('data-pie-readable', 'false');
    });

    it('renders with data-pie-readable set to false when false={true}', () => {
      const { container } = render(
        <Readable false={true}>
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Readable>,
      );

      const parentDiv = container.querySelector('div');
      expect(parentDiv).toHaveAttribute('data-pie-readable', 'false');
    });
  });
});
