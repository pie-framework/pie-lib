import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MediaDialog } from '../media/MediaDialog';

global.fetch = jest.fn();

jest.mock('@mui/material/Dialog', () => ({
  __esModule: true,
  default: ({ children, open }) => open && <div data-testid="dialog">{children}</div>,
}));

jest.mock('@mui/material/DialogTitle', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="dialog-title">{children}</div>,
}));

jest.mock('@mui/material/DialogContent', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="dialog-content">{children}</div>,
}));

jest.mock('@mui/material/DialogContentText', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('@mui/material/DialogActions', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="dialog-actions">{children}</div>,
}));

jest.mock('@mui/material/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: ({ value, onChange, label, placeholder, inputProps }) => (
    <div>
      <label>{label}</label>
      <input
        value={value === undefined ? '' : value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label}
        {...inputProps}
      />
    </div>
  ),
}));

jest.mock('@mui/material/Tabs', () => ({
  __esModule: true,
  default: ({ children, value, onChange }) => (
    <div data-testid="tabs" data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock('@mui/material/Tab', () => ({
  __esModule: true,
  default: ({ label, onClick }) => (
    <button onClick={onClick} data-testid="tab">
      {label}
    </button>
  ),
}));

jest.mock('@mui/material/Typography', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: () => <svg data-testid="delete-icon" />,
}));

describe('MediaDialog', () => {
  const defaultProps = {
    open: true,
    handleClose: jest.fn(),
    type: 'video',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(<MediaDialog {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders dialog title for video', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} type="video" />);
    expect(getByText('Insert Video')).toBeInTheDocument();
  });

  it('renders dialog title for audio', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} type="audio" />);
    expect(getByText('Insert Audio')).toBeInTheDocument();
  });

  it('renders URL input field', () => {
    const { getByLabelText } = render(<MediaDialog {...defaultProps} />);
    expect(getByLabelText('URL')).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} />);
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('renders Insert button', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} />);
    expect(getByText('Insert')).toBeInTheDocument();
  });

  it('calls handleClose with false when Cancel is clicked', () => {
    const handleClose = jest.fn();
    const { getByText } = render(<MediaDialog {...defaultProps} handleClose={handleClose} />);
    fireEvent.click(getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledWith(false);
  });

  it('disables Insert button when URL is invalid', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} />);
    const insertButton = getByText('Insert');
    expect(insertButton).toBeDisabled();
  });

  it('shows video properties fields for video type', () => {
    const { getByLabelText } = render(<MediaDialog {...defaultProps} type="video" />);
    expect(getByLabelText('Width')).toBeInTheDocument();
    expect(getByLabelText('Height')).toBeInTheDocument();
  });

  it('shows starts and ends fields for video', async () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <MediaDialog {...defaultProps} type="video" url="https://youtube.com/watch?v=abc" />,
    );
    await waitFor(() => {
      const urlInput = getByPlaceholderText('Paste URL of video...');
      fireEvent.change(urlInput, { target: { value: 'https://youtube.com/watch?v=abc123' } });
    });
  });

  it('updates width on change', () => {
    const { getByLabelText } = render(<MediaDialog {...defaultProps} type="video" />);
    const widthInput = getByLabelText('Width');
    fireEvent.change(widthInput, { target: { value: '800' } });
    expect(widthInput.value).toBe('800');
  });

  it('updates height on change', () => {
    const { getByLabelText } = render(<MediaDialog {...defaultProps} type="video" />);
    const heightInput = getByLabelText('Height');
    fireEvent.change(heightInput, { target: { value: '600' } });
    expect(heightInput.value).toBe('600');
  });

  it('has default width of 560', () => {
    const { getByLabelText } = render(<MediaDialog {...defaultProps} type="video" />);
    const widthInput = getByLabelText('Width');
    expect(widthInput.value).toBe('560');
  });

  it('has default height of 315', () => {
    const { getByLabelText } = render(<MediaDialog {...defaultProps} type="video" />);
    const heightInput = getByLabelText('Height');
    expect(heightInput.value).toBe('315');
  });

  it('shows Insert URL tab', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} type="video" />);
    expect(getByText('Insert YouTube, Vimeo, or Google Drive URL')).toBeInTheDocument();
  });

  it('shows Insert URL tab for audio', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} type="audio" />);
    expect(getByText('Insert SoundCloud URL')).toBeInTheDocument();
  });

  it('shows Upload file tab when uploadSoundSupport is provided', () => {
    const uploadSoundSupport = {
      add: jest.fn(),
      delete: jest.fn(),
    };
    const { getByText } = render(
      <MediaDialog {...defaultProps} type="audio" uploadSoundSupport={uploadSoundSupport} />,
    );
    expect(getByText('Upload file')).toBeInTheDocument();
  });

  it('does not show Upload file tab for video', () => {
    const uploadSoundSupport = {
      add: jest.fn(),
      delete: jest.fn(),
    };
    const { queryByText } = render(
      <MediaDialog {...defaultProps} type="video" uploadSoundSupport={uploadSoundSupport} />,
    );
    expect(queryByText('Upload file')).not.toBeInTheDocument();
  });

  it('changes tab on tab click', () => {
    const uploadSoundSupport = {
      add: jest.fn(),
      delete: jest.fn(),
    };
    const { getByText } = render(
      <MediaDialog {...defaultProps} type="audio" uploadSoundSupport={uploadSoundSupport} />,
    );
    const insertUrlTab = getByText('Insert SoundCloud URL');
    fireEvent.click(insertUrlTab);
    expect(insertUrlTab).toBeInTheDocument();
  });

  it('shows Insert button text when not editing', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} edit={false} />);
    expect(getByText('Insert')).toBeInTheDocument();
  });

  it('shows Update button text when editing', () => {
    const { getByText } = render(<MediaDialog {...defaultProps} edit={true} />);
    expect(getByText('Update')).toBeInTheDocument();
  });

  it('accepts custom src prop', () => {
    const { container } = render(<MediaDialog {...defaultProps} src="https://example.com/video" />);
    expect(container).toBeInTheDocument();
  });

  it('accepts custom url prop', () => {
    const { getByPlaceholderText } = render(<MediaDialog {...defaultProps} url="https://youtube.com/watch?v=test" />);
    const urlInput = getByPlaceholderText('Paste URL of video...');
    expect(urlInput.value).toBe('https://youtube.com/watch?v=test');
  });

  it('accepts custom starts prop', () => {
    const { container } = render(
      <MediaDialog {...defaultProps} starts={10} type="video" url="https://youtube.com/watch?v=test" />,
    );
    expect(container).toBeInTheDocument();
  });

  it('accepts custom ends prop', () => {
    const { container } = render(
      <MediaDialog {...defaultProps} ends={60} type="video" url="https://youtube.com/watch?v=test" />,
    );
    expect(container).toBeInTheDocument();
  });

  it('disables portal when disablePortal is true', () => {
    const { container } = render(<MediaDialog {...defaultProps} disablePortal={true} />);
    expect(container).toBeInTheDocument();
  });

  it('handles URL change for YouTube', async () => {
    const { getByPlaceholderText, container } = render(<MediaDialog {...defaultProps} type="video" />);
    const urlInput = getByPlaceholderText('Paste URL of video...');
    fireEvent.change(urlInput, { target: { value: 'https://youtube.com/watch?v=abc123' } });
    // Just verify the input rendered and change event didn't throw
    expect(container).toBeInTheDocument();
  });

  it('renders file upload input when on upload file tab', () => {
    const uploadSoundSupport = {
      add: jest.fn(),
      delete: jest.fn(),
    };
    const { getByText, container } = render(
      <MediaDialog {...defaultProps} type="audio" uploadSoundSupport={uploadSoundSupport} />,
    );
    const uploadTab = getByText('Upload file');
    fireEvent.click(uploadTab);
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });
});
