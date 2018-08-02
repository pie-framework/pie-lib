import React from 'react';
import ReactDOM from 'react-dom';
import { Value } from 'slate';
import data from './data';
import { Editor } from 'slate-react';
import ImgPlugin from './image-plugin';

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
