import { renderMath } from '..';

const katexRender = require('katex/dist/contrib/auto-render.min');

jest.mock('katex/dist/contrib/auto-render.min', () => jest.fn(), {
  virtual: true
});

jest.mock('katex/dist/katex.css', () => ({}));

describe('render-math', () => {
  it('calls katex render', () => {
    const div = document.createElement('div');
    renderMath(div);
    expect(katexRender).toHaveBeenCalledWith(div, expect.anything());
  });

  it('call render math for an array of elements', () => {
    katexRender.mockReset();
    renderMath([{}, {}]);
    expect(katexRender).toHaveBeenCalledTimes(2);
  });
});
