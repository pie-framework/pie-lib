import React from 'react';
import ReactDOM from 'react-dom';
import { Value } from 'slate';
import data from './data';
import { Editor } from 'slate-react';
import ImgPlugin from './image-plugin';

const schema = {
  document: {
    nodes: [
      {
        match: [{ type: 'paragraph' }, { type: 'image' }]
      }
    ],
    normalize: (change, error) => {
      console.log('normalize ... !!!');
      if (error.code == 'child_type_invalid') {
        console.log('!!!');
        change.setNodeByKey(error.child.key, { type: 'paragraph' });
      }
    }
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: { object: 'text' }
        }
      ],

      normalize: (change, error) => {
        console.log('ppp normalize ... !!!');
        if (error.code == 'child_type_invalid') {
          console.log('pp!!!');
          change.setNodeByKey(error.child.key, { type: 'paragraph' });
        }
      }
    },
    image: {
      isVoid: true,
      data: {},

      normalize: (change, error) => {
        console.log('img normalize ... !!!');
        if (error.code == 'child_type_invalid') {
          console.log('img !!!');
          change.setNodeByKey(error.child.key, { type: 'paragraph' });
        }
      }
    }
  }
};

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
      <div>
        <Editor
          value={this.state.value}
          plugins={this.plugins}
          schema={schema}
          onChange={change => this.setState({ value: change.value })}
        />
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(App, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
