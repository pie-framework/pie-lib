import { htmlToValue, TEXT_RULE } from '../serialization';

jest.mock('../plugins/math', () => ({
  serialization: {
    serialize: jest.fn((o, c) => {
      return undefined;
    }),
    deserialize: jest.fn((el, next) => {
      return undefined;
    })
  }
}));

describe('TEXT_RULE', () => {
  const mkBr = previousSibling => {
    return {
      remove: jest.fn(),
      previousSibling,
      replaceWith: foo => {
        previousSibling.textContent = previousSibling.textContent.replace(/(<br>)|(<\/br>)/g, foo);
      },
      normalize: jest.fn().mockReturnThis(),
      tagName: 'br'
    };
  };

  const mkTextNode = (textContent = '') => ({
    nodeName: '#text',
    textContent,
    normalize: jest.fn().mockReturnThis()
  });

  const mkEl = querySelectorAllResult => ({
    querySelectorAll: jest.fn().mockReturnValue(querySelectorAllResult),
    normalize: jest.fn().mockReturnThis()
  });

  describe('deserialize', () => {
    it('if no previous text node, no error is thrown', () => {
      const br = mkBr();
      const el = mkEl([br]);
      expect(() => TEXT_RULE.deserialize(el)).not.toThrow();
    });
  });
});

describe('htmlToValue', () => {
  it('converts', () => {
    const expected = {
      object: 'value',
      document: {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: 'div',
            isVoid: false,
            data: {
              attributes: {}
            },
            nodes: [
              {
                object: 'block',
                type: 'paragraph',
                isVoid: false,
                data: {
                  attributes: {}
                },
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        text: 'foo',
                        marks: []
                      }
                    ]
                  },
                  {
                    object: 'inline',
                    type: 'image',
                    data: {
                      src: 'blah.jpg',
                      width: null,
                      height: null
                    },
                    isVoid: true,
                    nodes: [
                      {
                        object: 'text',
                        leaves: [
                          {
                            object: 'leaf',
                            text: '',
                            marks: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        text: 'bar',
                        marks: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    };
    const html = `<div><p>foo<img src="blah.jpg"/>bar</p></div>`;
    const v = htmlToValue(html);

    expect(v.toJSON()).toEqual(expected);
  });

  it('does not break', () => {
    /*
     More than 12 iterations of the same kind would previously break the input. Here we have 16 text nodes, and now it works.
     */
    const expected = {
      object: 'value',
      document: {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: 'div',
            isVoid: false,
            data: { attributes: {} },
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: 'Foo ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  },
                  {
                    object: 'leaf',
                    text: ' bar ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  },
                  {
                    object: 'leaf',
                    text: ' Foo ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  },
                  {
                    object: 'leaf',
                    text: ' bar ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  },
                  {
                    object: 'leaf',
                    text: ' Foo ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  },
                  {
                    object: 'leaf',
                    text: ' bar ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  },
                  {
                    object: 'leaf',
                    text: ' Foo ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  },
                  {
                    object: 'leaf',
                    text: ' bar ',
                    marks: []
                  },
                  {
                    object: 'leaf',
                    text: 'x',
                    marks: [
                      {
                        object: 'mark',
                        type: 'italic',
                        data: {}
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    };
    const html =
      '<div>Foo <em>x</em> bar <em>x</em> Foo <em>x</em> bar <em>x</em> Foo <em>x</em> bar <em>x</em> Foo <em>x</em> bar <em>x</em></div>';
    const v = htmlToValue(html);

    expect(v.toJSON()).toEqual(expected);
  });
});
