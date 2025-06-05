import Html from 'slate-html-serializer';
import React from 'react';
import debug from 'debug';
import { object as toStyleObject } from 'to-style';
import isEmpty from 'lodash/isEmpty';

import { serialization as imgSerialization } from './plugins/image';
import { serialization as mathSerialization } from './plugins/math';
import { serialization as mediaSerialization } from './plugins/media';
import { serialization as listSerialization } from './plugins/list';
import { serialization as tableSerialization } from './plugins/table';
import { serialization as responseAreaSerialization } from './plugins/respArea';
import { Mark, Value } from 'slate';
import { BLOCK_TAGS } from './block-tags';

const log = debug('@pie-lib:editable-html:serialization');

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
  strong: 'bold',
  blockquote: 'blockquote',
  h3: 'h3',
  sup: 'sup',
  sub: 'sub',
};

export const parseStyleString = (s) => {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match;
  const result = {};
  while ((match = regex.exec(s))) {
    result[match[1]] = match[2].trim();
  }
  return result;
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const reactAttributes = (o) => toStyleObject(o, { camelize: true, addUnits: false });

const attributesToMap = (el) => (acc, attribute) => {
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

const attributes = ['border', 'cellpadding', 'cellspacing', 'class', 'style', 'align'];

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
      nodes: next(el.childNodes),
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
  },
};

export const INLINE_TAGS = {
  span: 'span',
};

const inlines = {
  deserialize(el, next) {
    log('[inlines:deserialize] inline: ', el);
    const inlineTag = INLINE_TAGS[el.tagName.toLowerCase()];
    if (!inlineTag) return;
    log('[inlines:deserialize] inline: ', inlineTag);

    if (el.childNodes.length === 1) {
      const cn = el.childNodes[0];
      if (cn && cn.tagName && cn.tagName.toLowerCase() === inlineTag) {
        log('[we have a child node of the same]...');
        return;
      }
    }

    return {
      object: 'inline',
      type: inlineTag,
      /**
       * Here for rendering styles for all inline elements
       */
      data: { attributes: attributes.reduce(attributesToMap(el), {}) },
      nodes: next(el.childNodes),
    };
  },
  serialize: (object, children) => {
    if (object.object !== 'inline') return;

    const jsonData = object.data.toJSON();

    log('[inlines:serialize] object: ', object, children);
    let key;

    for (key in INLINE_TAGS) {
      if (INLINE_TAGS[key] === object.type) {
        const Tag = key;

        return <Tag {...jsonData.attributes}>{children}</Tag>;
      }
    }
  },
};

export const extraCSSRulesOpts = {};

const STYLES_MAP = {
  h3: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },
  blockquote: {
    background: '#f9f9f9',
    borderLeft: '5px solid #ccc',
    margin: '1.5em 10px',
    padding: '.5em 10px',
  },
};

const reactToHTMLAttributesMap = {
  class: 'className',
};

const marks = {
  deserialize(el, next) {
    const mark = MARK_TAGS[el.tagName.toLowerCase()];
    const elClasses = el.getAttribute('class') || '';
    const hasCSSRule = (extraCSSRulesOpts?.names || []).find((name) => elClasses?.includes(name));

    if (!mark && !hasCSSRule) {
      return;
    }

    log('[deserialize] mark: ', mark);
    const attrs = attributes.reduce(attributesToMap(el), {});
    const data = isEmpty(attrs) ? undefined : { attributes: attrs };

    return {
      object: 'mark',
      type: hasCSSRule ? 'css' : mark,
      /**
       * Here for rendering styles for all elements
       */
      data,
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    const jsonData = object.data?.toJSON() || {};
    const elClasses = jsonData.attributes?.class || '';
    const hasCSSRule = (extraCSSRulesOpts?.names || []).find((name) => elClasses?.includes(name));

    if (hasCSSRule) {
      const htmlAttrs = Object.keys(jsonData.attributes).reduce((obj, key) => {
        obj[reactToHTMLAttributesMap[key] || key] = jsonData.attributes[key];
        return obj;
      }, {});

      return <span {...htmlAttrs}>{children}</span>;
    }

    if (Mark.isMark(object)) {
      for (var key in MARK_TAGS) {
        if (MARK_TAGS[key] === object.type) {
          const Tag = key;
          const additionalStyles = STYLES_MAP[Tag];

          if (additionalStyles) {
            if (!jsonData.attributes) {
              jsonData.attributes = {};
            }

            jsonData.attributes.style = {
              ...jsonData.attributes.style,
              ...additionalStyles,
            };
          }

          return <Tag {...jsonData.attributes}>{children}</Tag>;
        }
      }
    }
  },
};

// eslint-disable-next-line no-unused-vars
const findPreviousText = (el) => {
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
            text: '\n',
          },
        ],
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
            text: el.nodeValue,
          },
        ],
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
  },
};

const RULES = [
  listSerialization,
  mathSerialization,
  mediaSerialization,
  imgSerialization,
  tableSerialization,
  responseAreaSerialization,
  TEXT_RULE,
  inlines,
  blocks,
  marks,
];

function allWhitespace(node) {
  // Use ECMA-262 Edition 3 String and RegExp features
  return !/[^\t\n\r ]/.test(node.textContent);
}

function defaultParseHtml(html) {
  if (typeof DOMParser === 'undefined') {
    throw new Error(
      'The native `DOMParser` global which the `Html` serializer uses by default is not present in this environment. You must supply the `options.parseHtml` function instead.',
    );
  }

  const parsed = new DOMParser().parseFromString(html, 'text/html');

  const { body } = parsed;
  var textNodes = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, null);
  var n = textNodes.nextNode();

  while (n) {
    const isWhiteSpace = allWhitespace(n);
    const isNotNearMarkup =
      !MARK_TAGS[n.nextSibling?.tagName?.toLowerCase()] && !MARK_TAGS[n.previousSibling?.tagName?.toLowerCase()];

    if ((isWhiteSpace && isNotNearMarkup) || n.nodeValue === '\u200B') {
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
        childNodes: [],
      })
    : defaultParseHtml;

const serializer = new Html({
  defaultBlock: 'div',
  rules: RULES,
  parseHtml,
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
      nodes: [node],
    });

    memo.push(block);
    return memo;
  }, []);

  if (nodes.length === 0) {
    nodes = [
      _extends({ object: 'block', data: {}, isVoid: false }, defaultBlock, {
        nodes: [{ object: 'text', leaves: [{ object: 'leaf', text: '', marks: [] }] }],
      }),
    ];
  }

  const json = {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: nodes,
    },
    schema: {
      rules: [],
    },
  };

  let i;

  for (i = 0; i < 3000; i++) {
    json.schema.rules.push({
      match: { object: 'document' },
      nodes: [{ match: { object: 'block' } }],
    });
  }

  const ret = toJSON ? json : Value.fromJSON(json);

  if (ret) {
    return ret;
  }

  return null;
};

export const reduceMultipleBrs = (markup) => {
  try {
    return markup.replace(/(<br\s*\/?>){3,}/gi, '<br>');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Couldn't remove <br/> tags: ", e);
  }

  return markup;
};

const reduceRedundantNewLineCharacters = (markup) => {
  try {
    return markup.replace(/\n/gi, '');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Couldn't remove <br/> tags: ", e);
  }

  return markup;
};

/**
 * Makes sure that the html provided respects the schema
 * rules for the slate editor.
 * @param markup
 * @returns {string}
 */
const fixHtmlCode = (markup) => {
  const wrapperEl = document.createElement('div');

  wrapperEl.innerHTML = markup;

  /**
   * DIV elements that are at the same level as paragraphs
   * are replaced with P elements for normalizing purposes
   * @param child
   */
  const fixParagraphs = (child) => {
    const p = document.createElement('p');

    p.innerHTML = child.innerHTML;

    Array.from(child.attributes).forEach((attr) => {
      p.setAttribute(attr.name, attr.value);
    });
    child.replaceWith(p);
  };

  /**
   * @summary Makes sure that tables are placed in the root document.
   * @description This function removes the tables from the nodes that are
   * placed inside the root element and places them exactly near
   * the parent element.
   * @param tableArray
   */
  const fixTables = (tableArray) => {
    tableArray.forEach((el) => {
      const { index, child, parent } = el;
      const nodesBefore = [];
      const nodesAfter = [];
      const allNodes = Array.from(parent.childNodes);
      let i;

      for (i = 0; i < allNodes.length; i++) {
        const node = allNodes[i];

        if (i < index) {
          nodesBefore.push(node);
        } else if (i > index) {
          nodesAfter.push(node);
        }
      }

      // creating the element that is going to be placed instead of the parent
      const beforeEl = document.createElement(parent.nodeName);

      beforeEl.append(...nodesBefore);

      // replacing parent with the beforeElement
      parent.replaceWith(beforeEl);

      // adding the table right after the before element
      beforeEl.after(child);

      // creating the element that is going to be placed after the table
      const afterEl = document.createElement(parent.nodeName);

      afterEl.append(...nodesAfter);

      // adding the after element near the table
      child.after(afterEl);
    });
  };

  const emptyBlockCheck = (node) =>
    (node.nodeName === 'DIV' || node.nodeName === 'P' || node.nodeName === 'LI') && node.childNodes.length === 0;

  const parseNode = (el) => {
    const childArray = Array.from(el.childNodes);
    const hasParagraphs = childArray.find((child) => child.nodeName === 'P');
    const tables = [];

    childArray.forEach((child, index) => {
      // removing empty blocks
      if (emptyBlockCheck(child)) {
        child.remove();
        return;
      }

      if (hasParagraphs && child.nodeName === 'DIV') {
        fixParagraphs(child);
      }

      if (wrapperEl !== el && child.nodeName === 'TABLE') {
        // we don't need to fix tables in the root element
        tables.push({
          index,
          child,
          parent: el,
        });
      }

      parseNode(child);
    });

    if (tables.length) {
      fixTables(tables);
    }
  };

  parseNode(wrapperEl);

  return wrapperEl.innerHTML;
};

export const handleHtml = (html) => fixHtmlCode(reduceRedundantNewLineCharacters(reduceMultipleBrs(html)));

export const htmlToValue = (html) => {
  try {
    return serializer.deserialize(handleHtml(html));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Couldn't parse html: ", e);
    return {};
  }
};

export const valueToHtml = (value) => serializer.serialize(value);

/**
 *
 * <div><div>a</div></div> -> <div>a</div>
 *
 * <div><div>a</div><div>b</div></div> -> <div>a</div><div>b</div>
 * <div><div>a</div>4444<div>b</div></div> -> <div>a</div>4444<div>b</div>
 */
