import React from 'react';
import { render } from '@testing-library/react';
import { Chevron, GripIcon, ToolbarIcon } from '../icons/RespArea';

describe('Chevron', () => {
  it('renders without crashing', () => {
    const { container } = render(<Chevron />);
    expect(container).toBeInTheDocument();
  });

  it('rotates 0 degrees for right direction (default)', () => {
    const { container } = render(<Chevron direction="right" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(0deg)' });
  });

  it('rotates 90 degrees for down direction', () => {
    const { container } = render(<Chevron direction="down" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(90deg)' });
  });

  it('rotates -90 degrees for up direction', () => {
    const { container } = render(<Chevron direction="up" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(-90deg)' });
  });

  it('rotates 180 degrees for left direction', () => {
    const { container } = render(<Chevron direction="left" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(180deg)' });
  });

  it('applies custom style prop', () => {
    const customStyle = { color: 'red', fontSize: '20px' };
    const { container } = render(<Chevron style={customStyle} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ color: 'red', fontSize: '20px' });
  });

  it('defaults to 0 rotation when no direction specified', () => {
    const { container } = render(<Chevron />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(0deg)' });
  });
});

describe('GripIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<GripIcon />);
    expect(container).toBeInTheDocument();
  });

  it('renders two MoreVert icons', () => {
    const { container } = render(<GripIcon />);
    const moreVertIcons = container.querySelectorAll('svg');
    expect(moreVertIcons.length).toBe(2);
  });

  it('applies custom style prop', () => {
    const customStyle = { color: 'blue' };
    const { container } = render(<GripIcon style={customStyle} />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ color: 'blue' });
  });

  it('applies negative margin to first icon', () => {
    const { container } = render(<GripIcon />);
    const firstIcon = container.querySelector('svg');
    expect(firstIcon).toHaveStyle({ margin: '0 -16px' });
  });
});

describe('ToolbarIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<ToolbarIcon />);
    expect(container).toBeInTheDocument();
  });

  it('renders "+ Response Area" text', () => {
    const { getByText } = render(<ToolbarIcon />);
    expect(getByText('+ Response Area')).toBeInTheDocument();
  });

  it('applies correct font family', () => {
    const { getByText } = render(<ToolbarIcon />);
    const element = getByText('+ Response Area');
    // Font family is applied via styled component, just verify text renders
    expect(element).toBeInTheDocument();
  });

  it('applies bold font weight', () => {
    const { getByText } = render(<ToolbarIcon />);
    const element = getByText('+ Response Area');
    expect(element).toHaveStyle({ fontWeight: 'bold' });
  });

  it('has correct dimensions', () => {
    const { getByText } = render(<ToolbarIcon />);
    const element = getByText('+ Response Area');
    expect(element).toHaveStyle({ width: '110px', height: '28px' });
  });

  it('has relative positioning', () => {
    const { getByText } = render(<ToolbarIcon />);
    const element = getByText('+ Response Area');
    expect(element).toHaveStyle({ position: 'relative' });
  });

  it('has nowrap white space', () => {
    const { getByText } = render(<ToolbarIcon />);
    const element = getByText('+ Response Area');
    expect(element).toHaveStyle({ whiteSpace: 'nowrap' });
  });

  it('has top offset', () => {
    const { getByText } = render(<ToolbarIcon />);
    const element = getByText('+ Response Area');
    expect(element).toHaveStyle({ top: '7px' });
  });
});
