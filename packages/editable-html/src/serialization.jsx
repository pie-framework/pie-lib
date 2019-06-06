import Html from 'slate-html-serializer';
import React from 'react';
import debug from 'debug';
import { serialization as imgSerialization } from './plugins/image';
import { serialization as mathSerialization } from './plugins/math';
import { serialization as listSerialization } from './plugins/list';
import { serialization as tableSerialization } from './plugins/table';
import { serialization as responseAreaSerialization } from './plugins/response-area';
import { Mark, Value } from 'slate';

const log = debug('@pie-lib:editable-html:serialization');

/**
 * Tags to blocks.
 *
 * @type {Object}
 */

const BLOCK_TAGS = {
  div: 'div',
  span: 'span',
  p: 'paragraph',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six'
};

/**
 * Tags to marks.
 *
 * @type {Object}
 */

const MARK_TAGS = {
  b: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code'
};

/**
 * Serializer rules.
 *
 * @type {Array}
 */

const blocks = {
  deserialize(el, next) {
    log('[blocks:deserialize] block: ', el);
    const block = BLOCK_TAGS[el.tagName.toLowerCase()];
    if (!block) return;
    log('[blocks:deserialize] block: ', block);

    if (el.childNodes.length === 1) {
      const cn = el.childNodes[0];
      if (cn && cn.tagName && cn.tagName.toLowerCase() === block) {
        log('[we have a child node of the same]...');
        return;
      }
    }
    return {
      object: 'block',
      type: block,
      nodes: next(el.childNodes)
    };
  },
  serialize: (object, children) => {
    if (object.object !== 'block') return;

    log('[blocks:serialize] object: ', object, children);
    for (var key in BLOCK_TAGS) {
      if (BLOCK_TAGS[key] === object.type) {
        const Tag = key;
        return <Tag>{children}</Tag>;
      }
    }
  }
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
  },
  serialize(object, children) {
    if (Mark.isMark(object)) {
      for (var key in MARK_TAGS) {
        if (MARK_TAGS[key] === object.type) {
          const Tag = key;
          return <Tag>{children}</Tag>;
        }
      }
    }
  }
};

const TEXT_RULE = {
  deserialize(el) {
    if (el.tagName && el.tagName.toLowerCase() === 'br') {
      return {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: '\n'
          }
        ]
      };
    }

    if (el.nodeName == '#text') {
      if (el.nodeValue && el.nodeValue.match(/<!--.*?-->/)) return;

      log('[text:deserialize] return text object..');
      return {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: el.nodeValue
          }
        ]
      };
    }
  },

  serialize(obj, children) {
    if (obj.object === 'string') {
      return children.split('\n').reduce((array, text, i) => {
        if (i != 0) array.push(<br />);
        array.push(text);
        return array;
      }, []);
    }
  }
};

const RULES = [
  listSerialization,
  mathSerialization,
  imgSerialization,
  tableSerialization,
  responseAreaSerialization,
  TEXT_RULE,
  blocks,
  marks
];

function allWhitespace(node) {
  // Use ECMA-262 Edition 3 String and RegExp features
  return !/[^\t\n\r ]/.test(node.textContent);
}

function defaultParseHtml(html) {
  if (typeof DOMParser === 'undefined') {
    throw new Error(
      'The native `DOMParser` global which the `Html` serializer uses by default is not present in this environment. You must supply the `options.parseHtml` function instead.'
    );
  }

  const parsed = new DOMParser().parseFromString(html, 'text/html');

  const { body } = parsed;
  var textNodes = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, null);
  var n = textNodes.nextNode();

  while (n) {
    if (allWhitespace(n) || n.nodeValue === '\u200B') {
      n.parentNode.removeChild(n);
    }
    n = textNodes.nextNode();
  }

  return body;
}

/** If this lib is used on the server side, we need to bypass using the DOMParser - just put in a stub. */
const parseHtml =
  typeof window === 'undefined'
    ? () => ({
        childNodes: []
      })
    : defaultParseHtml;

const serializer = new Html({
  defaultBlock: 'div',
  rules: RULES,
  parseHtml
});

export const htmlToValue = html => serializer.deserialize(html);

export const valueToHtml = value => serializer.serialize(value);

/**
 *
 * <div><div>a</div></div> -> <div>a</div>
 *
 * <div><div>a</div><div>b</div></div> -> <div>a</div><div>b</div>
 * <div><div>a</div>4444<div>b</div></div> -> <div>a</div>4444<div>b</div>
 */
