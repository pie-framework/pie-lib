import Html from 'slate-html-serializer';
import React from 'react';
import debug from 'debug';
import { object as toStyleObject } from 'to-style';

import { serialization as imgSerialization } from './plugins/image';
import { serialization as mathSerialization } from './plugins/math';
import { serialization as mediaSerialization } from './plugins/media';
import { serialization as listSerialization } from './plugins/list';
import { serialization as tableSerialization } from './plugins/table';
import { serialization as responseAreaSerialization } from './plugins/respArea';
import { Mark, Value } from 'slate';

const log = debug('@pie-lib:editable-html:serialization');

/**
 * Tags to blocks.
 *
 * @type {Object}
 */

export const BLOCK_TAGS = {
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
  code: 'code',
  strong: 'bold'
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
      /**
       * Here for rendering styles for all block elements
       */
      data: { attributes: attributes.reduce(attributesToMap(el), {}) },
      nodes: next(el.childNodes)
    };
  },
  serialize: (object, children) => {
    if (object.object !== 'block') return;

    const jsonData = object.data.toJSON();

    log('[blocks:serialize] object: ', object, children);
    let key;

    for (key in BLOCK_TAGS) {
      if (BLOCK_TAGS[key] === object.type) {
        const Tag = key;

        return <Tag {...jsonData.attributes}>{children}</Tag>;
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

const findPreviousText = el => {
  if (el.nodeName === '#text') {
    return el;
  }

  if (el.previousSibling) {
    return findPreviousText(el.previousSibling);
  }

  return null;
};

export const TEXT_RULE = {
  deserialize(el) {
    /**
     * This needs to be called on the dom element in order to merge the adjacent text nodes together
     * */
    el.normalize();

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

    if (el.nodeName === '#text') {
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
        if (i !== 0) array.push(<br />);
        array.push(text);
        return array;
      }, []);
    }
  }
};

const RULES = [
  listSerialization,
  mathSerialization,
  mediaSerialization,
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

const _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

/**
 * This is needed in order to override the function that eventually leads
 * to the max iteration of 12, which in most cases it's not enough. The newer versions
 * have a different way to calculate this, but updating to a newer version of slate
 * requires a lot of work fixing other issues. So we just increase the rules by 1000,
 * which means a lot of iterations.
 * Below is the code that calculates the max iterations.
 * var max = schema.stack.plugins.length + schema.rules.length + 1;
 */
serializer.deserialize = function deserialize(html) {
  const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const _options$toJSON = options.toJSON;
  const toJSON = _options$toJSON === undefined ? false : _options$toJSON;
  const defaultBlock = this.defaultBlock;
  const parseHtml = this.parseHtml;

  const fragment = parseHtml(html);
  const children = Array.from(fragment.childNodes);
  let nodes = this.deserializeElements(children);

  // COMPAT: ensure that all top-level inline nodes are wrapped into a block.
  nodes = nodes.reduce(function(memo, node, i, original) {
    if (node.object === 'block') {
      memo.push(node);
      return memo;
    }

    if (i > 0 && original[i - 1].object !== 'block') {
      const _block = memo[memo.length - 1];

      _block.nodes.push(node);
      return memo;
    }

    const block = _extends({ object: 'block', data: {}, isVoid: false }, defaultBlock, {
      nodes: [node]
    });

    memo.push(block);
    return memo;
  }, []);

  if (nodes.length === 0) {
    nodes = [
      _extends({ object: 'block', data: {}, isVoid: false }, defaultBlock, {
        nodes: [{ object: 'text', leaves: [{ object: 'leaf', text: '', marks: [] }] }]
      })
    ];
  }

  const json = {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: nodes
    },
    schema: {
      rules: []
    }
  };

  let i;

  for (i = 0; i < 1000; i++) {
    json.schema.rules.push({
      match: { object: 'document' },
      nodes: [{ match: { object: 'block' } }]
    });
  }

  const ret = toJSON ? json : Value.fromJSON(json);

  if (ret) {
    return ret;
  }

  return null;
};

export const htmlToValue = html => serializer.deserialize(html);

export const valueToHtml = value => serializer.serialize(value);

/**
 *
 * <div><div>a</div></div> -> <div>a</div>
 *
 * <div><div>a</div><div>b</div></div> -> <div>a</div><div>b</div>
 * <div><div>a</div>4444<div>b</div></div> -> <div>a</div>4444<div>b</div>
 */
