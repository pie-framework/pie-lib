const { pathExistsSync, readJsonSync } = require('fs-extra');
const { resolve } = require('path');

const rawLinks = [
  { label: 'config-ui', path: '/config-ui' },
  { label: 'config-ui - config-layout', path: '/config-ui/config-layout' },
  { label: 'config-ui - numbers', path: '/config-ui/numbers' },
  { label: 'config-ui - settings-panel', path: '/config-ui/settings-panel' },
  { label: 'config-ui - tabs', path: '/config-ui/tabs' },
  { label: 'correct-answer-toggle', path: '/correct-answer-toggle' },
  { label: 'editable-html', path: '/editable-html' },
  { label: 'graphing', path: '/graphing' },
  { label: 'charting', path: '/charting' },
  { label: 'icons', path: '/icons' },
  { label: 'mask-markup', path: '/mask-markup' },
  { label: 'math-evaluator', path: '/math-evaluator' },
  { label: 'math-input', path: '/math-input' },
  { label: 'math-rendering', path: '/math-rendering' },
  { label: 'math-toolbar', path: '/math-toolbar' },
  { label: 'render-ui', path: '/render-ui' },
  { label: 'rubric', path: '/rubric' },
  { label: 'scoring-config', path: '/scoring-config' },
  { label: 'text-select', path: '/text-select' },
  { label: 'text-select math', path: '/text-select-math' },
  { label: 'ruler', path: '/tools/ruler' },
  { label: 'protractor', path: '/tools/protractor' },
  { label: 'rotatable', path: '/tools/rotatable' },
  { label: 'drag', path: '/drag' }
];

module.exports.loadLinks = () => {
  return rawLinks.map(l => {
    const pkgPath = resolve(__dirname, '../../', l.label, 'package.json');
    if (pathExistsSync(pkgPath)) {
      const pkg = readJsonSync(pkgPath);
      l.version = pkg.version;
    }
    return l;
  });
}; // = links;
