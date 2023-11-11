import React from 'react';
import ReactServer from 'react-dom/server';
import escapeHtml from 'escape-html';
import { Text } from 'slate';
import { jsx } from 'slate-hyperscript';
import { MARK_TAGS } from './new-serialization';

class Html {
  constructor(props) {
    this.defaultBlock = props.defaultBlock;
    this.parseHtml = props.parseHtml;
    this.rules = props.rules;
  }

  serializeEls = (node) => {
    let children = (node.children || []).map((n) => this.serializeEls(n));

    const correctRule = this.rules.reduce((res, rule) => {
      return res || rule.serialize(node, children);
    }, null);

    if (correctRule) {
      return correctRule;
    }

    switch (node.type) {
      case 'quote':
        return (
          <blockquote>
            <p>{children}</p>
          </blockquote>
        );
      case 'paragraph':
        return <p>{children}</p>;
      case 'link':
        return <a href={escapeHtml(node.url)}>{children}</a>;
      default:
        return children;
    }
  };

  serialize = (node) => {
    const deserialized = this.serializeEls(node);
    const html = ReactServer.renderToStaticMarkup(React.createElement('body', null, deserialized));
    const inner = html.slice(6, -7);
    return inner;
  };

  deserialize = (html) => {
    let body = this.parseHtml(html);

    if (
      !body.firstChild ||
      body.firstChild.nodeType === Node.TEXT_NODE ||
      Object.keys(MARK_TAGS).includes(body.firstChild.tagName.toLowerCase())
    ) {
      body = this.parseHtml(`<span>${html}</span>`);
    }

    return this.deserializeEls(body);
  };

  deserializeEls = (element, markAttributes = {}) => {
    if (element.nodeType === Node.TEXT_NODE) {
      return jsx('text', markAttributes, element.textContent);
    } else if (element.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const nodeAttributes = { ...markAttributes };

    // define attributes for text nodes
    if (element.nodeName === 'STRONG') {
      nodeAttributes.bold = true;
    }

    const nextFn = (nodes) => {
      const childNodes = Array.from(nodes);
      const children = Array.from(childNodes)
        .map((node) => this.deserializeEls(node, nodeAttributes))
        .flat();

      if (children.length === 0) {
        children.push(jsx('text', nodeAttributes, ''));
      }

      return children;
    };

    const correctRule = this.rules.reduce((res, rule) => {
      return res || rule.deserialize(element, nextFn);
    }, null);

    if (correctRule) {
      return correctRule;
    }

    const childNodes = Array.from(element.childNodes);
    const children = Array.from(childNodes)
      .map((node) => this.deserializeEls(node, nodeAttributes))
      .flat();

    if (children.length === 0) {
      children.push(jsx('text', nodeAttributes, ''));
    }

    switch (element.nodeName) {
      case 'TABLE':
        return jsx('element', { type: 'table' }, children);
      case 'TBODY':
        return jsx('element', { type: 'tbody' }, children);
      case 'TR':
        return jsx('element', { type: 'tr' }, children);
      case 'TD':
        return jsx('element', { type: 'td' }, children);
      case 'BODY':
        return jsx('fragment', {}, children);
      case 'BR':
        return '\n';
      case 'BLOCKQUOTE':
        return jsx('element', { type: 'quote' }, children);
      case 'P':
        return jsx('element', { type: 'paragraph' }, children);
      case 'A':
        return jsx('element', { type: 'link', url: element.getAttribute('href') }, children);
      default:
        return children;
    }
  };
}

export default Html;
