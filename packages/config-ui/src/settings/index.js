import Panel from './panel';

export { Panel };

export const toggle = (label, isConfigProperty) => ({ type: 'toggle', label, isConfigProperty });

const toChoice = opt => {
  if (typeof opt === 'string') {
    return { label: opt, value: opt };
  } else {
    return opt;
  }
};

export const radio = function() {
  const args = Array.prototype.slice.call(arguments);
  const [label, isConfigProperty, ...opts] = args;
  return {
    type: 'radio',
    label,
    isConfigProperty,
    choices: opts.map(o => toChoice(o))
  };
};
