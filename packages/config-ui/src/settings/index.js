import Panel from './panel';

export { Panel };

export const toggle = (label, isConfigProperty = false) => ({
  type: 'toggle',
  label,
  isConfigProperty
});

const toChoice = opt => {
  if (typeof opt === 'string') {
    return { label: opt, value: opt };
  } else {
    return opt;
  }
};

export const radio = function() {
  const args = Array.prototype.slice.call(arguments);
  const [label, choices, isConfigProperty = false] = args;
  return {
    type: 'radio',
    label,
    choices: choices.map(o => toChoice(o)),
    isConfigProperty
  };
};
