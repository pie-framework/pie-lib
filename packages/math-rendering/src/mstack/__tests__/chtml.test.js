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
  `('$input=> $expected', ({ input, expected }) => {
    const d = getStackData(input);
    // const d = getStackData(mstack(msrow(mo('+'), mn('111'))));
    expect(d).toEqual(expected);
  });
});

const s = {
  kind: 'mstack',
  childNodes: [
    {
      kind: 'mn',
      childNodes: [
        {
          kind: 'text',
          childNodes: [],
          node: {
            kind: 'text',
            childNodes: [],
            text: '3589'
          }
        }
      ],
      node: {
        kind: 'mn',
        childNodes: [
          {
            kind: 'text',
            childNodes: [],
            text: '3589'
          }
        ]
      }
    },
    {
      kind: 'msrow',
      childNodes: [
        {
          kind: 'mo',
          childNodes: [
            {
              kind: 'text',
              childNodes: [],
              node: {
                kind: 'text',
                childNodes: [],
                text: '+'
              }
            }
          ],
          node: {
            kind: 'mo',
            childNodes: [
              {
                kind: 'text',
                childNodes: [],
                text: '+'
              }
            ]
          }
        },
        {
          kind: 'mn',
          childNodes: [
            {
              kind: 'text',
              childNodes: [],
              node: {
                kind: 'text',
                childNodes: [],
                text: '5123'
              }
            }
          ],
          node: {
            kind: 'mn',
            childNodes: [
              {
                kind: 'text',
                childNodes: [],
                text: '5123'
              }
            ]
          }
        }
      ],
      node: {
        kind: 'msrow',
        childNodes: [
          {
            kind: 'mo',
            childNodes: [
              {
                kind: 'text',
                childNodes: [],
                text: '+'
              }
            ]
          },
          {
            kind: 'mn',
            childNodes: [
              {
                kind: 'text',
                childNodes: [],
                text: '5123'
              }
            ]
          }
        ]
      }
    },
    {
      kind: 'msline',
      childNodes: [],
      node: {
        kind: 'msline',
        childNodes: []
      }
    },
    {
      kind: 'msrow',
      childNodes: [],
      node: {
        kind: 'msrow',
        childNodes: []
      }
    }
  ],
  node: {
    kind: 'mstack',
    childNodes: [
      {
        kind: 'mn',
        childNodes: [
          {
            kind: 'text',
            childNodes: [],
            text: '3589'
          }
        ]
      },
      {
        kind: 'msrow',
        childNodes: [
          {
            kind: 'mo',
            childNodes: [
              {
                kind: 'text',
                childNodes: [],
                text: '+'
              }
            ]
          },
          {
            kind: 'mn',
            childNodes: [
              {
                kind: 'text',
                childNodes: [],
                text: '5123'
              }
            ]
          }
        ]
      },
      {
        kind: 'msline',
        childNodes: []
      },
      {
        kind: 'msrow',
        childNodes: []
      }
    ]
  }
};
