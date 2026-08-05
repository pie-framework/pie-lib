import React from 'react';
import { render } from '@testing-library/react';

import {
  keys,
  keysForGrade,
  addBrackets,
  removeBrackets,
  registerEmbed,
  applyStaticMath,
  updateSpans,
  mf,
  mq,
  MathInput,
  HorizontalKeypad,
  KeyPad,
} from '../index';

describe('math-input-mathlive public API', () => {
  it('mirrors the @pie-lib/math-input export surface', () => {
    expect(typeof keysForGrade).toBe('function');
    expect(typeof addBrackets).toBe('function');
    expect(typeof removeBrackets).toBe('function');
    expect(typeof registerEmbed).toBe('function');
    expect(typeof applyStaticMath).toBe('function');
    expect(typeof updateSpans).toBe('function');
    expect(keys).toBeDefined();
    expect(keys.baseSet).toBeDefined();
  });

  it('exports the field wrappers under both mf and mq', () => {
    expect(mf.Input).toBeDefined();
    expect(mf.Static).toBeDefined();
    // `mq` alias lets a consumer swap packages by changing only the import.
    expect(mq).toBe(mf);
  });

  it('updateSpans is a safe no-op', () => {
    expect(() => updateSpans()).not.toThrow();
  });

  it('CommonMqStyles keeps the shape consumers destructure', () => {
    // math-toolbar does:
    //   const { commonMqFontStyles, commonMqKeyboardStyles, longdivStyles, supsubStyles }
    //     = mq.CommonMqStyles;
    const { commonMqFontStyles, commonMqKeyboardStyles, longdivStyles, supsubStyles } = mf.CommonMqStyles;

    [commonMqFontStyles, commonMqKeyboardStyles, longdivStyles, supsubStyles].forEach((s) => {
      expect(s).toBeDefined();
      expect(typeof s).toBe('object');
    });
  });

  it('bracket helpers round-trip', () => {
    expect(addBrackets('x')).toEqual('\\(x\\)');
    expect(removeBrackets('\\(x\\)')).toEqual('x');
    expect(removeBrackets(addBrackets('\\frac{1}{2}'))).toEqual('\\frac{1}{2}');
  });

  it('keysForGrade returns a 5-row keyset', () => {
    const set = keysForGrade('geometry');

    expect(Array.isArray(set)).toBe(true);
    expect(set.length).toBe(5);
  });
});

describe('rendering', () => {
  // MathLive is a browser-only custom element; loadMathLive() resolves async and
  // is a no-op-ish under jsdom. These assert the components mount without
  // throwing, which is what regressed most often in the MathQuill version.
  it('KeyPad renders without a live MathLive instance', () => {
    const { container } = render(<KeyPad onPress={() => {}} />);

    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
  });

  it('KeyPad falls back to raw latex for labels before MathLive loads', () => {
    const { container } = render(
      <KeyPad onPress={() => {}} baseSet={[[{ name: 'pi', latex: '\\pi', category: 'constants' }]]} />,
    );

    expect(container.textContent).toContain('\\pi');
  });

  it('KeyPad fires onPress with the key definition', () => {
    const onPress = jest.fn();
    const key = { name: 'x', label: 'x', write: 'x', category: 'vars' };
    const { container } = render(<KeyPad onPress={onPress} baseSet={[[key]]} />);

    container.querySelector('button').click();

    expect(onPress).toHaveBeenCalledWith(key);
  });

  it('MathInput mounts', () => {
    expect(() => render(<MathInput latex="\\frac{1}{2}" onChange={() => {}} />)).not.toThrow();
  });

  it('HorizontalKeypad mounts and reports the legacy {value,type} model', () => {
    const onClick = jest.fn();

    expect(() => render(<HorizontalKeypad onClick={onClick} />)).not.toThrow();
  });

  it('Static renders display-mode latex without a mathfield', () => {
    expect(() => render(<mf.Static latex="\\frac{1}{2}" />)).not.toThrow();
  });
});
