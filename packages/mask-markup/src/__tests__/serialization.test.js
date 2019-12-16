import { deserialize } from '../serialization';

describe('serialization', () => {
  it('ignores comments', () => {
    const out = deserialize(`<!-- hi -->`);
    expect(out.document.nodes[0]).toEqual(expect.objectContaining({ type: 'span' }));
  });

  it('ignores comments', () => {
    const out = deserialize(`<!-- hi --><div>foo</div>`);
    expect(out.document.nodes[0]).toEqual(
      expect.objectContaining({
        type: 'div',
        nodes: [expect.objectContaining({ object: 'text', leaves: [{ text: 'foo' }] })]
      })
    );
  });
});
