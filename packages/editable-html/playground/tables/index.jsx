import React from 'react';
import ReactDOM from 'react-dom';
import { Value, Schema } from 'slate';
import data from './data';
import { Editor } from 'slate-react';
import ImgPlugin from './image-plugin';

const schema = {
  document: {
    nodes: [
      {
        match: [{ type: 'paragraph' }, { type: 'image' }]
      }
    ]
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: [{ type: 'image' }, { object: 'text' }]
        }
      ]
    },
    image: {
      isVoid: true
    }
  }
};
const s = Schema.fromJSON(schema);
const v = Value.fromJSON(data, { normalize: false });
console.log(s);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(data)
    };

    this.plugins = [ImgPlugin()];
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        schema={schema}
        renderNode={this.renderNode}
        onChange={change => this.setState({ value: change.value })}
      />
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(App, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
