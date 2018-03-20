import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './rte-demo';


document.addEventListener('DOMContentLoaded', () => {

  const el = React.createElement(Demo, {
    markup: '<div>hi</div>'
  });
  ReactDOM.render(el, document.querySelector('#app'));
});