import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './rte-demo';
import PropTypes from 'prop-types';


const D = ({ markup }) => {
  return <div>
    <Demo markup={markup} />
  </div>
}
D.propTypes = {
  markup: PropTypes.string
}
document.addEventListener('DOMContentLoaded', () => {

  const el = React.createElement(D, {
    markup: 'hi'
  });
  ReactDOM.render(el, document.querySelector('#app'));
});