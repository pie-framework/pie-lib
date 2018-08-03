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
    }
  },
  inlines: {
    image: {
      isVoid: true
    }
  }
};

// const raw = new Schema();

// raw.rules.push({
//   match: {
//     object: 'block',
//     first: { object: 'block' }
//   },
//   nodes: [
//     {
//       match: { object: 'block' }
//     }
//   ],
//   normalize: error => {
//     console.log('override the defaults! where we force only blocks');
//   }
// });

// raw.rules.push({
//   match: {
//     object: 'block',
//     first: [{ object: 'inline' }, { object: 'text' }]
//   },
//   nodes: [
//     {
//       match: [{ object: 'inline' }, { object: 'text' }]
//     }
//   ],
//   normalize: error => {
//     console.log('override the defaults! where we force only inline/text');
//   }
// });

// const s = Schema.fromJSON(schema);
// const v = Value.fromJSON(data, { normalize: false });
// const error = s.validateNode(v.document.nodes.get(0));
// const rawError = raw.validateNode(v.document.nodes.get(0));
// console.log('error: ', error, 'rawError', rawError);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(data, { normalize: false })
    };
    console.log('this.state.value', this.state.value);
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
