import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CustomToolbarWrapper from '../custom-toolbar-wrapper';

jest.mock('../../components/common/done-button', () => ({
  DoneButton: ({ onClick }) => (
    <button data-testid="done-button" onClick={onClick}>
      Done
    </button>
  ),
}));

jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: () => <span data-testid="delete-icon">Delete</span>,
}));

describe('CustomToolbarWrapper', () => {
  const mockOnDone = jest.fn();
  const mockOnDelete = jest.fn();
  const defaultToolbarOpts = {
    position: 'bottom',
    alignment: 'left',
    alwaysVisible: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <CustomToolbarWrapper showDone={false} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders children', () => {
    const { getByText } = render(
      <CustomToolbarWrapper showDone={false} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('does not show done button when showDone is false', () => {
    const { queryByTestId } = render(
      <CustomToolbarWrapper showDone={false} onDone={mockOnDone} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );
    expect(queryByTestId('done-button')).not.toBeInTheDocument();
  });

  it('shows done button when showDone is true', () => {
    const { getByTestId } = render(
      <CustomToolbarWrapper showDone={true} onDone={mockOnDone} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );
    expect(getByTestId('done-button')).toBeInTheDocument();
  });

  it('calls onDone when done button is clicked', () => {
    const { getByTestId } = render(
      <CustomToolbarWrapper showDone={true} onDone={mockOnDone} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );

    const doneButton = getByTestId('done-button');
    fireEvent.click(doneButton);

    expect(mockOnDone).toHaveBeenCalledTimes(1);
  });

  it('does not show delete button when deletable is false', () => {
    const { queryByTestId } = render(
      <CustomToolbarWrapper deletable={false} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );
    expect(queryByTestId('delete-icon')).not.toBeInTheDocument();
  });

  it('shows delete button when deletable is true', () => {
    const { getByTestId } = render(
      <CustomToolbarWrapper deletable={true} onDelete={mockOnDelete} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );
    expect(getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const { getByLabelText } = render(
      <CustomToolbarWrapper deletable={true} onDelete={mockOnDelete} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );

    const deleteButton = getByLabelText('Delete');
    fireEvent.mouseDown(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('applies right alignment from toolbarOpts', () => {
    const toolbarOpts = {
      ...defaultToolbarOpts,
      alignment: 'right',
    };

    const { container } = render(
      <CustomToolbarWrapper toolbarOpts={toolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );

    const toolbar = container.querySelector('.pie-toolbar');
    expect(toolbar).toHaveStyle({ right: '0' });
  });

  it('applies autoWidth when specified', () => {
    const { container } = render(
      <CustomToolbarWrapper autoWidth={true} toolbarOpts={defaultToolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );

    const toolbar = container.querySelector('.pie-toolbar');
    expect(toolbar).toHaveStyle({ width: 'auto' });
  });

  it('applies minWidth from toolbarOpts', () => {
    const toolbarOpts = {
      ...defaultToolbarOpts,
      minWidth: '300px',
    };

    const { container } = render(
      <CustomToolbarWrapper toolbarOpts={toolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );

    const toolbar = container.querySelector('.pie-toolbar');
    expect(toolbar).toHaveStyle({ minWidth: '300px' });
  });

  it('hides toolbar when isHidden is true', () => {
    const toolbarOpts = {
      ...defaultToolbarOpts,
      isHidden: true,
    };

    const { container } = render(
      <CustomToolbarWrapper toolbarOpts={toolbarOpts}>
        <div>Test content</div>
      </CustomToolbarWrapper>,
    );

    const toolbar = container.querySelector('.pie-toolbar');
    expect(toolbar).toHaveStyle({ visibility: 'hidden' });
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <CustomToolbarWrapper showDone={false} toolbarOpts={defaultToolbarOpts}>
        <div>First child</div>
        <div>Second child</div>
      </CustomToolbarWrapper>,
    );
    expect(getByText('First child')).toBeInTheDocument();
    expect(getByText('Second child')).toBeInTheDocument();
  });
});
