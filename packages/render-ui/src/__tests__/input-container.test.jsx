import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import InputContainer from '../input-container';

describe('InputContainer', () => {
  const defaultProps = {
    label: 'Test Label',
    children: <input data-testid="test-input" type="text" />,
  };

  describe('rendering', () => {
    it('should render with label and children', () => {
      renderWithTheme(<InputContainer {...defaultProps} />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('should render with string label', () => {
      renderWithTheme(
        <InputContainer label="String Label">
          <div data-testid="child">Content</div>
        </InputContainer>,
      );
      expect(screen.getByText('String Label')).toBeInTheDocument();
    });

    it('should render with object label', () => {
      const objectLabel = <span data-testid="label-object">Object Label</span>;
      renderWithTheme(
        <InputContainer label={objectLabel}>
          <div data-testid="child">Content</div>
        </InputContainer>,
      );
      expect(screen.getByTestId('label-object')).toBeInTheDocument();
      expect(screen.getByText('Object Label')).toBeInTheDocument();
    });

    it('should render with single child node', () => {
      renderWithTheme(
        <InputContainer label="Label">
          <input data-testid="single-child" type="text" />
        </InputContainer>,
      );
      expect(screen.getByTestId('single-child')).toBeInTheDocument();
    });

    it('should render with multiple children', () => {
      renderWithTheme(
        <InputContainer label="Label">
          <input data-testid="child-1" type="text" />
          <button data-testid="child-2">Button</button>
          <span data-testid="child-3">Text</span>
        </InputContainer>,
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render with array of children', () => {
      const children = [
        <div key="1" data-testid="array-child-1">
          First
        </div>,
        <div key="2" data-testid="array-child-2">
          Second
        </div>,
      ];
      renderWithTheme(<InputContainer label="Label">{children}</InputContainer>);
      expect(screen.getByTestId('array-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('array-child-2')).toBeInTheDocument();
    });

    it('should render with complex children', () => {
      renderWithTheme(
        <InputContainer label="Complex">
          <div>
            <input data-testid="nested-input" type="text" />
            <div>
              <button data-testid="nested-button">Click</button>
            </div>
          </div>
        </InputContainer>,
      );
      expect(screen.getByTestId('nested-input')).toBeInTheDocument();
      expect(screen.getByTestId('nested-button')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} className="custom-class" />);
      const formControl = container.querySelector('.custom-class');
      expect(formControl).toBeInTheDocument();
    });

    it('should work without className', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const formControl = container.querySelector('.MuiFormControl-root');
      expect(formControl).toBeInTheDocument();
    });

    it('should apply multiple classNames', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} className="class-one class-two" />);
      const formControl = container.querySelector('.class-one.class-two');
      expect(formControl).toBeInTheDocument();
    });
  });

  describe('label styling', () => {
    it('should apply shrink prop to InputLabel', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const label = container.querySelector('.MuiInputLabel-shrink');
      expect(label).toBeInTheDocument();
    });

    it('should render label with correct text content', () => {
      renderWithTheme(<InputContainer label="My Label" children={<div />} />);
      expect(screen.getByText('My Label')).toBeInTheDocument();
    });

    it('should render label with HTML content', () => {
      const htmlLabel = (
        <span>
          Label with <strong data-testid="bold">bold</strong> text
        </span>
      );
      renderWithTheme(<InputContainer label={htmlLabel} children={<div />} />);
      expect(screen.getByTestId('bold')).toBeInTheDocument();
      expect(screen.getByText('bold')).toBeInTheDocument();
    });
  });

  describe('MUI FormControl integration', () => {
    it('should render as a FormControl', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const formControl = container.querySelector('.MuiFormControl-root');
      expect(formControl).toBeInTheDocument();
    });

    it('should have correct FormControl structure', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const formControl = container.querySelector('.MuiFormControl-root');
      const label = formControl?.querySelector('.MuiInputLabel-root');
      expect(label).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty string label', () => {
      renderWithTheme(<InputContainer label="" children={<div data-testid="child" />} />);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should handle label with special characters', () => {
      const specialLabel = 'Label with <>&"\'';
      renderWithTheme(<InputContainer label={specialLabel} children={<div />} />);
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it('should handle null children within array', () => {
      const children = [
        <div key="1" data-testid="valid-child">
          Valid
        </div>,
        null,
        <div key="2" data-testid="another-valid">
          Another
        </div>,
      ];
      renderWithTheme(<InputContainer label="Label">{children}</InputContainer>);
      expect(screen.getByTestId('valid-child')).toBeInTheDocument();
      expect(screen.getByTestId('another-valid')).toBeInTheDocument();
    });

    it('should handle fragment children', () => {
      renderWithTheme(
        <InputContainer label="Label">
          <>
            <div data-testid="fragment-child-1">First</div>
            <div data-testid="fragment-child-2">Second</div>
          </>
        </InputContainer>,
      );
      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });

    it('should handle very long label text', () => {
      const longLabel = 'A'.repeat(200);
      renderWithTheme(<InputContainer label={longLabel} children={<div />} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper label association structure', () => {
      renderWithTheme(<InputContainer {...defaultProps} />);
      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('should render as a form control with label', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const formControl = container.querySelector('.MuiFormControl-root');
      const label = container.querySelector('.MuiInputLabel-root');
      expect(formControl).toContainElement(label);
    });

    it('should maintain label visibility', () => {
      renderWithTheme(<InputContainer {...defaultProps} />);
      const label = screen.getByText('Test Label');
      expect(label).toBeVisible();
    });
  });

  describe('re-rendering', () => {
    it('should update when label changes', () => {
      const { rerender } = renderWithTheme(<InputContainer {...defaultProps} />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();

      rerender(
        <InputContainer label="Updated Label">
          <input data-testid="test-input" type="text" />
        </InputContainer>,
      );
      expect(screen.getByText('Updated Label')).toBeInTheDocument();
      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });

    it('should update when children change', () => {
      const { rerender } = renderWithTheme(<InputContainer {...defaultProps} />);
      expect(screen.getByTestId('test-input')).toBeInTheDocument();

      rerender(
        <InputContainer label="Test Label">
          <button data-testid="test-button">New Child</button>
        </InputContainer>,
      );
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
      expect(screen.queryByTestId('test-input')).not.toBeInTheDocument();
    });

    it('should update when className changes', () => {
      const { container, rerender } = renderWithTheme(<InputContainer {...defaultProps} className="class-a" />);
      expect(container.querySelector('.class-a')).toBeInTheDocument();

      rerender(<InputContainer {...defaultProps} className="class-b" />);
      expect(container.querySelector('.class-b')).toBeInTheDocument();
      expect(container.querySelector('.class-a')).not.toBeInTheDocument();
    });
  });

  describe('styling and layout', () => {
    it('should render with expected structure', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const formControl = container.querySelector('.MuiFormControl-root');
      const label = container.querySelector('.MuiInputLabel-root');
      const input = screen.getByTestId('test-input');

      expect(formControl).toBeInTheDocument();
      expect(formControl).toContainElement(label);
      expect(formControl).toContainElement(input);
    });

    it('should apply styled components correctly', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const formControl = container.querySelector('.MuiFormControl-root');
      expect(formControl).toBeInTheDocument();
      // StyledFormControl should be applied
      expect(formControl).toHaveClass('MuiFormControl-root');
    });

    it('should have label with shrink class', () => {
      const { container } = renderWithTheme(<InputContainer {...defaultProps} />);
      const label = container.querySelector('.MuiInputLabel-root');
      expect(label).toHaveClass('MuiInputLabel-shrink');
    });
  });

  describe('integration', () => {
    it('should work with form elements', () => {
      renderWithTheme(
        <InputContainer label="Form Field">
          <input data-testid="text-input" type="text" />
        </InputContainer>,
      );
      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('should work with custom components', () => {
      const CustomComponent = () => <div data-testid="custom">Custom</div>;
      renderWithTheme(
        <InputContainer label="Custom Field">
          <CustomComponent />
        </InputContainer>,
      );
      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('should work with nested InputContainers', () => {
      renderWithTheme(
        <InputContainer label="Outer">
          <div>
            <InputContainer label="Inner">
              <input data-testid="inner-input" type="text" />
            </InputContainer>
          </div>
        </InputContainer>,
      );
      expect(screen.getByText('Outer')).toBeInTheDocument();
      expect(screen.getByText('Inner')).toBeInTheDocument();
      expect(screen.getByTestId('inner-input')).toBeInTheDocument();
    });

    it('should work with MUI components as children', () => {
      renderWithTheme(
        <InputContainer label="MUI Field">
          <div data-testid="mui-child" className="MuiInput-root">
            MUI Component
          </div>
        </InputContainer>,
      );
      expect(screen.getByTestId('mui-child')).toBeInTheDocument();
    });
  });
});
