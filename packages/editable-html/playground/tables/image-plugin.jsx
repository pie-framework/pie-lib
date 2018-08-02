import React from 'react';
import { Block, Range } from 'slate';

class Img extends React.Component {
  render() {
    const { data } = this.props.node;
    const src = data.get('src');
    return <img src={src} width={100} />;
  }
}

const ImgPlugin = () => {
  return {
    renderNode: props => {
      if (props.node.type === 'image') {
        return <Img {...props} />;
      }
    },
    onKeyDown(event, change, editor) {
      const { startKey } = change.value.selection;
      const n = change.value.document.getDescendant(startKey);
      const p = change.value.document.getParent(n.key);

      if (p.type === 'image') {
        const block = Block.fromJSON({ type: 'div' });
        const range = Range.fromJSON({
          anchorKey: block.key,
          anchorOffset: 0,
          focusKey: block.key,
          focusOffset: 0,
          isFocused: true,
          isBackward: false
        });
        change.insertBlockAtRange(change.value.selection, block).select(range);
      }
    }
  };
};

export default ImgPlugin;
