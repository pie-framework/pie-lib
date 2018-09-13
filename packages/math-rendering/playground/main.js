import { renderMath } from '../src/render-math';

const init = () => {
  const node = document.querySelector('#mathml-node');
  renderMath(node);
};

if (document.readyState === 'ready') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
}
