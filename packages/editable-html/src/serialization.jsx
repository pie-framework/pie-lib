import Html from 'slate-html-serializer';
import React from 'react';
import debug from 'debug';
import { serialization as imgSerialization } from './plugins/image';
import { serialization as mathSerialization } from './plugins/math';
import { serialization as listSerialization } from './plugins/list';

const log = debug('editable-html:serialization');

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
}

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
}

/**
 * Serializer rules.
 *
 * @type {Array}
 */


const blocks = {
  deserialize(el, next) {
    log('[blocks:deserialize] block: ', el);
    const block = BLOCK_TAGS[el.tagName.toLowerCase()];
    if (!block) return
    log('[blocks:deserialize] block: ', block);

    if (el.childNodes.length === 1) {
      const cn = el.childNodes[0];
      if (cn && cn.tagName && cn.tagName.toLowerCase() === block) {
        log('[we have a child node of the same]...');
        return;
      }
    }
    return {
      kind: 'block',
      type: block,
      nodes: next(el.childNodes)
    }
  },
  serialize: (object, children) => {

    if (object.kind !== 'block') return;

    log('[blocks:serialize] object: ', object, children);
    for (var key in BLOCK_TAGS) {
      if (BLOCK_TAGS[key] === object.type) {
        const Tag = key;
        return <Tag>{children}</Tag>;
      }
    }
  }
}

const marks = {

  deserialize(el, next) {
    const mark = MARK_TAGS[el.tagName.toLowerCase()]
    if (!mark) return
    log('[deserialize] mark: ', mark);
    return {
      kind: 'mark',
      type: mark,
      nodes: next(el.childNodes)
    }
  },
  serialize(object, children) {
    if (object.kind !== 'mark') return;

    for (var key in MARK_TAGS) {
      if (MARK_TAGS[key] === object.type) {
        const Tag = key;
        return <Tag>{children}</Tag>;
      }
    }
  }
}

const codeBlocks = {
  // Special case for code blocks, which need to grab the nested childNodes.
  deserialize(el, next) {
    if (el.tagName.toLowerCase() != 'pre') return
    const code = el.childNodes[0]
    const childNodes = code && code.tagName.toLowerCase() == 'code'
      ? code.childNodes
      : el.childNodes

    return {
      kind: 'block',
      type: 'code',
      nodes: next(childNodes)
    }
  }
}

const links = {
  // Special case for links, to grab their href.
  deserialize(el, next) {
    if (el.tagName.toLowerCase() != 'a') return
    return {
      kind: 'inline',
      type: 'link',
      nodes: next(el.childNodes),
      data: {
        href: el.getAttribute('href')
      }
    }
  }
}

const TEXT_RULE = {
  deserialize(el) {
    if (el.tagName && el.tagName.toLowerCase() === 'br') {
      return {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: '\n',
          },
        ],
      }
    }

    if (el.nodeName == '#text') {
      if (el.nodeValue && el.nodeValue.match(/<!--.*?-->/)) return

      log('[text:deserialize] return text object..')
      return {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: el.nodeValue,
          },
        ],
      }
    }
  },

  serialize(obj, children) {
    if (obj.object === 'string') {
      return children.split('\n').reduce((array, text, i) => {
        if (i != 0) array.push(<br />)
        array.push(text)
        return array
      }, [])
    }
  },
}

const findFirstNonNested = (c) => {

  if (c.children && c.children.size === 1) {
    const inner = c.children.get(0);
    if (inner && inner.type === 'div') {
      return findFirstNonNested(inner);
    } else {
      return inner;
    }
  }
  return c;
}

const RULES = [
  TEXT_RULE, blocks, marks, listSerialization, mathSerialization, imgSerialization];

const serializer = new Html({
  defaultBlock: 'div',
  rules: RULES
});

export const htmlToValue = html => serializer.deserialize(html);
export const valueToHtml = value => serializer.serialize(value);