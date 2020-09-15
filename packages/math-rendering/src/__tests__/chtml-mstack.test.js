import { getStackData } from '../chtml-mstack';

const node = (kind, extras) => ({ kind, childNodes: [], ...extras });

const textNode = text => node('text', { text });
const mn = text => node('mn', { childNodes: [textNode(text)] });
const mo = text => node('mo', { childNodes: [textNode(text)] });

const msrow = (...childNodes) => node('msrow', { childNodes });
const mstack = (...rows) => node('mstack', { childNodes: rows });
const msline = () => node('msline');
describe('getStackData', () => {
  it.each`
    input                                                  | expected
    ${mstack(mn('111'))}                                   | ${[['1', '1', '1']]}
    ${mstack(msrow(mn('111')))}                            | ${[['1', '1', '1']]}
    ${mstack(msrow(mn('111')), mn('222'))}                 | ${[['1', '1', '1'], ['2', '2', '2']]}
    ${mstack(msrow(mn('111')), msrow(mo('+'), mn('222')))} | ${[['1', '1', '1'], ['+', '2', '2', '2']]}
    ${mstack(msline())}                                    | ${[['line']]}
    ${mstack(msrow(msline(), mn('1')))}                    | ${[['line', '1']]}
  `('$input=> $expected', ({ input, expected }) => {
    const d = getStackData(input);
    // const d = getStackData(mstack(msrow(mo('+'), mn('111'))));
    expect(d).toEqual(expected);
  });
  // it('works', () => {
  //   const d = getStackData(mstack(mn('111')));
  //   // const d = getStackData(mstack(msrow(mo('+'), mn('111'))));
  //   expect(d).toEqual([['1', '1', '1']]);
  // });
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
