import * as React from 'react';
import { hasText } from '../has-text';

describe('has-text', () => {
  it('div with text returns true', () => {
    const input = '<div>Rationale</div>';

    expect(hasText(input)).toEqual(true);
  });

  it('text returns true', () => {
    const input = 'Rationale';
    expect(hasText(input)).toEqual(true);
  });

  it('empty div returns false', () => {
    const input = '<div></div>';
    expect(hasText(input)).toEqual(false);
  });

  it('empty string returns false', () => {
    const input = '';
    expect(hasText(input)).toEqual(false);
  });

  it('null returns false', () => {
    const input = null;
    expect(hasText(input)).toEqual(false);
  });
});
