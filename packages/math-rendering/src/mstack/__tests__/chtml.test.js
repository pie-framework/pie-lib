import { getStackData, Line, Row } from '../chtml';

const node = (kind, extras) => ({ kind, childNodes: [], ...extras });

const textNode = text => node('text', { text, node: { kind: 'text', text } });
const mn = text => node('mn', { childNodes: [textNode(text)] });
const mo = text => node('mo', { childNodes: [textNode(text)] });

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
    expect(d).toEqual(expected);
  });
});
