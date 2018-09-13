import renderMath from '../src/render-math';

const init = () => {
  const mathNodes = document.querySelectorAll('div');

  // const node = document.querySelector('#mathml-node');
  renderMath(mathNodes);
};

if (document.readyState === 'ready') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
}
