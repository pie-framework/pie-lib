/**
 * Integration cover for the reason speech-rule-engine is started lazily: it loads
 * ~550KB of locale data over the network, and that must not happen just because
 * something imported math-rendering.
 *
 * Runs against the real mathjax/speech-rule-engine graph with XMLHttpRequest
 * stubbed, so it records requests without making any.
 */
const requested = [];

class RecordingXHR {
  open(method, url) {
    requested.push(url);
  }
  send() {}
  get status() {
    return 0;
  }
  get responseText() {
    return '';
  }
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 300));

const mathElement = (latex) => {
  const div = document.createElement('div');

  div.innerHTML = `<span data-latex="">\\(${latex}\\)</span>`;
  document.body.appendChild(div);

  return div;
};

describe('speech-rule-engine locale loading', () => {
  beforeEach(() => {
    jest.resetModules();
    requested.length = 0;
    document.body.innerHTML = '';
    delete window['@pie-lib/math-rendering@2'];
    window.XMLHttpRequest = RecordingXHR;
  });

  it('loads no locale data until math is actually rendered', async () => {
    const { renderMath } = require('@pie-lib/math-rendering');

    await settle();

    expect(requested).toEqual([]);

    renderMath(mathElement('1+1'));
    await settle();

    expect(requested).toContain('https://cdn.jsdelivr.net/npm/speech-rule-engine@4.1.2/lib/mathmaps/base.json');
  });

  it('loads it from mathmapsPath when the host serves its own copy', async () => {
    window['@pie-lib/math-rendering@2'] = { opts: { mathmapsPath: '/assets/sre/mathmaps' } };

    const { renderMath } = require('@pie-lib/math-rendering');

    renderMath(mathElement('2+2'));
    await settle();

    expect(requested).toContain('/assets/sre/mathmaps/base.json');
    expect(requested.some((url) => url.includes('jsdelivr'))).toBe(false);
  });
});
