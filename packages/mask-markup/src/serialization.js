import Html from 'slate-html-serializer';
import { object as toStyleObject } from 'to-style';

const INLINE = ['span'];
const MARK = ['em', 'strong', 'u'];
const TEXT_NODE = 3;

const getObject = type => {
  if (INLINE.includes(type)) {
    return 'inline';
  } else if (MARK.includes(type)) {
    return 'mark';
  }
  return 'block';
};

export const parseStyleString = s => {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match;
  const result = {};
  while ((match = regex.exec(s))) {
    result[match[1]] = match[2].trim();
  }
  return result;
};

export const reactAttributes = o => toStyleObject(o, { camelize: true });

const attributesToMap = el => (acc, attribute) => {
  const value = el.getAttribute(attribute);
  if (value) {
    if (attribute === 'style') {
      const styleString = el.getAttribute(attribute);
      const reactStyleObject = reactAttributes(parseStyleString(styleString));
      acc['style'] = reactStyleObject;
    } else {
      acc[attribute] = el.getAttribute(attribute);
    }
  }
  return acc;
};

const attributes = ['border', 'cellpadding', 'cellspacing', 'class', 'style'];

const rules = [
  {
    /**
     * deserialize everything, we're not fussy about the dom structure for now.
     */
    deserialize: (el, next) => {
      if (el.nodeType === TEXT_NODE) {
        return {
          object: 'text',
          leaves: [{ text: el.textContent }]
        };
      }
      const type = el.tagName.toLowerCase();

      const attr = attributes.reduce(attributesToMap(el), {});
      const object = getObject(type);

      return {
        object,
        type,
        data: { dataset: { ...el.dataset }, attributes: { ...attr } },
        nodes: next(el.childNodes)
      };
    }
  }
];

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules, defaultBlock: 'div' });

export const deserialize = s => html.deserialize(s, { toJSON: true });
