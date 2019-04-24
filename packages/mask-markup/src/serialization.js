import Html from 'slate-html-serializer';

const INLINE = ['span'];
const MARK = ['em', 'strong', 'u'];
const TEXT_NODE = 3;

const attr = el => {
  if (!el.attributes || el.attributes.length <= 0) {
    return undefined;
  }

  const out = {};

  for (var i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];
    if (!a.name.startsWith('data-')) {
      out[a.name] = a.value;
    }
  }

  return out;
};

const getObject = type => {
  if (INLINE.includes(type)) {
    return 'inline';
  } else if (MARK.includes(type)) {
    return 'mark';
  }
  return 'block';
};

const rules = [
  {
    deserialize: (el, next) => {
      if (el.nodeType === TEXT_NODE) {
        return {
          object: 'text',
          leaves: [{ text: el.textContent }]
        };
      }
      const type = el.tagName.toLowerCase();

      const attributes = attr(el) || {};
      const object = getObject(type);
      return {
        object,
        type,
        data: { dataset: { ...el.dataset }, attributes: { ...attributes } },
        nodes: next(el.childNodes)
      };
    },
    serialize: () => undefined
  }
];

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules, defaultBlock: 'div' });

export const deserialize = s => html.deserialize(s, { toJSON: true });
