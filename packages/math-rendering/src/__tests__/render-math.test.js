import { renderMath } from '..';

const katexRender = require('katex/dist/contrib/auto-render.min');

jest.mock('katex/dist/contrib/auto-render.min', () => jest.fn(), {
  virtual: true
});

jest.mock('katex/dist/katex.css', () => ({}));

describe('render-math', () => {
  it('calls katex render', () => {
    renderMath({});
    expect(katexRender).toHaveBeenCalledWith({}, expect.anything());
  });
});
