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

}