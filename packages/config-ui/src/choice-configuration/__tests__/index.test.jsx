import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChoiceConfiguration } from '../index';

// Mock editable-html to simplify testing
// The component uses require('@pie-lib/editable-html')['default']
// so we need to export default properly
jest.mock('@pie-lib/editable-html', () => ({
  __esModule: true,
  default: ({ markup, onChange, disabled }) => (
    <textarea
      data-testid="editable-html"
      defaultValue={markup || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  ),
}));

const defaultFeedback = {
  correct: 'Correct',
  incorrect: 'Incorrect',
};

const data = {
  correct: true,
  value: 'foo',
  label: 'Foo',
  feedback: {
    type: 'custom',
  },
};

const classes = {
  choiceConfiguration: 'choiceConfiguration',
};

describe('ChoiceConfiguration', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders correctly with default props', () => {
      const { container } = render(
        <ChoiceConfiguration classes={classes} defaultFeedback={defaultFeedback} data={data} onChange={onChange} />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with checked state', () => {
      render(
        <ChoiceConfiguration
          classes={classes}
          defaultFeedback={defaultFeedback}
          data={data}
          onChange={onChange}
          mode="checkbox"
        />,
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('renders without feedback when allowFeedBack is false', () => {
      render(
        <ChoiceConfiguration
          allowFeedBack={false}
          classes={classes}
          defaultFeedback={defaultFeedback}
          data={data}
          onChange={onChange}
        />,
      );
      // Feedback menu should not be present
      expect(screen.queryByRole('button', { name: /feedback/i })).not.toBeInTheDocument();
    });

    it('renders without delete button when allowDelete is false', () => {
      render(
        <ChoiceConfiguration
          allowDelete={false}
          classes={classes}
          defaultFeedback={defaultFeedback}
          data={data}
          onChange={onChange}
        />,
      );
      // Delete button should not be present
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when label is edited', async () => {
      const user = userEvent.setup();
      render(
        <ChoiceConfiguration classes={classes} defaultFeedback={defaultFeedback} data={data} onChange={onChange} />,
      );

      // Component may render multiple editable-html elements (label + feedback), get the first one
      const editableHtmlElements = screen.getAllByTestId('editable-html');
      const editableHtml = editableHtmlElements[0];
      await user.clear(editableHtml);
      await user.type(editableHtml, 'new label');

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: expect.stringContaining('new label'),
        }),
      );
    });

    it('calls onChange when checkbox is toggled', async () => {
      const user = userEvent.setup();
      render(
        <ChoiceConfiguration
          classes={classes}
          defaultFeedback={defaultFeedback}
          data={{ ...data, correct: false }}
          onChange={onChange}
          mode="checkbox"
        />,
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          correct: true,
        }),
      );
    });
  });
});
