import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioWithLabel from '../radio-with-label';

describe('RadioWithLabel Component', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render radio button with label', () => {
      render(<RadioWithLabel label="Option 1" value="option1" checked={false} onChange={onChange} />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('should render checked radio button', () => {
      render(<RadioWithLabel label="Selected" value="selected" checked={true} onChange={onChange} />);

      expect(screen.getByRole('radio')).toBeChecked();
    });

    it('should render unchecked radio button', () => {
      render(<RadioWithLabel label="Unselected" value="unselected" checked={false} onChange={onChange} />);

      expect(screen.getByRole('radio')).not.toBeChecked();
    });
  });

  describe('User interaction', () => {
    it('should call onChange when radio button is clicked', async () => {
      const user = userEvent.setup();
      render(<RadioWithLabel label="Option" value="option" checked={false} onChange={onChange} />);

      const radio = screen.getByRole('radio');
      await user.click(radio);

      expect(onChange).toHaveBeenCalled();
    });

    it('should call onChange when label is clicked', async () => {
      const user = userEvent.setup();
      render(<RadioWithLabel label="Click me" value="test" checked={false} onChange={onChange} />);

      const label = screen.getByText('Click me');
      await user.click(label);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Props', () => {
    it('should accept different value types', () => {
      const { container: stringContainer } = render(
        <RadioWithLabel label="String value" value="string" checked={false} onChange={onChange} />,
      );

      const { container: numberContainer } = render(
        <RadioWithLabel label="Number value" value={123} checked={false} onChange={onChange} />,
      );

      expect(stringContainer.querySelector('input[type="radio"]')).toBeInTheDocument();
      expect(numberContainer.querySelector('input[type="radio"]')).toBeInTheDocument();
    });

    it('should display different labels', () => {
      render(
        <>
          <RadioWithLabel label="Label A" value="a" checked={false} onChange={onChange} />
          <RadioWithLabel label="Label B" value="b" checked={false} onChange={onChange} />
        </>,
      );

      expect(screen.getByText('Label A')).toBeInTheDocument();
      expect(screen.getByText('Label B')).toBeInTheDocument();
    });
  });

  describe('Radio button group behavior', () => {
    it('should allow multiple radio buttons to be rendered', () => {
      render(
        <>
          <RadioWithLabel label="Option 1" value="opt1" checked={true} onChange={onChange} />
          <RadioWithLabel label="Option 2" value="opt2" checked={false} onChange={onChange} />
          <RadioWithLabel label="Option 3" value="opt3" checked={false} onChange={onChange} />
        </>,
      );

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });

    it('should handle independent onChange callbacks for multiple radios', async () => {
      const user = userEvent.setup();
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();
      const onChange3 = jest.fn();

      render(
        <>
          <RadioWithLabel label="Option 1" value="opt1" checked={true} onChange={onChange1} />
          <RadioWithLabel label="Option 2" value="opt2" checked={false} onChange={onChange2} />
          <RadioWithLabel label="Option 3" value="opt3" checked={false} onChange={onChange3} />
        </>,
      );

      const radios = screen.getAllByRole('radio');

      await user.click(radios[1]);
      expect(onChange2).toHaveBeenCalled();
      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange3).not.toHaveBeenCalled();

      onChange2.mockClear();

      await user.click(radios[2]);
      expect(onChange3).toHaveBeenCalled();
      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange2).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should render with correct styling classes', () => {
      const { container } = render(
        <RadioWithLabel label="Styled" value="styled" checked={false} onChange={onChange} />,
      );

      expect(container.querySelector('[class*="MuiFormControlLabel"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="MuiRadio"]')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string label', () => {
      render(<RadioWithLabel label="" value="empty" checked={false} onChange={onChange} />);

      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('should handle long labels', () => {
      const longLabel = 'This is a very long label that should wrap properly and not break the layout';
      render(<RadioWithLabel label={longLabel} value="long" checked={false} onChange={onChange} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });
});
