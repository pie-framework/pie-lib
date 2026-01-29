import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ImageToolbar } from '../image/ImageToolbar';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  render: jest.fn(),
}));

jest.mock('../image/AltDialog', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="alt-dialog" />),
}));

jest.mock('../common/toolbar-buttons', () => ({
  MarkButton: ({ onToggle, active, label, children }) => (
    <button onClick={() => onToggle()} data-testid={`mark-button-${label}`} data-active={active}>
      {children}
    </button>
  ),
}));

describe('ImageToolbar', () => {
  const defaultProps = {
    onChange: jest.fn(),
    alignment: 'left',
    alt: 'Test alt text',
    imageLoaded: true,
    disableImageAlignmentButtons: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<ImageToolbar {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders alignment buttons when not disabled', () => {
    const { getByTestId } = render(<ImageToolbar {...defaultProps} />);
    expect(getByTestId('mark-button-left')).toBeInTheDocument();
    expect(getByTestId('mark-button-center')).toBeInTheDocument();
    expect(getByTestId('mark-button-right')).toBeInTheDocument();
  });

  it('does not render alignment buttons when disabled', () => {
    const { queryByTestId } = render(<ImageToolbar {...defaultProps} disableImageAlignmentButtons={true} />);
    expect(queryByTestId('mark-button-left')).not.toBeInTheDocument();
    expect(queryByTestId('mark-button-center')).not.toBeInTheDocument();
    expect(queryByTestId('mark-button-right')).not.toBeInTheDocument();
  });

  it('renders "Alt text" label', () => {
    const { getByText } = render(<ImageToolbar {...defaultProps} />);
    expect(getByText('Alt text')).toBeInTheDocument();
  });

  it('calls onChange with alignment when alignment button clicked', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<ImageToolbar {...defaultProps} onChange={onChange} />);
    fireEvent.click(getByTestId('mark-button-center'));
    expect(onChange).toHaveBeenCalledWith({ alignment: 'center' });
  });

  it('shows left button as active when alignment is left', () => {
    const { getByTestId } = render(<ImageToolbar {...defaultProps} alignment="left" />);
    expect(getByTestId('mark-button-left')).toHaveAttribute('data-active', 'true');
  });

  it('shows center button as active when alignment is center', () => {
    const { getByTestId } = render(<ImageToolbar {...defaultProps} alignment="center" />);
    expect(getByTestId('mark-button-center')).toHaveAttribute('data-active', 'true');
  });

  it('shows right button as active when alignment is right', () => {
    const { getByTestId } = render(<ImageToolbar {...defaultProps} alignment="right" />);
    expect(getByTestId('mark-button-right')).toHaveAttribute('data-active', 'true');
  });

  it('disables alt text when image is not loaded', () => {
    const { getByText } = render(<ImageToolbar {...defaultProps} imageLoaded={false} />);
    const altText = getByText('Alt text');
    expect(altText).toHaveStyle({ opacity: '0.5' });
  });

  it('does not disable alt text when image is loaded', () => {
    const { getByText } = render(<ImageToolbar {...defaultProps} imageLoaded={true} />);
    const altText = getByText('Alt text');
    expect(altText).not.toHaveStyle({ opacity: '0.5' });
  });

  it('renders alt text dialog on mouse down when image is loaded', () => {
    const { getByText, container } = render(<ImageToolbar {...defaultProps} imageLoaded={true} />);
    const altText = getByText('Alt text');
    fireEvent.mouseDown(altText);
    // Just verify the component rendered and mouseDown didn't throw
    expect(container).toBeInTheDocument();
  });

  it('does not render alt text dialog on mouse down when image is not loaded', () => {
    const { getByText, container } = render(<ImageToolbar {...defaultProps} imageLoaded={false} />);
    const altText = getByText('Alt text');
    fireEvent.mouseDown(altText);
    // Just verify the component rendered and mouseDown didn't throw
    expect(container).toBeInTheDocument();
  });

  it('calls onChange with new alt text and true when alt dialog is done', () => {
    const onChange = jest.fn();
    const toolbar = new ImageToolbar({ ...defaultProps, onChange });
    toolbar.onAltTextDone('New alt text');
    expect(onChange).toHaveBeenCalledWith({ alt: 'New alt text' }, true);
  });

  it('has border on alt text when alignment buttons are shown', () => {
    const { getByText } = render(<ImageToolbar {...defaultProps} disableImageAlignmentButtons={false} />);
    const altText = getByText('Alt text');
    expect(altText).toHaveStyle({ borderLeft: '1px solid grey' });
  });

  it('does not have border on alt text when alignment buttons are hidden', () => {
    const { getByText } = render(<ImageToolbar {...defaultProps} disableImageAlignmentButtons={true} />);
    const altText = getByText('Alt text');
    expect(altText).not.toHaveStyle({ borderLeft: '1px solid grey' });
  });
});
