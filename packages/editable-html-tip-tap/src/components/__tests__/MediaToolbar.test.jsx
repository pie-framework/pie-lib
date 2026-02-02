import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MediaToolbar from '../media/MediaToolbar';

describe('MediaToolbar', () => {
  it('renders without crashing', () => {
    const { container } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    expect(container).toBeInTheDocument();
  });

  it('renders Edit Settings text', () => {
    const { getByText } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    expect(getByText('Edit Settings')).toBeInTheDocument();
  });

  it('renders Remove text', () => {
    const { getByText } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    expect(getByText('Remove')).toBeInTheDocument();
  });

  it('calls onEdit when Edit Settings is clicked', () => {
    const onEdit = jest.fn();
    const { getByText } = render(<MediaToolbar onEdit={onEdit} onRemove={jest.fn()} />);
    fireEvent.click(getByText('Edit Settings'));
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onRemove when Remove is clicked', () => {
    const onRemove = jest.fn();
    const { getByText } = render(<MediaToolbar onEdit={jest.fn()} onRemove={onRemove} />);
    fireEvent.click(getByText('Remove'));
    expect(onRemove).toHaveBeenCalled();
  });

  it('hides Edit Settings when hideEdit is true', () => {
    const { queryByText } = render(<MediaToolbar hideEdit={true} onEdit={jest.fn()} onRemove={jest.fn()} />);
    expect(queryByText('Edit Settings')).not.toBeInTheDocument();
  });

  it('shows Edit Settings when hideEdit is false', () => {
    const { getByText } = render(<MediaToolbar hideEdit={false} onEdit={jest.fn()} onRemove={jest.fn()} />);
    expect(getByText('Edit Settings')).toBeInTheDocument();
  });

  it('applies cursor pointer style', () => {
    const { getByText } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    const editButton = getByText('Edit Settings');
    expect(editButton).toHaveStyle({ cursor: 'pointer' });
  });

  it('has border on Edit Settings container', () => {
    const { getByText } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    const editButton = getByText('Edit Settings');
    expect(editButton).toHaveStyle({ borderWidth: '0 2px 0 0' });
  });

  it('applies white background', () => {
    const { container } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    const root = container.firstChild;
    expect(root).toHaveStyle({ background: '#fff' });
  });

  it('applies box shadow', () => {
    const { container } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    const root = container.firstChild;
    expect(root).toHaveStyle({ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' });
  });

  it('displays inline-flex', () => {
    const { container } = render(<MediaToolbar onEdit={jest.fn()} onRemove={jest.fn()} />);
    const root = container.firstChild;
    expect(root).toHaveStyle({ display: 'inline-flex' });
  });
});
