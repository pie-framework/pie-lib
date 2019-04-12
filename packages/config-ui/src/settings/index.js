import Panel from './panel';
import NewPanel from './new-panel';

export { Panel, NewPanel };
export const toggle = label => ({ type: 'toggle', label });

const toChoice = opt => {
  if (typeof opt === 'string') {
    return { label: opt, value: opt };
  } else {
    return opt;
  }
};

export const radio = function() {
  const args = Array.prototype.slice.call(arguments);
  const [label, ...opts] = args;
  return {
    type: 'radio',
    label,
    choices: opts.map(o => toChoice(o))
  };
};
