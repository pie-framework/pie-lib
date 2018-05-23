import React from 'react';
import ReactDOM from 'react-dom';
import EditableHtml from '../../src/index';

class ProdTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markup: 'hi'
    };
  }

  render() {
    return (
      <div>
        EditableHtml and react production
        <hr />
        <EditableHtml
          markup={this.state.markup}
          onChange={markup => this.setState({ markup })}
        />
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(ProdTest, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
