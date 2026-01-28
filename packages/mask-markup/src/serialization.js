import { object as toStyleObject } from 'to-style';
import debug from 'debug';

const log = debug('@pie-lib:mask-markup:serialization');

const INLINE = ['span'];
const MARK = ['em', 'strong', 'u'];
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const ELEMENT_NODE = 1;

const attr = (el) => {
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

const getObject = (type) => {
  if (INLINE.includes(type)) {
    return 'inline';
  } else if (MARK.includes(type)) {
    return 'mark';
  }
  return 'block';
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

export const reactAttributes = (o) => toStyleObject(o, { camelize: true, addUnits: false });

const handleStyles = (el, attribute) => {
  const styleString = el.getAttribute(attribute);

  return reactAttributes(parseStyleString(styleString));
};

const handleClass = (el, acc, attribute) => {
  const classNames = el.getAttribute(attribute);

  delete acc.class;

  return classNames;
};

const attributesToMap = (el) => (acc, attribute) => {
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
  strong: 'strong',
};

/**
 * Recursively process DOM nodes and convert them to Slate JSON format
 */
const processNode = (node, marks = []) => {
  // Skip comment nodes
  if (node.nodeType === COMMENT_NODE) {
    return null;
  }

  // Handle text nodes
  if (node.nodeType === TEXT_NODE) {
    const text = node.textContent;
    const leaf = { text };

    if (marks.length > 0) {
      leaf.marks = marks.map((m) => ({ type: m, data: undefined }));
    }

    return {
      object: 'text',
      leaves: [leaf],
    };
  }

  // Handle element nodes
  if (node.nodeType === ELEMENT_NODE) {
    const type = node.tagName.toLowerCase();

    // Check if this is a mark tag
    const markType = MARK_TAGS[type];
    if (markType) {
      log('[deserialize] mark: ', markType);
      // Process children with this mark added and return them flattened
      const childNodes = processNodes(node.childNodes, [...marks, markType]);
      // Return an array indicator with the nodes (will be flattened by parent)
      return { _flatten: true, nodes: childNodes };
    }

    // Handle math elements specially
    if (type === 'math') {
      return {
        isMath: true,
        nodes: [node],
      };
    }

    // Process regular elements
    const normalAttrs = attr(node) || {};

    if (type === 'audio' && normalAttrs.controls === '') {
      normalAttrs.controls = true;
    }

    const allAttrs = attributes.reduce(attributesToMap(node), { ...normalAttrs });
    const object = getObject(type);

    const childNodes = processNodes(node.childNodes, marks);

    return {
      object,
      type,
      data: { dataset: { ...node.dataset }, attributes: { ...allAttrs } },
      nodes: childNodes,
    };
  }

  return null;
};

/**
 * Process a NodeList and convert to array of Slate nodes
 */
const processNodes = (nodeList, marks = []) => {
  const nodes = [];
  for (let i = 0; i < nodeList.length; i++) {
    const result = processNode(nodeList[i], marks);
    if (result !== null) {
      // Handle flattening for mark nodes
      if (result._flatten && result.nodes) {
        nodes.push(...result.nodes);
      } else {
        nodes.push(result);
      }
    }
  }
  return nodes;
};

/**
 * Deserialize HTML string to Slate JSON format
 */
export const deserialize = (htmlString) => {
  // Handle empty or whitespace-only strings
  if (!htmlString || !htmlString.trim()) {
    return {
      object: 'value',
      document: {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: 'span',
            data: {},
            isVoid: false,
            nodes: [],
          },
        ],
      },
    };
  }

  // Use DOMParser to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Process all nodes in the body
  let nodes = processNodes(doc.body.childNodes);

  // If we only have text nodes (no block elements), wrap in default span block
  const hasBlockElements = nodes.some((node) => node.object === 'block' || node.object === 'inline');

  if (!hasBlockElements && nodes.length > 0) {
    nodes = [
      {
        object: 'block',
        type: 'span',
        data: {},
        isVoid: false,
        nodes: nodes,
      },
    ];
  }

  // If no nodes were produced, add a default span block
  if (nodes.length === 0) {
    nodes = [
      {
        object: 'block',
        type: 'span',
        data: {},
        isVoid: false,
        nodes: [],
      },
    ];
  }

  return {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes,
    },
  };
};
