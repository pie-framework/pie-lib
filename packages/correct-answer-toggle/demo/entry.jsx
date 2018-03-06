import Checkbox from 'material-ui/Checkbox';
import Expander from '../src/expander.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import Toggle from '../src/index.jsx';

class Wrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
      show: true
    }
  }

  onToggle(toggled) {
    this.setState({ toggled: !this.state.toggled });
  }

  onShow() {
    this.setState({ show: !this.state.show });
  }

  render() {
    return <MuiThemeProvider>
      <div>
        <Checkbox
          label="Show"
          checked={this.state.show}
          onClick={this.onShow.bind(this)}
        />
        <Checkbox
          label="Toggle..."
          checked={this.state.toggled}
          onClick={this.onToggle.bind(this)}
        />
        toggled: {this.state.toggled}
        <Toggle
          show={this.state.show}
          toggled={this.state.toggled}
          onToggle={this.onToggle.bind(this)} />

        <div hidden={!this.state.show}>Note: You can set the color of the label by using <code>--correct-answer-toggle-label-color</code> css variable</div>
        <Toggle
          className="red-label"
          show={this.state.show}
          toggled={this.state.toggled}
          onToggle={this.onToggle.bind(this)} />
        <p>Here is some text below</p>
      </div>
    </MuiThemeProvider>;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const element = React.createElement(Wrapper, {});
  let container = document.querySelector('.toggle');
  console.log('container: ', container);
  ReactDOM.render(element, container);
});