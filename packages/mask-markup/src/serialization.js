import React from 'react';
import Html from 'slate-html-serializer';
import { object as toStyleObject } from 'to-style';
import debug from 'debug';

const log = debug('@pie-lib:mask-markup:serialization');

const INLINE = ['span', 'source'];
const MARK = ['em', 'strong', 'u'];
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

const attr = el => {
  if (!el.attributes || el.attributes.length <= 0) {
    return undefined;
  }

  const out = {};
  let i;

  for (i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];

    out[a.name] = a.value;
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

export const parseStyleString = s => {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match;
  const result = {};
  while ((match = regex.exec(s))) {
    result[match[1]] = match[2].trim();
  }
  return result;
};

export const reactAttributes = o => toStyleObject(o, { camelize: true, addUnits: false });

const handleStyles = (el, attribute) => {
  const styleString = el.getAttribute(attribute);

  return reactAttributes(parseStyleString(styleString));
};

const handleClass = (el, acc, attribute) => {
  const classNames = el.getAttribute(attribute);

  delete acc.class;

  return classNames;
};

const attributesToMap = el => (acc, attribute) => {
  if (!el.getAttribute) {
    return acc;
  }

  const value = el.getAttribute(attribute);

  if (value) {
    switch (attribute) {
      case 'style':
        acc.style = handleStyles(el, attribute);
        break;
      case 'class':
        acc.className = handleClass(el, acc, attribute);
        break;
      default:
        acc[attribute] = el.getAttribute(attribute);
        break;
    }
  }

  return acc;
};

const attributes = ['border', 'class', 'style'];

/**
 * Tags to marks.
 *
 * @type {Object}
 */

export const MARK_TAGS = {
  b: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
  strong: 'strong'
};

const marks = {
  deserialize(el, next) {
    const mark = MARK_TAGS[el.tagName.toLowerCase()];
    if (!mark) return;
    log('[deserialize] mark: ', mark);
    return {
      object: 'mark',
      type: mark,
      nodes: next(el.childNodes)
    };
  }
};

const rules = [
  marks,
  {
    /**
     * deserialize everything, we're not fussy about the dom structure for now.
     */
    deserialize: (el, next) => {
      if (el.nodeType === COMMENT_NODE) {
        return undefined;
      }

      if (el.nodeType === TEXT_NODE) {
        return {
          object: 'text',
          leaves: [{ text: el.textContent }]
        };
      }

      const type = el.tagName.toLowerCase();

      let normalAttrs;

      if (type == 'audio' && attr(el)?.controls == '') {
        normalAttrs = { controls: true };
      } else {
        normalAttrs = attr(el) || {};
      }

      const allAttrs = attributes.reduce(attributesToMap(el), { ...normalAttrs });
      const object = getObject(type);

      if (el.tagName.toLowerCase() === 'math') {
        return {
          isMath: true,
          nodes: [el]
        };
      }

      return {
        object,
        type,
        data: { dataset: { ...el.dataset }, attributes: { ...allAttrs } },
        nodes: next(el.childNodes)
      };
    }
  }
];

/**
 * Create a new serializer instance with our `rules` from above.
 * Having a default div block will just put every div on it's own line, which is not ideal.
 */
const html = new Html({ rules, defaultBlock: 'span' });

export const deserialize = s => html.deserialize(s, { toJSON: true });
