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
    ],
    normalize: (change, error) => {
      console.log('normalize ... !!!', error.code);
      if (error.code == 'child_type_invalid') {
        change.setNodeByKey(error.child.key, { type: 'paragraph' });
      }
    }
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: [{ type: 'image' }, { object: 'text' }]
        }
      ],

      normalize: (change, error) => {
        console.log('paragraph normalize ... !!!', error.code);
        if (error.code == 'child_type_invalid') {
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
          change.setNodeByKey(error.child.key, { type: 'paragraph' });
        }
      }
    }
  }
};

const s = Schema.fromJSON(schema);
s.rules.splice(0, 12);
console.log('ss: ', s);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(data)
    };

    this.plugins = [ImgPlugin()];
  }

  renderNode = props => {
    console.log('renderNode', props.node.type);
    if (props.node.type === 'paragraph') {
      return <p {...props.attributes}>{props.children}</p>;
    }
  };
  render() {
    console.log('schema: ', schema);

    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        schema={s}
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
