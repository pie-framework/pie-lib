import Html from 'slate-html-serializer';

const BLOCK = ['div', 'p', 'pre'];
const INLINE = ['span'];
const MARK = ['em', 'strong', 'u'];

const des = (arr, object) => (el, next) => {
  const tn = el.tagName.toLowerCase();
  // console.log('tn:', tn);
  if (arr.includes(tn)) {
    return {
      object,
      type: tn,
      data: { ...el.dataset },
      nodes: next(el.childNodes)
    };
  }
};

const rules = [
  {
    deserialize: des(BLOCK, 'block'),
    serialize: () => undefined
  },
  {
    deserialize: des(INLINE, 'inline'),
    serialize: () => undefined
  },
  {
    deserialize: des(MARK, 'mark'),
    serialize: () => undefined
  }
];
// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules });

export const deserialize = s => html.deserialize(s, { toJSON: true });
