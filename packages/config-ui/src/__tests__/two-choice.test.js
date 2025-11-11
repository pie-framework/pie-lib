import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { NChoice } from '../two-choice';

describe('NChoice', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('renders radio buttons with vertical direction', () => {
    render(
      <NChoice
        direction="vertical"
        header="n-choice-vertical"
        value={'left'}
        onChange={onChange}
        opts={[
          { label: 'left', value: 'left' },
          { label: 'center', value: 'center' },
          { label: 'right', value: 'right' },
        ]}
      />,
    );

    expect(screen.getByText('n-choice-vertical')).toBeInTheDocument();
    expect(screen.getByLabelText('left')).toBeInTheDocument();
    expect(screen.getByLabelText('center')).toBeInTheDocument();
    expect(screen.getByLabelText('right')).toBeInTheDocument();
  });

  it('shows selected value as checked', () => {
    render(
      <NChoice
        direction="vertical"
        header="Options"
        value={'center'}
        onChange={onChange}
        opts={[
          { label: 'left', value: 'left' },
          { label: 'center', value: 'center' },
          { label: 'right', value: 'right' },
        ]}
      />,
    );

    const centerRadio = screen.getByLabelText('center');
    expect(centerRadio).toBeChecked();
    expect(screen.getByLabelText('left')).not.toBeChecked();
    expect(screen.getByLabelText('right')).not.toBeChecked();
  });

  it('calls onChange when user selects a different option', async () => {
    const user = userEvent.setup();
    render(
      <NChoice
        direction="vertical"
        header="Options"
        value={'left'}
        onChange={onChange}
        opts={[
          { label: 'left', value: 'left' },
          { label: 'center', value: 'center' },
          { label: 'right', value: 'right' },
        ]}
      />,
    );

    await user.click(screen.getByLabelText('center'));

    expect(onChange).toHaveBeenCalledWith('center');
  });

  it('renders with horizontal direction', () => {
    const { container } = render(
      <NChoice
        direction="horizontal"
        header="Options"
        value={'left'}
        onChange={onChange}
        opts={[
          { label: 'left', value: 'left' },
          { label: 'right', value: 'right' },
        ]}
      />,
    );

    // Check that all options are rendered
    expect(screen.getByLabelText('left')).toBeInTheDocument();
    expect(screen.getByLabelText('right')).toBeInTheDocument();
  });

  it('handles string options by converting them', () => {
    render(
      <NChoice
        direction="vertical"
        header="Options"
        value={'option1'}
        onChange={onChange}
        opts={['option1', 'option2', 'option3']}
      />,
    );

    expect(screen.getByLabelText('option1')).toBeInTheDocument();
    expect(screen.getByLabelText('option2')).toBeInTheDocument();
    expect(screen.getByLabelText('option3')).toBeInTheDocument();
  });
});
