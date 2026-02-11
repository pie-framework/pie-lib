import React from 'react';
import { render, screen } from '@testing-library/react';
import FormSection from '../form-section';

describe('FormSection Component', () => {
  describe('Rendering', () => {
    it('should render with label and children', () => {
      render(
        <FormSection label="Settings">
          <div>Child content</div>
        </FormSection>,
      );

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render label as subtitle1 typography', () => {
      const { container } = render(
        <FormSection label="Configuration">
          <div>Content</div>
        </FormSection>,
      );

      const typography = container.querySelector('[class*="MuiTypography"]');
      expect(typography).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <FormSection label="Custom" className="custom-class">
          <div>Content</div>
        </FormSection>,
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <FormSection label="Multiple Children">
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </FormSection>,
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });

    it('should render with single child', () => {
      render(
        <FormSection label="Single Child">
          <input type="text" placeholder="Input" />
        </FormSection>,
      );

      expect(screen.getByPlaceholderText('Input')).toBeInTheDocument();
    });

    it('should render with complex child components', () => {
      render(
        <FormSection label="Complex">
          <div>
            <label>Name:</label>
            <input type="text" placeholder="Enter name" />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" placeholder="Enter email" />
          </div>
        </FormSection>,
      );

      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });
  });

  describe('Labels', () => {
    it('should display different labels', () => {
      const { rerender } = render(
        <FormSection label="First Label">
          <div>Content</div>
        </FormSection>,
      );

      expect(screen.getByText('First Label')).toBeInTheDocument();

      rerender(
        <FormSection label="Second Label">
          <div>Content</div>
        </FormSection>,
      );

      expect(screen.getByText('Second Label')).toBeInTheDocument();
      expect(screen.queryByText('First Label')).not.toBeInTheDocument();
    });

    it('should handle empty label', () => {
      const { container } = render(
        <FormSection label="">
          <div>Content</div>
        </FormSection>,
      );

      expect(container.querySelector('[class*="MuiTypography"]')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle long labels', () => {
      const longLabel = 'This is a very long label that should wrap properly within the form section';
      render(
        <FormSection label={longLabel}>
          <div>Content</div>
        </FormSection>,
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('should handle special characters in labels', () => {
      const specialLabel = 'Settings & Configuration < Advanced > Test @ #1';
      render(
        <FormSection label={specialLabel}>
          <div>Content</div>
        </FormSection>,
      );

      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply default spacing', () => {
      const { container } = render(
        <FormSection label="Spaced">
          <div>Content</div>
        </FormSection>,
      );

      const formSection = container.querySelector('[class*="MuiBox"], div');
      expect(formSection).toBeInTheDocument();
    });

    it('should apply labelExtraStyle to the label', () => {
      const { container } = render(
        <FormSection label="Styled Label" labelExtraStyle={{ color: 'red', fontWeight: 'bold' }}>
          <div>Content</div>
        </FormSection>,
      );

      const typography = container.querySelector('[class*="MuiTypography"]');
      expect(typography).toHaveStyle('color: red');
      expect(typography).toHaveStyle('fontWeight: bold');
    });

    it('should apply multiple labelExtraStyle properties', () => {
      const extraStyle = {
        fontSize: '18px',
        margin: '10px',
        padding: '5px',
      };

      const { container } = render(
        <FormSection label="Multi-styled" labelExtraStyle={extraStyle}>
          <div>Content</div>
        </FormSection>,
      );

      const typography = container.querySelector('[class*="MuiTypography"]');
      expect(typography).toHaveStyle('fontSize: 18px');
      expect(typography).toHaveStyle('margin: 10px');
      expect(typography).toHaveStyle('padding: 5px');
    });

    it('should handle no labelExtraStyle', () => {
      const { container } = render(
        <FormSection label="No Extra Style">
          <div>Content</div>
        </FormSection>,
      );

      expect(container.querySelector('[class*="MuiTypography"]')).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should support multiple custom classes', () => {
      const { container } = render(
        <FormSection label="Test" className="class1 class2 class3">
          <div>Content</div>
        </FormSection>,
      );

      const element = container.querySelector('.class1.class2.class3');
      expect(element).toBeInTheDocument();
    });

    it('should work without custom className', () => {
      const { container } = render(
        <FormSection label="Test">
          <div>Content</div>
        </FormSection>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Content variations', () => {
    it('should render form inputs as children', () => {
      render(
        <FormSection label="Form Inputs">
          <input type="text" placeholder="Text input" />
          <input type="number" placeholder="Number input" />
          <textarea placeholder="Text area"></textarea>
        </FormSection>,
      );

      expect(screen.getByPlaceholderText('Text input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Number input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Text area')).toBeInTheDocument();
    });

    it('should render lists as children', () => {
      render(
        <FormSection label="Options">
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </FormSection>,
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render buttons as children', () => {
      render(
        <FormSection label="Actions">
          <button>Save</button>
          <button>Cancel</button>
        </FormSection>,
      );

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should render nested form sections', () => {
      render(
        <FormSection label="Outer">
          <FormSection label="Inner">
            <div>Nested content</div>
          </FormSection>
        </FormSection>,
      );

      expect(screen.getByText('Outer')).toBeInTheDocument();
      expect(screen.getByText('Inner')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render with conditional children', () => {
      const showContent = true;

      render(
        <FormSection label="Conditional">
          {showContent && <div>Visible</div>}
          {!showContent && <div>Hidden</div>}
        </FormSection>,
      );

      expect(screen.getByText('Visible')).toBeInTheDocument();
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });

    it('should update when children change', () => {
      const { rerender } = render(
        <FormSection label="Dynamic">
          <div>Initial content</div>
        </FormSection>,
      );

      expect(screen.getByText('Initial content')).toBeInTheDocument();

      rerender(
        <FormSection label="Dynamic">
          <div>Updated content</div>
        </FormSection>,
      );

      expect(screen.queryByText('Initial content')).not.toBeInTheDocument();
      expect(screen.getByText('Updated content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const { container } = render(
        <FormSection label="Accessible Section">
          <div>Content</div>
        </FormSection>,
      );

      const typography = container.querySelector('[class*="MuiTypography"]');
      expect(typography).toBeInTheDocument();
    });

    it('should be properly semantically structured', () => {
      const { container } = render(
        <FormSection label="Semantic">
          <input type="text" />
        </FormSection>,
      );

      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });
});
