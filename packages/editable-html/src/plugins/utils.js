export const findSingleNode = value => {
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

export const hasMark = (value, type) => value && value.marks.some(mark => mark.type == type);

export const hasBlock = (value, type) => value && value.blocks.some(node => node.type == type);

export const hasNode = ({ document }, type) =>
  document && document.nodes.some(node => node.type == type);
