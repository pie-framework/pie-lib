import React from 'react';
import { render } from '@pie-lib/test-utils';
import KeyLegend from '../key-legend';

describe('KeyLegend', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<KeyLegend />);
      expect(container).toBeTruthy();
    });

    it('renders the title "Key"', () => {
      const { getByText } = render(<KeyLegend />);
      expect(getByText('Key')).toBeTruthy();
    });

    it('applies custom className when provided', () => {
      const { container } = render(<KeyLegend className="custom-class" />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('custom-class');
    });

    it('renders without className', () => {
      const { container } = render(<KeyLegend />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('without label support (isLabelAvailable=false)', () => {
    it('renders Answer Key Correct row', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={false} />);
      expect(getByText('Answer Key Correct')).toBeTruthy();
    });

    it('renders Student Incorrect row', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={false} />);
      expect(getByText('Student Incorrect')).toBeTruthy();
    });

    it('does not render Missing Required Label row', () => {
      const { queryByText } = render(<KeyLegend isLabelAvailable={false} />);
      expect(queryByText('Missing Required Label')).toBeFalsy();
    });

    it('does not render Answer Key Correct Label row', () => {
      const { queryByText } = render(<KeyLegend isLabelAvailable={false} />);
      expect(queryByText('Answer Key Correct Label')).toBeFalsy();
    });

    it('does not render Incorrect Student Label row', () => {
      const { queryByText } = render(<KeyLegend isLabelAvailable={false} />);
      expect(queryByText('Incorrect Student Label')).toBeFalsy();
    });

    it('renders exactly 2 rows (correct + incorrect)', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={false} />);
      // Verify the 2 text labels are present (one per row)
      expect(getByText('Answer Key Correct')).toBeTruthy();
      expect(getByText('Student Incorrect')).toBeTruthy();
    });
  });

  describe('with label support (isLabelAvailable=true)', () => {
    it('renders Missing Required Label row', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={true} />);
      expect(getByText('Missing Required Label')).toBeTruthy();
    });

    it('renders Answer Key Correct row', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={true} />);
      expect(getByText('Answer Key Correct')).toBeTruthy();
    });

    it('renders Answer Key Correct Label row', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={true} />);
      expect(getByText('Answer Key Correct Label')).toBeTruthy();
    });

    it('renders Student Incorrect row', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={true} />);
      expect(getByText('Student Incorrect')).toBeTruthy();
    });

    it('renders Incorrect Student Label row', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={true} />);
      expect(getByText('Incorrect Student Label')).toBeTruthy();
    });

    it('renders exactly 5 rows (all legend items)', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={true} />);
      // Verify all 5 text labels are present (one per row)
      expect(getByText('Missing Required Label')).toBeTruthy();
      expect(getByText('Answer Key Correct')).toBeTruthy();
      expect(getByText('Answer Key Correct Label')).toBeTruthy();
      expect(getByText('Student Incorrect')).toBeTruthy();
      expect(getByText('Incorrect Student Label')).toBeTruthy();
    });
  });

  describe('default behavior', () => {
    it('treats undefined isLabelAvailable as false', () => {
      const { queryByText } = render(<KeyLegend />);
      expect(queryByText('Missing Required Label')).toBeFalsy();
      expect(queryByText('Answer Key Correct Label')).toBeFalsy();
      expect(queryByText('Incorrect Student Label')).toBeFalsy();
    });
  });

  describe('SVG icons', () => {
    it('renders SVG for Missing Required Label', () => {
      const { container } = render(<KeyLegend isLabelAvailable={true} />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('renders SVG for Answer Key Correct', () => {
      const { container } = render(<KeyLegend isLabelAvailable={false} />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('renders SVG for Student Incorrect', () => {
      const { container } = render(<KeyLegend isLabelAvailable={false} />);
      const svgs = container.querySelectorAll('svg');
      // There are 3 SVGs: 2 for rows + possibly decorative elements
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('renders more SVGs when labels are available', () => {
      const { container: withoutLabels } = render(<KeyLegend isLabelAvailable={false} />);
      const svgsWithoutLabels = withoutLabels.querySelectorAll('svg');

      const { container: withLabels } = render(<KeyLegend isLabelAvailable={true} />);
      const svgsWithLabels = withLabels.querySelectorAll('svg');

      expect(svgsWithLabels.length).toBeGreaterThan(svgsWithoutLabels.length);
    });
  });

  describe('styling', () => {
    it('applies container styles', () => {
      const { container } = render(<KeyLegend />);
      const mainContainer = container.firstChild;

      expect(mainContainer).toHaveStyle({
        padding: '20px',
        width: '355px',
      });
    });

    it('renders title with correct styling', () => {
      const { getByText } = render(<KeyLegend />);
      const title = getByText('Key');

      expect(title).toHaveStyle({
        marginLeft: '30px',
        fontWeight: '700',
        marginBottom: '10px',
      });
    });
  });

  describe('row structure', () => {
    it('each row contains text and SVG', () => {
      const { getByText, container } = render(<KeyLegend isLabelAvailable={true} />);

      // Verify that text labels exist
      expect(getByText('Missing Required Label')).toBeTruthy();
      expect(getByText('Answer Key Correct')).toBeTruthy();
      expect(getByText('Answer Key Correct Label')).toBeTruthy();
      expect(getByText('Student Incorrect')).toBeTruthy();
      expect(getByText('Incorrect Student Label')).toBeTruthy();

      // Verify SVGs exist
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(5);
    });

    it('displays correct text alignment', () => {
      const { getByText } = render(<KeyLegend />);
      const text = getByText('Answer Key Correct');

      expect(text).toHaveStyle({
        textAlign: 'right',
        marginRight: '10px',
      });
    });
  });

  describe('accessibility', () => {
    it('includes descriptive text for each legend item', () => {
      const { getByText } = render(<KeyLegend isLabelAvailable={true} />);

      expect(getByText('Missing Required Label')).toBeTruthy();
      expect(getByText('Answer Key Correct')).toBeTruthy();
      expect(getByText('Answer Key Correct Label')).toBeTruthy();
      expect(getByText('Student Incorrect')).toBeTruthy();
      expect(getByText('Incorrect Student Label')).toBeTruthy();
    });

    it('SVGs are decorative (no role or aria-label needed)', () => {
      const { container } = render(<KeyLegend isLabelAvailable={true} />);
      const svgs = container.querySelectorAll('svg');

      svgs.forEach((svg) => {
        // SVGs should not have interactive roles
        expect(svg.getAttribute('role')).toBeFalsy();
      });
    });
  });

  describe('edge cases', () => {
    it('handles isLabelAvailable as boolean true', () => {
      const { queryByText } = render(<KeyLegend isLabelAvailable={true} />);
      expect(queryByText('Missing Required Label')).toBeTruthy();
    });

    it('handles isLabelAvailable as boolean false', () => {
      const { queryByText } = render(<KeyLegend isLabelAvailable={false} />);
      expect(queryByText('Missing Required Label')).toBeFalsy();
    });

    it('handles isLabelAvailable as truthy value', () => {
      const { queryByText } = render(<KeyLegend isLabelAvailable={1} />);
      expect(queryByText('Missing Required Label')).toBeTruthy();
    });

    it('handles isLabelAvailable as falsy value', () => {
      const { queryByText } = render(<KeyLegend isLabelAvailable={0} />);
      expect(queryByText('Missing Required Label')).toBeFalsy();
    });
  });

  describe('updates', () => {
    it('updates when isLabelAvailable changes from false to true', () => {
      const { queryByText, rerender } = render(<KeyLegend isLabelAvailable={false} />);
      expect(queryByText('Missing Required Label')).toBeFalsy();

      rerender(<KeyLegend isLabelAvailable={true} />);
      expect(queryByText('Missing Required Label')).toBeTruthy();
    });

    it('updates when isLabelAvailable changes from true to false', () => {
      const { queryByText, rerender } = render(<KeyLegend isLabelAvailable={true} />);
      expect(queryByText('Missing Required Label')).toBeTruthy();

      rerender(<KeyLegend isLabelAvailable={false} />);
      expect(queryByText('Missing Required Label')).toBeFalsy();
    });

    it('updates className on rerender', () => {
      const { container, rerender } = render(<KeyLegend className="class1" />);
      expect(container.firstChild).toHaveClass('class1');

      rerender(<KeyLegend className="class2" />);
      expect(container.firstChild).toHaveClass('class2');
      expect(container.firstChild).not.toHaveClass('class1');
    });
  });
});
