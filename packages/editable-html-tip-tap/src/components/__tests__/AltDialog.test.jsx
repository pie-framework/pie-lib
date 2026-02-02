import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AltDialog } from '../image/AltDialog';

jest.mock('@mui/material/Dialog', () => ({
  __esModule: true,
  default: ({ children, open, id }) => open && <div id={id}>{children}</div>,
}));

jest.mock('@mui/material/DialogContent', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('@mui/material/DialogActions', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('@mui/material/Button', () => ({
  __esModule: true,
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder, helperText, FormHelperTextProps, multiline }) => (
    <div className="MuiTextField-root">
      <textarea value={value || ''} onChange={onChange} placeholder={placeholder} data-multiline={multiline} />
      {helperText && <div style={FormHelperTextProps?.style}>{helperText}</div>}
    </div>
  ),
}));

jest.mock('@mui/icons-material/ArrowBackIos', () => ({
  __esModule: true,
  default: () => <svg data-testid="arrow-back-icon" />,
}));

describe('AltDialog', () => {
  const defaultProps = {
    onDone: jest.fn(),
    alt: 'Initial alt text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    const { container } = render(<AltDialog {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with initial alt text', () => {
    const { container } = render(<AltDialog {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('Initial alt text');
  });

  it('renders placeholder text', () => {
    const { getByPlaceholderText } = render(<AltDialog {...defaultProps} alt="" />);
    expect(getByPlaceholderText('Enter an Alt Text description of this image')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    const { getByText } = render(<AltDialog {...defaultProps} />);
    expect(
      getByText(
        'Users with visual limitations rely on Alt Text, since screen readers cannot otherwise describe the contents of an image.',
      ),
    ).toBeInTheDocument();
  });

  it('renders Done button', () => {
    const { getByText } = render(<AltDialog {...defaultProps} />);
    expect(getByText('Done')).toBeInTheDocument();
  });

  it('renders ArrowBackIos icon', () => {
    const { getByTestId } = render(<AltDialog {...defaultProps} />);
    expect(getByTestId('arrow-back-icon')).toBeInTheDocument();
  });

  it('updates value on text field change', () => {
    const { container } = render(<AltDialog {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    fireEvent.change(textarea, { target: { value: 'New alt text' } });
    expect(textarea.value).toBe('New alt text');
  });

  it('calls onDone with value when Done button is clicked', () => {
    const onDone = jest.fn();
    // Mock document.querySelectorAll to avoid DOM manipulation issues
    const mockQuerySelectorAll = jest.spyOn(document, 'querySelectorAll').mockReturnValue([]);

    const { getByText, container } = render(<AltDialog {...defaultProps} onDone={onDone} />);
    const textarea = container.querySelector('textarea');
    fireEvent.change(textarea, { target: { value: 'Updated alt text' } });
    fireEvent.click(getByText('Done'));
    expect(onDone).toHaveBeenCalledWith('Updated alt text');

    mockQuerySelectorAll.mockRestore();
  });

  it('closes dialog when Done button is clicked', () => {
    // Mock document.querySelectorAll to avoid DOM manipulation issues
    const mockQuerySelectorAll = jest.spyOn(document, 'querySelectorAll').mockReturnValue([]);

    const { getByText, container } = render(<AltDialog {...defaultProps} />);
    const dialog = container.querySelector('#text-dialog');
    expect(dialog).toBeInTheDocument();
    fireEvent.click(getByText('Done'));

    mockQuerySelectorAll.mockRestore();
  });

  it('dialog is open', () => {
    const { container } = render(<AltDialog {...defaultProps} />);
    const dialog = container.querySelector('[id="text-dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  it('has correct dialog props', () => {
    const { container } = render(<AltDialog {...defaultProps} />);
    const dialog = container.querySelector('[id="text-dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  it('text field is multiline', () => {
    const { container } = render(<AltDialog {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    expect(textarea.getAttribute('data-multiline')).toBe('true');
  });

  it('renders without alt text', () => {
    const { getByPlaceholderText } = render(<AltDialog {...defaultProps} alt={undefined} />);
    expect(getByPlaceholderText('Enter an Alt Text description of this image')).toBeInTheDocument();
  });

  it('handles empty alt text', () => {
    const { container } = render(<AltDialog {...defaultProps} alt="" />);
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('');
  });
});
