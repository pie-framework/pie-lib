import React from 'react';
import { render } from '@pie-lib/test-utils';

import SvgIcon from '../label-svg-icon';

describe('SvgIcon', () => {
  describe('rendering', () => {
    it('renders without crashing with correct type', () => {
      const { container } = render(<SvgIcon type="correct" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders correct icon type', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '8');
      expect(svg).toHaveAttribute('height', '6');
    });

    it('renders incorrect icon type', () => {
      const { container } = render(<SvgIcon type="incorrect" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '7');
      expect(svg).toHaveAttribute('height', '7');
    });

    it('renders empty icon type', () => {
      const { container } = render(<SvgIcon type="empty" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '11');
      expect(svg).toHaveAttribute('height', '12');
    });

    it('renders null for unknown icon type', () => {
      const { container } = render(<SvgIcon type="unknown" />);
      expect(container.firstChild).toBeNull();
    });

    it('renders null for invalid icon type', () => {
      const { container } = render(<SvgIcon type="invalid" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('correct icon', () => {
    it('has correct viewBox attribute', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 8 6');
    });

    it('has correct fill color for path', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('fill', '#0B7D38');
    });

    it('has correct path d attribute for checkmark', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('d');
      const dAttribute = path.getAttribute('d');
      expect(dAttribute).toContain('M6.79688');
    });

    it('has xmlns attribute', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });
  });

  describe('incorrect icon', () => {
    it('has correct viewBox attribute', () => {
      const { container } = render(<SvgIcon type="incorrect" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 7 7');
    });

    it('has correct fill color for path', () => {
      const { container } = render(<SvgIcon type="incorrect" />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('fill', '#BF0D00');
    });

    it('has correct path d attribute for X mark', () => {
      const { container } = render(<SvgIcon type="incorrect" />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('d');
      const dAttribute = path.getAttribute('d');
      expect(dAttribute).toContain('M4.23438');
    });

    it('has xmlns attribute', () => {
      const { container } = render(<SvgIcon type="incorrect" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });
  });

  describe('empty icon', () => {
    it('has correct viewBox attribute', () => {
      const { container } = render(<SvgIcon type="empty" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 11 12');
    });

    it('has correct fill color for path', () => {
      const { container } = render(<SvgIcon type="empty" />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('fill', '#BF0D00');
    });

    it('has correct path d attribute for empty frame', () => {
      const { container } = render(<SvgIcon type="empty" />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('d');
      const dAttribute = path.getAttribute('d');
      expect(dAttribute).toContain('M0.25');
    });

    it('has xmlns attribute', () => {
      const { container } = render(<SvgIcon type="empty" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });
  });

  describe('icon structure', () => {
    it('correct icon has one path element', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBe(1);
    });

    it('incorrect icon has one path element', () => {
      const { container } = render(<SvgIcon type="incorrect" />);
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBe(1);
    });

    it('empty icon has one path element', () => {
      const { container } = render(<SvgIcon type="empty" />);
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBe(1);
    });

    it('each icon renders only one svg element', () => {
      const { container: correctContainer } = render(<SvgIcon type="correct" />);
      const { container: incorrectContainer } = render(<SvgIcon type="incorrect" />);
      const { container: emptyContainer } = render(<SvgIcon type="empty" />);

      expect(correctContainer.querySelectorAll('svg').length).toBe(1);
      expect(incorrectContainer.querySelectorAll('svg').length).toBe(1);
      expect(emptyContainer.querySelectorAll('svg').length).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles empty string type gracefully', () => {
      const { container } = render(<SvgIcon type="" />);
      expect(container.firstChild).toBeNull();
    });

    it('handles null type gracefully', () => {
      const { container } = render(<SvgIcon type={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('handles undefined type gracefully', () => {
      const { container } = render(<SvgIcon type={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('handles numeric type gracefully', () => {
      const { container } = render(<SvgIcon type={123} />);
      expect(container.firstChild).toBeNull();
    });

    it('handles object type gracefully', () => {
      const { container } = render(<SvgIcon type={{}} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('icon differentiation', () => {
    it('correct and incorrect icons have different dimensions', () => {
      const { container: correctContainer } = render(<SvgIcon type="correct" />);
      const { container: incorrectContainer } = render(<SvgIcon type="incorrect" />);

      const correctSvg = correctContainer.querySelector('svg');
      const incorrectSvg = incorrectContainer.querySelector('svg');

      expect(correctSvg.getAttribute('width')).not.toBe(incorrectSvg.getAttribute('width'));
    });

    it('correct and empty icons have different fill colors', () => {
      const { container: correctContainer } = render(<SvgIcon type="correct" />);
      const { container: emptyContainer } = render(<SvgIcon type="empty" />);

      const correctPath = correctContainer.querySelector('path');
      const emptyPath = emptyContainer.querySelector('path');

      expect(correctPath.getAttribute('fill')).not.toBe(emptyPath.getAttribute('fill'));
    });

    it('incorrect and empty icons have same fill color', () => {
      const { container: incorrectContainer } = render(<SvgIcon type="incorrect" />);
      const { container: emptyContainer } = render(<SvgIcon type="empty" />);

      const incorrectPath = incorrectContainer.querySelector('path');
      const emptyPath = emptyContainer.querySelector('path');

      expect(incorrectPath.getAttribute('fill')).toBe(emptyPath.getAttribute('fill'));
    });

    it('each icon type has unique path data', () => {
      const { container: correctContainer } = render(<SvgIcon type="correct" />);
      const { container: incorrectContainer } = render(<SvgIcon type="incorrect" />);
      const { container: emptyContainer } = render(<SvgIcon type="empty" />);

      const correctPath = correctContainer.querySelector('path').getAttribute('d');
      const incorrectPath = incorrectContainer.querySelector('path').getAttribute('d');
      const emptyPath = emptyContainer.querySelector('path').getAttribute('d');

      expect(correctPath).not.toBe(incorrectPath);
      expect(correctPath).not.toBe(emptyPath);
      expect(incorrectPath).not.toBe(emptyPath);
    });
  });

  describe('SVG attributes', () => {
    it('all icons have fill="none" on svg element', () => {
      const { container: correctContainer } = render(<SvgIcon type="correct" />);
      const { container: incorrectContainer } = render(<SvgIcon type="incorrect" />);
      const { container: emptyContainer } = render(<SvgIcon type="empty" />);

      expect(correctContainer.querySelector('svg')).toHaveAttribute('fill', 'none');
      expect(incorrectContainer.querySelector('svg')).toHaveAttribute('fill', 'none');
      expect(emptyContainer.querySelector('svg')).toHaveAttribute('fill', 'none');
    });

    it('all icons have proper xmlns namespace', () => {
      const { container: correctContainer } = render(<SvgIcon type="correct" />);
      const { container: incorrectContainer } = render(<SvgIcon type="incorrect" />);
      const { container: emptyContainer } = render(<SvgIcon type="empty" />);

      const xmlns = 'http://www.w3.org/2000/svg';
      expect(correctContainer.querySelector('svg')).toHaveAttribute('xmlns', xmlns);
      expect(incorrectContainer.querySelector('svg')).toHaveAttribute('xmlns', xmlns);
      expect(emptyContainer.querySelector('svg')).toHaveAttribute('xmlns', xmlns);
    });
  });

  describe('accessibility', () => {
    it('svg elements are properly structured for screen readers', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const svg = container.querySelector('svg');

      // SVG should be in DOM
      expect(svg).toBeInTheDocument();

      // Should have valid viewBox for proper scaling
      expect(svg.getAttribute('viewBox')).toBeTruthy();
    });

    it('icons render as inline elements', () => {
      const { container } = render(<SvgIcon type="correct" />);
      const svg = container.querySelector('svg');

      // SVG should be direct child (inline)
      expect(container.firstChild).toBe(svg);
    });
  });
});
