import React from 'react';
import { render } from '@testing-library/react';
import { AddColumn, AddRow, RemoveColumn, RemoveRow, RemoveTable } from '../icons/TableIcons';

describe('AddRow', () => {
  it('renders without crashing', () => {
    const { container } = render(<AddRow />);
    expect(container).toBeInTheDocument();
  });

  it('renders SVG', () => {
    const { container } = render(<AddRow />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct viewBox', () => {
    const { container } = render(<AddRow />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('has correct dimensions', () => {
    const { container } = render(<AddRow />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('contains path element', () => {
    const { container } = render(<AddRow />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });
});

describe('RemoveRow', () => {
  it('renders without crashing', () => {
    const { container } = render(<RemoveRow />);
    expect(container).toBeInTheDocument();
  });

  it('renders SVG', () => {
    const { container } = render(<RemoveRow />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct viewBox', () => {
    const { container } = render(<RemoveRow />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('contains path element', () => {
    const { container } = render(<RemoveRow />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });
});

describe('AddColumn', () => {
  it('renders without crashing', () => {
    const { container } = render(<AddColumn />);
    expect(container).toBeInTheDocument();
  });

  it('renders SVG', () => {
    const { container } = render(<AddColumn />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct viewBox', () => {
    const { container } = render(<AddColumn />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('has correct dimensions', () => {
    const { container } = render(<AddColumn />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('contains path element', () => {
    const { container } = render(<AddColumn />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });
});

describe('RemoveColumn', () => {
  it('renders without crashing', () => {
    const { container } = render(<RemoveColumn />);
    expect(container).toBeInTheDocument();
  });

  it('renders SVG', () => {
    const { container } = render(<RemoveColumn />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct viewBox', () => {
    const { container } = render(<RemoveColumn />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('contains path element', () => {
    const { container } = render(<RemoveColumn />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });
});

describe('RemoveTable', () => {
  it('renders without crashing', () => {
    const { container } = render(<RemoveTable />);
    expect(container).toBeInTheDocument();
  });

  it('renders SVG', () => {
    const { container } = render(<RemoveTable />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct viewBox', () => {
    const { container } = render(<RemoveTable />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('has correct dimensions', () => {
    const { container } = render(<RemoveTable />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('contains path element', () => {
    const { container } = render(<RemoveTable />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });
});
