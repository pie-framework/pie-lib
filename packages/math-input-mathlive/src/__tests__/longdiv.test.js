import { fixLongDivision, fixLongDivisionWhenReady, trackLongDivision } from '../longdiv';

/**
 * Markup captured verbatim from MathLive 0.110.0 `convertLatexToMarkup` in
 * Chrome. In `12\enclose{longdiv}{144}` MathLive drops the dividend 0.45em
 * (`top:0.45em`), sizes the box 2.1em wide while the viewBox is 2.54 wide, and
 * ends the bar at 1.8 although the dividend runs to 0.3 + 0.45 + 1.5 = 2.25.
 */
const LONGDIV =
  '<span class="ML__latex"><span class="ML__strut" style="height:0.8em"></span><span class="ML__strut--bottom" style="height:1.25em;vertical-align:-0.44em"></span><span class="ML__base"><span class="ML__cmr">12</span><span style="position:relative;height:1.24em;display:inline-block;margin-left:0.3em;margin-right:0.3em;width:1.95em"><span class="ML__notation" style="box-sizing:border-box;left:calc(-1 * 1px - 0.3em);height:calc( 1.24444em + 1px);top:0em;width:calc(2.1em + 1px);background-color:transparent"><span style="display: inline-block;height:1.24em;vertical-align:0.44em;"></span><svg style="position:absolute;overflow:visible;height:1.24em;top:0;left:0;width:100%;z-index:2;" stroke-width="0.06em" stroke="currentColor" stroke-linecap="round" viewBox="0 0 2.54 1.24"><line x1="0.3"  y1="0.3" x2="1.8" y2="0.3" vector-effect="non-scaling-stroke"></line><path d="M 0.3 0.3  a0.3 0.46997, 0, 1, 1, 0 0.93994 " stroke-width="0.004em" stroke="currentColor" fill="none"/></svg></span><span style="position:relative;display:inline-block;height:0.65em;width:1.5em;margin-left:0.45em;top:0.45em"><span class="ML__cmr">144</span></span></span></span></span>';

// \enclose{box}{x}: another notation, which must be left alone
const BOX =
  '<span class="ML__latex"><span class="ML__strut" style="height:1.04em"></span><span class="ML__base"><span style="position:relative;height:1.03em;display:inline-block;margin-left:0.3em;margin-right:0.3em;width:0.58em"><span class="ML__notation" style="box-sizing:border-box;left:calc(-1 * 1px - 0.3em);height:calc( 1.03056em + 1px);top:0em;width:calc(1.17153em + 1px);background-color:transparent;border:1px solid red"></span><span style="position:relative;display:inline-block;height:0.44em;width:0.58em"><span class="ML__mathit">x</span></span></span></span></span>';

const mount = (html) => {
  const el = document.createElement('div');

  el.innerHTML = html;
  document.body.appendChild(el);

  return el;
};

const parts = (el) => {
  const notation = el.querySelector('.ML__notation');

  return {
    notation,
    box: notation.parentElement,
    dividend: notation.nextElementSibling,
    line: notation.querySelector('line'),
  };
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('fixLongDivision', () => {
  it('puts the dividend back on the baseline', () => {
    const el = mount(LONGDIV);

    fixLongDivision(el);

    const { dividend, box } = parts(el);

    expect(dividend.style.top).toEqual('0px');
    // the drawing keeps its place relative to the dividend, and the line grows
    // so the field does not clip the bar
    expect(box.style.paddingTop).toEqual('0.45em');
  });

  it('sizes the box to the viewBox, so the drawing is not scaled down', () => {
    const el = mount(LONGDIV);

    fixLongDivision(el);

    expect(parts(el).notation.style.width).toEqual('calc(2.54em + 1px)');
  });

  it('runs the bar to the end of the dividend', () => {
    const el = mount(LONGDIV);

    fixLongDivision(el);

    // no layout under jsdom, so from MathLive's numbers: start + gap + width
    expect(parseFloat(parts(el).line.getAttribute('x2'))).toBeCloseTo(0.3 + 0.45 + 1.5, 6);
  });

  // MathLive's width leaves out the spacing around `,` and `+`, so when the
  // markup is laid out the end is measured instead.
  it('measures the bar end from the rendered dividend when laid out', () => {
    const el = mount(LONGDIV);
    const { notation, dividend } = parts(el);
    const svg = notation.querySelector('svg');
    const glyph = dividend.querySelector('.ML__cmr');

    // the svg is 254px wide for a 2.54-unit viewBox: 100px per unit
    svg.getBoundingClientRect = () => ({ left: 100, width: 254, right: 354 });
    glyph.getBoundingClientRect = () => ({ left: 145, right: 340, width: 195 });

    fixLongDivision(el);

    expect(parseFloat(parts(el).line.getAttribute('x2'))).toBeCloseTo(2.4, 6);
  });

  it('ignores the caret when measuring', () => {
    const el = mount(LONGDIV);
    const { notation, dividend } = parts(el);
    const caret = document.createElement('span');

    caret.className = 'ML__caret';
    dividend.appendChild(caret);
    notation.querySelector('svg').getBoundingClientRect = () => ({ left: 100, width: 254, right: 354 });
    dividend.querySelector('.ML__cmr').getBoundingClientRect = () => ({ left: 145, right: 340, width: 195 });
    caret.getBoundingClientRect = () => ({ left: 400, right: 402, width: 2 });

    fixLongDivision(el);

    expect(parseFloat(parts(el).line.getAttribute('x2'))).toBeCloseTo(2.4, 6);
  });

  it('can run again without drifting', () => {
    const el = mount(LONGDIV);

    fixLongDivision(el);
    const first = { ...parts(el), x2: parts(el).line.getAttribute('x2') };

    fixLongDivision(el);
    const second = parts(el);

    expect(second.line.getAttribute('x2')).toEqual(first.x2);
    expect(second.box.style.paddingTop).toEqual('0.45em');
    expect(second.notation.style.width).toEqual('calc(2.54em + 1px)');
  });

  it('leaves other enclose notations alone', () => {
    const el = mount(BOX);
    const before = el.innerHTML;

    expect(fixLongDivision(el)).toBe(0);
    expect(el.innerHTML).toEqual(before);
  });

  it('counts what it corrected', () => {
    expect(fixLongDivision(mount(LONGDIV + LONGDIV))).toBe(2);
  });

  it('is safe on nothing', () => {
    expect(fixLongDivision(null)).toBe(0);
    expect(fixLongDivision(mount('<span>plain</span>'))).toBe(0);
  });
});

describe('fixLongDivisionWhenReady', () => {
  it('corrects now, and again once the fonts have loaded', async () => {
    let fontsLoaded;
    const original = document.fonts;

    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: new Promise((resolve) => (fontsLoaded = resolve)) },
    });

    try {
      const el = mount(LONGDIV);

      fixLongDivisionWhenReady(el);
      expect(parts(el).dividend.style.top).toEqual('0px');

      // a re-render before the fonts arrive...
      el.innerHTML = LONGDIV;
      fontsLoaded();
      await Promise.resolve();
      await Promise.resolve();

      // ...is corrected once they do
      expect(parts(el).dividend.style.top).toEqual('0px');
    } finally {
      Object.defineProperty(document, 'fonts', { configurable: true, value: original });
    }
  });
});

describe('trackLongDivision', () => {
  const field = () => {
    const host = document.createElement('div');

    host.attachShadow({ mode: 'open' });
    host.shadowRoot.innerHTML = LONGDIV;
    document.body.appendChild(host);

    return host;
  };

  it('corrects the field straight away', () => {
    const host = field();

    trackLongDivision(host);

    expect(parts(host.shadowRoot).dividend.style.top).toEqual('0px');
  });

  // jest.setup.js replaces MutationObserver with a no-op for every test, so this
  // installs one that records what it was asked to observe and can be fired.
  describe('re-rendering', () => {
    let observers;
    const RealObserver = global.MutationObserver;

    beforeEach(() => {
      observers = [];
      global.MutationObserver = class {
        constructor(callback) {
          this.callback = callback;
          this.disconnected = false;
          observers.push(this);
        }

        observe(target, options) {
          this.target = target;
          this.options = options;
        }

        disconnect() {
          this.disconnected = true;
        }
      };
    });

    afterEach(() => {
      global.MutationObserver = RealObserver;
    });

    it('watches the whole shadow tree for MathLive rebuilding it', () => {
      const host = field();

      trackLongDivision(host);

      expect(observers).toHaveLength(1);
      expect(observers[0].target).toBe(host.shadowRoot);
      expect(observers[0].options).toEqual({ childList: true, subtree: true });
    });

    // MathLive rebuilds its shadow DOM on every keystroke, resize and font load.
    it('re-corrects after MathLive re-renders', () => {
      const host = field();

      trackLongDivision(host);
      host.shadowRoot.innerHTML = LONGDIV;
      expect(parts(host.shadowRoot).dividend.style.top).toEqual('0.45em');

      observers[0].callback([]);

      expect(parts(host.shadowRoot).dividend.style.top).toEqual('0px');
    });

    // The corrections change attributes only, so observing childList alone
    // cannot loop.
    it('does not observe attributes', () => {
      trackLongDivision(field());

      expect(observers[0].options.attributes).toBeUndefined();
    });

    it('stops after teardown', () => {
      const untrack = trackLongDivision(field());

      untrack();

      expect(observers[0].disconnected).toBe(true);
    });
  });

  it('is a no-op without a shadow root', () => {
    expect(trackLongDivision(undefined)).toBeUndefined();
    expect(trackLongDivision(document.createElement('div'))).toBeUndefined();
  });
});
