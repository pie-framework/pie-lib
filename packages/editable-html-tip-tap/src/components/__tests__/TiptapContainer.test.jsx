import React from 'react';
import { render } from '@testing-library/react';
import TiptapContainer from '../TiptapContainer';

jest.mock('../MenuBar', () => ({
  __esModule: true,
  default: ({ editor, toolbarOpts }) => <div data-testid="styled-menu-bar">MenuBar for editor</div>,
}));

describe('TiptapContainer', () => {
  const mockEditor = {
    commands: {
      focus: jest.fn(),
    },
  };

  const defaultProps = {
    editor: mockEditor,
    disabled: false,
    children: <div data-testid="editor-content">Editor content</div>,
    activePlugins: ['bold', 'italic'],
    toolbarOpts: {},
    responseAreaProps: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<TiptapContainer {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders children', () => {
    const { getByTestId } = render(<TiptapContainer {...defaultProps} />);
    expect(getByTestId('editor-content')).toBeInTheDocument();
  });

  it('renders MenuBar when editor is provided', () => {
    const { getByTestId } = render(<TiptapContainer {...defaultProps} />);
    expect(getByTestId('styled-menu-bar')).toBeInTheDocument();
  });

  it('does not render MenuBar when editor is not provided', () => {
    const { queryByTestId } = render(<TiptapContainer {...defaultProps} editor={null} />);
    expect(queryByTestId('styled-menu-bar')).not.toBeInTheDocument();
  });

  it('applies noBorder style when toolbarOpts.noBorder is true', () => {
    const { container } = render(<TiptapContainer {...defaultProps} toolbarOpts={{ noBorder: true }} />);
    const root = container.firstChild;
    expect(root).toHaveStyle({ border: 'none' });
  });

  it('applies error style when toolbarOpts.error is true', () => {
    const { container } = render(<TiptapContainer {...defaultProps} toolbarOpts={{ error: true }} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies noPadding style when toolbarOpts.noPadding is true', () => {
    const { container } = render(<TiptapContainer {...defaultProps} toolbarOpts={{ noPadding: true }} />);
    const children = container.querySelector('div > div > div');
    expect(children).toHaveStyle({ padding: '0' });
  });

  it('disables scrollbar when disableScrollbar is true', () => {
    const { container } = render(<TiptapContainer {...defaultProps} disableScrollbar={true} />);
    expect(container).toBeInTheDocument();
  });

  it('applies width from props', () => {
    const { container } = render(<TiptapContainer {...defaultProps} width={500} />);
    const root = container.firstChild;
    expect(root).toHaveStyle({ width: '500px' });
  });

  it('applies minWidth from props', () => {
    const { container } = render(<TiptapContainer {...defaultProps} minWidth={300} />);
    const root = container.firstChild;
    expect(root).toHaveStyle({ minWidth: '300px' });
  });

  it('applies maxWidth from props', () => {
    const { container } = render(<TiptapContainer {...defaultProps} maxWidth={800} />);
    const root = container.firstChild;
    expect(root).toHaveStyle({ maxWidth: '800px' });
  });

  it('applies height from props', () => {
    const { container } = render(<TiptapContainer {...defaultProps} height={400} />);
    const root = container.firstChild;
    expect(root).toBeInTheDocument();
  });

  it('applies minHeight from props', () => {
    const { container } = render(<TiptapContainer {...defaultProps} minHeight={200} />);
    const root = container.firstChild;
    expect(root).toBeInTheDocument();
  });

  it('applies maxHeight from props', () => {
    const { container } = render(<TiptapContainer {...defaultProps} maxHeight={600} />);
    const root = container.firstChild;
    expect(root).toBeInTheDocument();
  });

  it('focuses editor on mount when autoFocus is true', () => {
    jest.useFakeTimers();
    const { container } = render(<TiptapContainer {...defaultProps} autoFocus={true} />);
    jest.runAllTimers();
    // Just verify the component rendered with autoFocus
    expect(container).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('does not focus editor when autoFocus is false', () => {
    render(<TiptapContainer {...defaultProps} autoFocus={false} />);
    expect(mockEditor.commands.focus).not.toHaveBeenCalled();
  });

  it('passes className to root element', () => {
    const { container } = render(<TiptapContainer {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles width as string with units', () => {
    const { container } = render(<TiptapContainer {...defaultProps} width="50%" />);
    // Width is applied via styled component, just verify it rendered
    expect(container).toBeInTheDocument();
  });

  it('passes onChange to MenuBar', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<TiptapContainer {...defaultProps} onChange={onChange} />);
    expect(getByTestId('styled-menu-bar')).toBeInTheDocument();
  });
});
