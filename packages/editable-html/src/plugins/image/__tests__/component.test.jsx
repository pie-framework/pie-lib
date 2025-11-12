import React from 'react';
import { render } from '@testing-library/react';
import { Data, Block } from 'slate';
import { Component } from '../component';

describe('Image Component', () => {
  const createImageNode = (dataProps = {}) => {
    return Block.fromJSON({
      type: 'image',
      data: Data.create({
        width: 50,
        height: 50,
        src: 'test-image.jpg',
        ...dataProps,
      }),
    });
  };

  const createMockEditor = () => ({
    value: {},
    change: jest.fn(),
  });

  const defaultClasses = {
    active: 'active',
    loading: 'loading',
    pendingDelete: 'pendingDelete',
  };

  const defaultProps = {
    node: createImageNode(),
    editor: createMockEditor(),
    classes: defaultClasses,
    onDelete: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { container } = render(<Component {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders image with correct dimensions', () => {
    const { container } = render(<Component {...defaultProps} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('renders with custom width and height', () => {
    const node = createImageNode({ width: 100, height: 200 });
    const { container } = render(<Component {...defaultProps} node={node} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('renders with loading class when loading', () => {
    const node = createImageNode({ loading: true });
    const { container } = render(<Component {...defaultProps} node={node} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with active class when active', () => {
    const node = createImageNode({ active: true });
    const { container } = render(<Component {...defaultProps} node={node} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles image with source', () => {
    const node = createImageNode({ src: 'test-image.jpg' });
    const { container } = render(<Component {...defaultProps} node={node} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'test-image.jpg');
  });
});
