import Html from 'slate-html-serializer';
import React from 'react';
import debug from 'debug';
import { serialization as imgSerialization } from './plugins/image';
import { serialization as mathSerialization } from './plugins/math';

const log = debug('editable-html:serialization');

/**
 * Tags to blocks.
 *
 * @type {Object}
 */

const BLOCK_TAGS = {
  div: 'div',
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
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

const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (!block) return
      log('[deserialize] block: ', block);
      return {
        kind: 'block',
        type: block,
        nodes: next(el.childNodes)
      }
    },
    serialize(object, children) {
      if (object.kind !== 'block') return;

      for (var key in BLOCK_TAGS) {
        if (BLOCK_TAGS[key] === object.type) {
          const Tag = key;
          return <Tag>{children}</Tag>;
        }
      }
    }
  },
  {
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
  },
  {
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
  },
  {
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
].concat([imgSerialization, mathSerialization]);

const serializer = new Html({
  defaultBlock: 'div',
  rules: RULES
});

export const htmlToValue = html => {
  return serializer.deserialize(html);
}

export const valueToHtml = value => serializer.serialize(value);