import React from 'react';

export function classObject() {
  const out = {};
  for (var a in arguments) {
    const value = arguments[a];
    out[value] = value;
  }
  return out;
}

export function mockComponents() {
  const out = {};
  for (var a in arguments) {
    const value = arguments[a];
    out[value] = class extends React.Component {
      render() {
        return <div data-mock-component="true">{value}</div>;
      }
    };
  }
  return out;
}

export function mockIconButton() {
  jest.mock('@material-ui/core/IconButton', () => {
    return props => (
      <div
        className={props.className}
        style={props.style}
        ariaLabel={props['aria-label']}
      />
    );
  });
}

export function mockMathInput() {
  jest.mock('@pie-lib/math-input', () => ({
    addBrackets: jest.fn(s => s),
    removeBrackets: jest.fn(s => s),
    ...mockComponents(
      'Keypad',
      'MathQuillInput',
      'EditableMathInput',
      'HorizontalKeypad'
    )
  }));
}
