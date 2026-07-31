import React from 'react';
import { render } from '@testing-library/react';
import DragDropChoice from '../choice';

// Mock @dnd-kit hooks to avoid DndContext requirement
jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  })),
}));

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

// Collect the CSS rules emotion/MUI injected into the document (jsdom uses insertRule).
const collectEmotionRules = () => {
  const rules = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        rules.push(rule.cssText);
      }
    } catch (e) {
      /* inaccessible stylesheet */
    }
  }
  return rules;
};

describe('drag-in-the-blank choice', () => {
  const defaultProps = {
    value: { id: '1', value: '<math>1/2</math>' },
    disabled: false,
    instanceId: 'test-instance',
    n: { key: 'key-0' },
    nodeProps: {},
    opts: { options: { duplicates: false } },
  };

  it('renders without crashing', () => {
    const { container } = render(<DragDropChoice {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('fraction math styling', () => {
    it('enlarges numerator/denominator digits adjacent to a fraction to 120%', () => {
      render(<DragDropChoice {...defaultProps} />);
      const rule = collectEmotionRules().find((r) => r.includes('mjx-mn') && r.includes('mjx-mfrac'));
      expect(rule).toBeDefined();
      expect(rule).toMatch(/mjx-mn:has\(~\s*mjx-mfrac\)/);
      expect(rule).toMatch(/mjx-mfrac\s*~\s*mjx-mn/);
      expect(rule).toMatch(/font-size:\s*120%\s*!important/i);
    });

    it('keeps the existing mjx-frac 120% rule', () => {
      render(<DragDropChoice {...defaultProps} />);
      const rule = collectEmotionRules().find((r) => /(^|[^-])mjx-frac/.test(r) && !r.includes('mjx-mfrac'));
      expect(rule).toBeDefined();
      expect(rule).toMatch(/font-size:\s*120%\s*!important/i);
    });
  });
});
