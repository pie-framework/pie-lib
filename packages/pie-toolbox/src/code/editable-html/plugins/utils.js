import { Editor, Element as SlateElement } from 'slate';

export const findSingleNode = (value) => {
  if (!value || !value.isCollapsed || !value.startKey) {
    return;
  }

  const inline = value.document.getClosestInline(value.startKey);

  if (inline) {
    return inline;
  }

  const block = value.document.getClosestBlock(value.startKey);

  if (block) {
    return block;
  }
};

export const findParentNode = (value, node) => {
  if (!value || !node) {
    return;
  }

  return value.document.getParent(node.key);
};

export const hasMark = (value, type) => value && value.marks.some((mark) => mark.type == type);

export const hasBlock = (value, type) => value && value.blocks.some((node) => node.type == type);

export const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    }),
  );

  return !!match;
};

export const hasNode = ({ document }, type) => document && document.nodes.some((node) => node.type == type);
