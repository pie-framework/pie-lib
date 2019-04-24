import Panel from './panel';

export { Panel };

export const toggle = (label, configuration) => ({ type: 'toggle', label, configuration });

const toChoice = opt => {
  if (typeof opt === 'string') {
    return { label: opt, value: opt };
  } else {
    return opt;
  }
};

export const radio = function() {
  const args = Array.prototype.slice.call(arguments);
  const [label, configuration, ...opts] = args;
  return {
    type: 'radio',
    label,
    configuration,
    choices: opts.map(o => toChoice(o))
  };
};
