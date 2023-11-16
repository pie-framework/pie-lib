import TestSerializer from './test-serializer';
import React from 'react';
import debug from 'debug';
import {object as toStyleObject} from 'to-style';

import {serialization as imgSerialization} from './plugins/image';
import {serialization as mathSerialization} from './plugins/math';
import {serialization as mediaSerialization} from './plugins/media';
import {serialization as listSerialization} from './plugins/list';
import {serialization as tableSerialization} from './plugins/table';
import {serialization as responseAreaSerialization} from './plugins/respArea';
import {
// Causing issues when building with pslb
// because this is using  "slate": "^0.47.9 <0.50.0"
// while slate-react 0.99.0 is using "slate": "^0.94.0",
//   Mark,
//   Value,
    Text
} from 'slate';
import {jsx} from 'slate-hyperscript';
import escapeHtml from 'escape-html';

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
    h6: 'heading-six',
};

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
    del: 'strikethrough',
    code: 'code',
    strong: 'bold',
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

export const reactAttributes = (o) => toStyleObject(o, {camelize: true, addUnits: false});

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

        return jsx(
            'element',
            {
                type: block,
                /**
                 * Here for rendering styles for all block elements
                 */
                data: {attributes: attributes.reduce(attributesToMap(el), {})},
            },
            next(el.childNodes),
        );
    },
    serialize: (object, children) => {
        if (object.object !== 'block') return;

        const jsonData = object.data;

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

const marks = {
    deserialize(el, next) {
        const mark = MARK_TAGS[el.tagName.toLowerCase()];
        if (!mark) {
            return;
        }
        log('[deserialize] mark: ', mark);

        return jsx('text', {[mark]: true}, next(el.childNodes));
    },
    serialize(object) {
        if (Text.isText(object)) {
            let string = escapeHtml(object.text);

            if (object.bold) {
                string = <strong>{string}</strong>;
            }

            if (object.code) {
                string = <code>{string}</code>;
            }

            if (object.italic) {
                string = <em>{string}</em>;
            }

            if (object.underline) {
                string = <u>{string}</u>;
            }

            if (object.strikethrough) {
                string = <del>{string}</del>;
            }

            return string;
        }
    },
};

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
            return jsx('text', {});
        }

        if (el.nodeName === '#text') {
            if (el.nodeValue && el.nodeValue.match(/<!--.*?-->/)) return;

            log('[text:deserialize] return text object..');
            return jsx('text', {}, el.nodeValue);
        }
    },

    serialize(obj, children) {
        if (obj.object === 'string') {
            return children.split('\n').reduce((array, text, i) => {
                if (i !== 0) array.push(<br/>);
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

    const {body} = parsed;
    const textNodes = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, null);
    let n = textNodes.nextNode();

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
            childNodes: [],
        })
        : defaultParseHtml;

const serializer = new TestSerializer({
    defaultBlock: 'div',
    rules: RULES,
    parseHtml,
});

const _extends =
    Object.assign ||
    function (target) {
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

export const htmlToValue = (html) => {
    try {
        return serializer.deserialize(html);
    } catch (e) {
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
