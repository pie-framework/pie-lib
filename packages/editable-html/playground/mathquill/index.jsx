import React from 'react';
import ReactDOM from 'react-dom';
import Static from '../../src/plugins/math/mathquill/static';
import { MathToolbar } from '../../src/plugins/math/math-toolbar';
const Button = props => (
  <div
    style={{ border: 'solid red 1px', padding: '20px' }}
    onClick={() => props.onClick(props.uid, props.latex)}
  >
    <Static latex={props.latex} />
  </div>
);

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      math: [{ id: 1, latex: '\\frac{1}{2}' }, { id: 2, latex: '\\frac{2}{1}' }]
    };
  }

  onDone = (id, latex) => {
    const update = this.state.math.map(m => {
      if (m.id === id) {
        m.latex = latex;
      }
      return m;
    });

    this.setState({ math: update });
  };

  loadLatex = index => {
    this.setState({ currentIndex: index });
  };

  render() {
    const data = this.state.math[this.state.currentIndex];
    console.log('RENDER, data:', data);
    return (
      <div>
        mathquill demo
        {this.state.math.map((m, index) => (
          <Button
            key={index}
            uid={m.id}
            latex={m.latex}
            onClick={() => this.loadLatex(index)}
          />
        ))}
        <MathToolbar
          latex={data.latex}
          onDone={this.onDone.bind(this, data.id)}
        />
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(Demo, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
