import { deserialize } from '../serialization';

describe('serialization', () => {
  it('ignores comments', () => {
    const out = deserialize(`<!-- hi -->`);

    expect(out.children[0]).toEqual(expect.objectContaining({ text: '' }));
  });

  it('ignores comments', () => {
    const out = deserialize(`<!-- hi --><div>foo</div>`);
    expect(out.children[0]).toEqual(
      expect.objectContaining({
        children: [
          {
            text: 'foo',
          },
        ],
        data: {
          attributes: {},
          dataset: {},
        },
        type: 'div',
      }),
    );
  });

  it('deserializes an em', () => {
    const out = deserialize(`<!-- hi --><div> <em>x</em> </div>`);
    expect(out.children[0]).toEqual({
      children: [
        {
          text: 'x',
          type: 'italic',
        },
        {
          text: ' ',
        },
      ],
      data: {
        attributes: {},
        dataset: {},
      },
      type: 'div',
    });
  });
});
