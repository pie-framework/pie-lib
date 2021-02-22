import * as React from 'react';
import { shallow } from 'enzyme';
import { parseHtmlHasText } from '../parseHtmlHasText';

describe('parseHtmlHasText', () => {
  it('div with text returns true', () => {
    const input = '<div>Rationale</div>';

    expect(parseHtmlHasText(input)).toEqual(true);
  });

  it('text returns true', () => {
    const input = 'Rationale';
    expect(parseHtmlHasText(input)).toEqual(true);
  });

  it('empty div returns false', () => {
    const input = '<div></div>';
    expect(parseHtmlHasText(input)).toEqual(false);
  });

  it('empty string returns false', () => {
    const input = '';
    expect(parseHtmlHasText(input)).toEqual(false);
  });

  it('null returns false', () => {
    const input = null;
    expect(parseHtmlHasText(input)).toEqual(false);
  });
});
