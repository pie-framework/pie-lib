import { Editor, Raw } from 'slate';

import React from 'react';
import ReactDOM from 'react-dom';

const initialState = require('./state.json');

const Split = (props) => <span style={{ backgroundColor: 'lightgreen', border: 'solid 1px green' }}>SPLIT</span>;

const schema = {
  nodes: {
    split: Split
  }
}
/**
 * An illustration of: https://github.com/ianstormtaylor/slate/issues/941
 */
class SplitIssue extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: Raw.deserialize(initialState, { terse: true })
    }
  }

  render() {
    return <Editor
      schema={schema}
      state={this.state.editorState}
      onChange={(editorState) => this.setState({ editorState })} />;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(SplitIssue, {});
  ReactDOM.render(el, document.querySelector('#app'));
});