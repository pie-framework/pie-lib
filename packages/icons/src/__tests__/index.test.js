import React from 'react';
import { render, screen } from '@pie-lib/test-utils';
import {
  Correct,
  CorrectResponse,
  Incorrect,
  Instructions,
  LearnMore,
  NothingSubmitted,
  PartiallyCorrect,
  ShowRationale,
} from '../index';

describe('@pie-lib/icons', () => {
  describe('Correct Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<Correct />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 44 40');
    });

    it('renders with check iconSet by default', () => {
      const { container } = render(<Correct />);
      // Check icon should render (contains polygon for checkmark)
      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
    });

    it('renders with emoji iconSet', () => {
      const { container } = render(<Correct iconSet="emoji" />);
      // Emoji icon contains paths and rects
      const elements = container.querySelectorAll('path, rect');
      expect(elements.length).toBeGreaterThan(0);
    });

    it('renders with round shape by default', () => {
      const { container } = render(<Correct />);
      // Round shape has a circle element
      const circle = container.querySelector('circle');
      expect(circle).toBeInTheDocument();
    });

    it('renders with square shape', () => {
      const { container } = render(<Correct shape="square" />);
      // Square shape has a rect element
      const rect = container.querySelector('rect');
      expect(rect).toBeInTheDocument();
    });

    it('renders with feedback category and round shape', () => {
      const { container } = render(<Correct category="feedback" shape="round" />);
      // Feedback round box has a specific path
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
    });

    it('renders with feedback category and square shape', () => {
      const { container } = render(<Correct category="feedback" shape="square" />);
      // Multiple polygons for square feedback
      const polygons = container.querySelectorAll('polygon');
      expect(polygons.length).toBeGreaterThan(0);
    });

    it('renders in open state', () => {
      const { container } = render(<Correct open={true} />);
      // In open state, should show background only (fewer elements)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with custom size as number', () => {
      const { container } = render(<Correct size={50} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({ width: '50px', height: '50px' });
    });

    it('renders with custom size as string', () => {
      const { container } = render(<Correct size="100px" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({ width: '100px', height: '100px' });
    });
  });

  describe('Incorrect Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<Incorrect />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with check iconSet (X mark)', () => {
      const { container } = render(<Incorrect iconSet="check" />);
      // X mark contains rect elements
      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('renders with emoji iconSet', () => {
      const { container } = render(<Incorrect iconSet="emoji" />);
      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('renders with custom colors', () => {
      const { container } = render(<Incorrect fg="#ff0000" bg="#00ff00" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('PartiallyCorrect Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<PartiallyCorrect />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with check iconSet', () => {
      const { container } = render(<PartiallyCorrect iconSet="check" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with emoji iconSet', () => {
      const { container } = render(<PartiallyCorrect iconSet="emoji" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('NothingSubmitted Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<NothingSubmitted />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(<NothingSubmitted />);
      const wrapper = container.firstChild;
      // NothingSubmitted uses default 30px size from IconRoot
      expect(wrapper).toHaveStyle({ width: '30px', height: '30px' });
    });
  });

  describe('CorrectResponse Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<CorrectResponse />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders SVG with proper viewBox', () => {
      const { container } = render(<CorrectResponse />);
      const svg = container.querySelector('svg');
      // CorrectResponse uses CloseIcon by default which has viewBox="-129.5 127 34 35"
      expect(svg).toHaveAttribute('viewBox', '-129.5 127 34 35');
    });
  });

  describe('LearnMore Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<LearnMore />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with custom colors', () => {
      const { container } = render(<LearnMore fg="#333333" bg="#ffffff" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('ShowRationale Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<ShowRationale />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with custom size', () => {
      const { container } = render(<ShowRationale size="60px" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({ width: '60px', height: '60px' });
    });
  });

  describe('Instructions Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<Instructions />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders SVG with proper viewBox', () => {
      const { container } = render(<Instructions />);
      const svg = container.querySelector('svg');
      // Instructions SVG has a specific viewBox
      expect(svg).toHaveAttribute('viewBox', '-128 129 31 31');
    });
  });

  describe('Icon Combinations', () => {
    it('renders multiple icons together', () => {
      const { container } = render(
        <div>
          <Correct />
          <Incorrect />
          <PartiallyCorrect />
        </div>
      );

      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(3);
    });

    it('handles all iconSet variations', () => {
      const icons = [
        <Correct key="1" iconSet="check" />,
        <Correct key="2" iconSet="emoji" />,
        <Incorrect key="3" iconSet="check" />,
        <Incorrect key="4" iconSet="emoji" />,
      ];

      const { container } = render(<div>{icons}</div>);
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(4);
    });

    it('handles all shape variations', () => {
      const icons = [
        <Correct key="1" shape="round" />,
        <Correct key="2" shape="square" />,
        <Incorrect key="3" shape="round" />,
        <Incorrect key="4" shape="square" />,
      ];

      const { container } = render(<div>{icons}</div>);
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(4);
    });

    it('handles feedback category with both shapes', () => {
      const icons = [
        <Correct key="1" category="feedback" shape="round" />,
        <Correct key="2" category="feedback" shape="square" />,
        <Incorrect key="3" category="feedback" shape="round" />,
        <Incorrect key="4" category="feedback" shape="square" />,
      ];

      const { container } = render(<div>{icons}</div>);
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(4);
    });
  });

  describe('Accessibility', () => {
    it('renders SVG elements that can be styled', () => {
      const { container } = render(<Correct />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox');
      expect(svg).toHaveAttribute('preserveAspectRatio');
    });

    it('maintains aspect ratio for responsive sizing', () => {
      const { container } = render(<Correct size={100} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMinYMin meet');
    });
  });

  describe('Default Values', () => {
    it('Correct icon has correct default values', () => {
      const { container } = render(<Correct />);
      // Should render with default size
      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();
    });

    it('Incorrect icon has correct default values', () => {
      const { container } = render(<Incorrect />);
      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();
    });

    it('all icons render without errors', () => {
      const icons = [
        <Correct key="correct" />,
        <Incorrect key="incorrect" />,
        <PartiallyCorrect key="partially" />,
        <NothingSubmitted key="nothing" />,
        <CorrectResponse key="correctResponse" />,
        <LearnMore key="learnMore" />,
        <ShowRationale key="showRationale" />,
        <Instructions key="instructions" />,
      ];

      const { container } = render(<div>{icons}</div>);
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(8);
    });
  });
});
