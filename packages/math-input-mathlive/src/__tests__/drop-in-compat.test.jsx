import React from 'react';
import { render } from '@testing-library/react';
import { styled } from '@mui/material/styles';

import { mq } from '../index';

/**
 * Exercises the exact call patterns real consumers use against
 * @pie-lib/math-input, to catch drop-in incompatibilities.
 *
 * Sources:
 *  - packages/math-toolbar/src/editor-and-pad.jsx:16,185
 *  - packages/math-toolbar/src/math-preview.jsx:8,156
 *  - packages/editable-html/src/plugins/respArea/math-templated/index.jsx:92
 *  - packages/editable-html-tip-tap/src/components/respArea/MathTemplated.jsx:111
 */
describe('drop-in compatibility with @pie-lib/math-input consumers', () => {
  describe('mq.CommonMqStyles destructuring', () => {
    it('math-preview.jsx: { commonMqFontStyles, longdivStyles, supsubStyles }', () => {
      const { commonMqFontStyles, longdivStyles, supsubStyles } = mq.CommonMqStyles;

      expect(commonMqFontStyles).toBeDefined();
      expect(longdivStyles).toBeDefined();
      expect(supsubStyles).toBeDefined();
    });

    it('editor-and-pad.jsx: also { commonMqKeyboardStyles }', () => {
      const { commonMqFontStyles, commonMqKeyboardStyles, longdivStyles, supsubStyles } = mq.CommonMqStyles;

      expect(commonMqKeyboardStyles).toBeDefined();
      // All four must be spreadable into an emotion style object.
      expect(() => ({
        ...commonMqFontStyles,
        ...commonMqKeyboardStyles,
        ...longdivStyles,
        ...supsubStyles,
      })).not.toThrow();
    });

    it('the destructured groups survive being spread into a styled component', () => {
      const { commonMqFontStyles, longdivStyles, supsubStyles } = mq.CommonMqStyles;
      const Styled = styled('div')({ ...commonMqFontStyles, ...longdivStyles, ...supsubStyles });

      expect(() => render(<Styled />)).not.toThrow();
    });
  });

  describe('mq.Input', () => {
    it('editor-and-pad.jsx: styled(mq.Input) renders', () => {
      const MathEditor = styled(mq.Input)(() => ({ width: '100%' }));

      expect(() => render(<MathEditor latex="\\frac{1}{2}" onChange={() => {}} />)).not.toThrow();
    });

    it('accepts the className that styled() injects', () => {
      const Styled = styled(mq.Input)({ padding: 4 });
      const { container } = render(<Styled latex="x" onChange={() => {}} />);

      expect(container.firstChild).toBeTruthy();
      expect(container.firstChild.className).toBeTruthy();
    });
  });

  describe('mq.Static', () => {
    it('math-preview.jsx: <mq.Static latex onFocus onBlur />', () => {
      expect(() => render(<mq.Static latex={'\\frac{1}{2}'} onFocus={() => {}} onBlur={() => {}} />)).not.toThrow();
    });

    it('math-templated respArea: <mq.Static latex={value} />', () => {
      expect(() => render(<mq.Static latex={'x=1'} />)).not.toThrow();
    });

    it('renders answer-block latex (the templated-math case) without throwing', () => {
      expect(() =>
        render(<mq.Static latex={'x=\\MathQuillMathField[r1]{}'} onSubFieldChange={() => {}} />),
      ).not.toThrow();
    });

    it('is styleable, as keypad labels were in math-input', () => {
      const Styled = styled(mq.Static)({ pointerEvents: 'none' });

      expect(() => render(<Styled latex={'\\pi'} />)).not.toThrow();
    });
  });

  describe('surface parity', () => {
    it('exposes exactly the names math-input exported', () => {
      // eslint-disable-next-line global-require
      const pkg = require('../index');

      [
        'keysForGrade',
        'addBrackets',
        'removeBrackets',
        'keys',
        'HorizontalKeypad',
        'mq',
        'updateSpans',
        'registerEmbed',
        'applyStaticMath',
      ].forEach((name) => {
        expect(pkg[name]).toBeDefined();
      });
    });

    it('mq exposes Input, Static and CommonMqStyles', () => {
      ['Input', 'Static', 'CommonMqStyles'].forEach((name) => {
        expect(mq[name]).toBeDefined();
      });
    });
  });
});
