import imageData from './data';

import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'slate-react';
import { Range, Block, Value } from 'slate';
import EditableEditor from '../../src/backup-editor';
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

class ImageDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(imageData)
    };

    this.plugins = [ImgPlugin()];
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        ImageDemo
        <hr />
        This demo tests adding text between images. click on the image and type
        some text...
        <hr />
        <Editor
          value={value}
          onChange={change => this.setState({ value: change.value })}
          plugins={this.plugins}
        />
        <EditableEditor
          value={value}
          onChange={change => this.setState({ value: change.value })}
          plugins={this.plugins}
        />
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(ImageDemo, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
