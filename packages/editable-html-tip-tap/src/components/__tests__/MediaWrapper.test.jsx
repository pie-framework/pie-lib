import React from 'react';
import { render } from '@testing-library/react';
import MediaWrapper from '../media/MediaWrapper';

describe('MediaWrapper', () => {
  it('renders without crashing', () => {
    const { container } = render(<MediaWrapper>Content</MediaWrapper>);
    expect(container).toBeInTheDocument();
  });

  it('renders children', () => {
    const { getByText } = render(
      <MediaWrapper>
        <div>Test Content</div>
      </MediaWrapper>,
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default width of 300', () => {
    const { container } = render(<MediaWrapper>Content</MediaWrapper>);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({ width: '300px' });
  });

  it('applies custom width from props', () => {
    const { container } = render(<MediaWrapper width={500}>Content</MediaWrapper>);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({ width: '500px' });
  });

  it('applies string width', () => {
    const { container } = render(<MediaWrapper width="50%">Content</MediaWrapper>);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({ width: '50%' });
  });

  it('applies editor styles when editor prop is true', () => {
    const { container } = render(<MediaWrapper editor={true}>Content</MediaWrapper>);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({ display: 'inline-block', overflow: 'hidden' });
  });

  it('does not apply editor styles when editor prop is false', () => {
    const { container } = render(<MediaWrapper editor={false}>Content</MediaWrapper>);
    const wrapper = container.firstChild;
    expect(wrapper).not.toHaveStyle({ display: 'inline-block' });
  });

  it('has relative positioning', () => {
    const { container } = render(<MediaWrapper>Content</MediaWrapper>);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({ position: 'relative' });
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <MediaWrapper>
        <div>First</div>
        <div>Second</div>
      </MediaWrapper>,
    );
    expect(getByText('First')).toBeInTheDocument();
    expect(getByText('Second')).toBeInTheDocument();
  });

  it('passes additional props through', () => {
    const { container } = render(
      <MediaWrapper data-testid="custom" className="custom-class">
        Content
      </MediaWrapper>,
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveAttribute('data-testid', 'custom');
  });

  it('renders without children', () => {
    const { container } = render(<MediaWrapper />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
