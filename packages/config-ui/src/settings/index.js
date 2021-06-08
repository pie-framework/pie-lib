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
    choices: choices && choices.map(o => toChoice(o)),
    isConfigProperty
  };
};

export const dropdown = (label, choices, isConfigProperty = false) => {
  return {
    type: 'dropdown',
    label,
    choices,
    isConfigProperty
  };
};

export const numberField = (label, options, isConfigProperty = false) => ({
  ...options,
  label,
  type: 'numberField',
  isConfigProperty
});

export const numberFields = (label, fields, isConfigProperty = false) => {
  Object.keys(fields).map(key => {
    fields[key] = numberField(fields[key].label, fields[key], isConfigProperty);
  });

  return {
    type: 'numberFields',
    label,
    fields
  };
};

export const checkbox = (label, settings, isConfigProperty = false) => ({
  ...settings,
  label,
  type: 'checkbox',
  isConfigProperty
});

export const checkboxes = (label, choices, isConfigProperty = false) => {
  Object.keys(choices).map(key => {
    choices[key] = checkbox(choices[key].label, choices[key], isConfigProperty);
  });

  return {
    type: 'checkboxes',
    label,
    choices
  };
};
