import { htmlToValue } from '../serialization';

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
            data: {},
            isVoid: false,
            nodes: [
              {
                object: 'block',
                type: 'paragraph',
                data: {},
                isVoid: false,
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
});
