import { getStackData, Line, Row, CHTMLmstack } from '../chtml';
// import { CHTMLWrapper, instance } from 'mathjax-full/js/output/chtml/Wrapper';
import { JSDOM } from 'jsdom';

jest.mock('mathjax-full/js/output/chtml/Wrapper', () => {
  const instance = {
    adaptor: {
      document: {
        createElement: jest.fn()
      }
    },
    standardCHTMLnode: jest.fn()
  };

  return {
    instance,
    CHTMLWrapper: class {
      constructor() {
        this.adaptor = { document: { createElement: jest.fn() } };
        this.document = {};
        // return instance;
      }
    }
  };
});

const node = (kind, extras) => ({ kind, childNodes: [], ...extras });

const textNode = text => node('text', { text, node: { kind: 'text', text } });
const mn = text => node('mn', { childNodes: [textNode(text)] });
const mo = text =>
  node('mo', {
    childNodes: [textNode(text)]
  });

const mco = text => ({
  ...mo(text),

  toCHTML: n => {
    const t = `mo:${text}`;
    n.textContent = t;
  }
});

const msrow = (...childNodes) => node('msrow', { childNodes });
const mstack = (...rows) => node('mstack', { childNodes: rows });
const msline = () => node('msline');
describe('getStackData', () => {
  it.each`
    input                                                 | expected
    ${mstack(msrow(mo('+'), mn('111')))}                  | ${[new Row(['1', '1', '1'], mo('+'))]}
    ${mstack(msrow(mn('111')))}                           | ${[new Row(['1', '1', '1'])]}
    ${mstack(msrow(mn('1'), mn('1')))}                    | ${[new Row(['1', '1'])]}
    ${mstack(msrow(mn('1')), mn('1'))}                    | ${[new Row(['1']), new Row(['1'])]}
    ${mstack(msline())}                                   | ${[new Line()]}
    ${mstack(mn('1'), msline(), msrow(mo('+'), mn('1')))} | ${[new Row(['1']), new Line(), new Row(['1'], mo('+'))]}
    ${mstack(mn('1'), mn('1'))}                           | ${[new Row(['1']), new Row(['1'])]}
  `('$input => $expected', ({ input, expected }) => {
    const d = getStackData(input);
    // console.log('d:', d);
    // console.log('e:', expected);
    expect({ ...d }).toEqual({ ...expected });
  });
});

describe('Row', () => {
  describe('pad', () => {
    it.each`
      cols   | count | expected
      ${[]}  | ${0}  | ${[]}
      ${[1]} | ${1}  | ${[1]}
      ${[1]} | ${2}  | ${['__pad__', 1]}
      ${[1]} | ${3}  | ${['__pad__', '__pad__', 1]}
    `('pads to the right', ({ cols, count, expected }) => {
      const r = new Row(cols);
      const p = r.pad(count, 'right');
      expect(p).toEqual(expected);
    });
  });
});

describe.each`
  label                       | tree
  ${'one row'}                | ${[msrow(mn('1'))]}
  ${'implicit one row'}       | ${[mn('1')]}
  ${'two rows'}               | ${[msrow(mn('1')), msrow(mn('2'))]}
  ${'two rows with operator'} | ${[msrow(mn('1')), msrow(mco('+'), mn('2'))]}
`('chtml', ({ label, tree }) => {
  let html;

  beforeEach(() => {
    const chtml = new CHTMLmstack({}, {});
    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
    chtml.standardCHTMLnode = parent => parent;
    chtml.ce = dom.window.document.createElement.bind(dom.window.document);
    chtml.childNodes = tree;
    chtml.toCHTML(dom.window.document.body);
    html = dom.window.document.body.innerHTML;
  });

  it(label, () => {
    expect(html).toMatchSnapshot();
  });
});
