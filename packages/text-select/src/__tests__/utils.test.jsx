import { prepareText } from '../utils';

describe('logic', () => {

  it('returns text if no html elements', () => {
    const formattedText = prepareText(`foo bar`);

    expect(formattedText).toEqual('foo bar');
  });

  it('replaces br with new lines', () => {
    const formattedText = prepareText(`<p>foo<br>bar</p>`);

    expect(formattedText).toEqual('foo\nbar');
  });

  it('replaces p with 2 new lines', () => {
    const formattedText = prepareText(`<p>foo<br>bar</p><p>bar<br>foo</p>`);

    expect(formattedText).toEqual('foo\nbar\n\nbar\nfoo');
  });

  it('adds p if there are no paragraphs', () => {
    const formattedText = prepareText(`foo<br>bar<br>foo`);

    expect(formattedText).toEqual('foo\nbar\nfoo');
  });

});
