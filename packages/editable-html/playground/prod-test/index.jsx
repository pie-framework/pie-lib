import React from 'react';
import ReactDOM from 'react-dom';
import EditableHtml from '../../src/index';

class ImageDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markup: 'hi'
    };
  }

  render() {
    return (
      <div>
        EditableHtml - and react production issue
        <hr />
        <p>This should work in react.prod - but it doesnt</p>
        <EditableHtml
          markup={this.state.markup}
          onChange={markup => this.setState({ markup })}
        />
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(ImageDemo, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
