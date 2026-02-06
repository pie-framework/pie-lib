import React from 'react';
import { render, screen } from '@testing-library/react';
import { Panel } from '../settings/panel';
import { dropdown, numberField, numberFields, radio, toggle } from '../settings';

describe('Settings Panel', () => {
  let onChange;
  let configure;
  let model;
  let groups;

  beforeEach(() => {
    onChange = jest.fn();
    configure = {
      orientationLabel: 'Orientation',
      settingsOrientation: true,
      editChoiceLabel: false,
    };
    model = {
      choiceAreaLayout: 'vertical',
    };

    groups = ({ configure }) => ({
      'Group 1': {
        choiceAreaLayout: configure.settingsOrientation && {
          type: 'radio',
          label: configure.orientationLabel,
          choices: [
            { label: 'opt1', value: 'opt1' },
            { label: 'opt2', value: 'opt2' },
          ],
        },
        editChoiceLabel: { type: 'toggle', label: 'Edit choice label', isConfigProperty: true },
      },
    });
  });

  const renderComponent = (extras = {}) => {
    return render(
      <Panel
        model={model}
        configuration={configure}
        onChangeModel={onChange}
        onChangeConfiguration={onChange}
        groups={groups({ configure })}
        {...extras}
      />,
    );
  };

  describe('rendering', () => {
    it('renders settings panel', () => {
      renderComponent();

      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    it('renders toggle settings', () => {
      renderComponent();

      // Toggle components render with Switch role in MUI v5
      const toggles = screen.getAllByRole('switch');
      expect(toggles.length).toBeGreaterThan(0);
    });

    it('conditionally renders radio buttons based on configuration', () => {
      renderComponent();

      // Should render radio when settingsOrientation is true
      expect(screen.getByText('Orientation')).toBeInTheDocument();
    });

    it('does not render radio buttons when disabled in configuration', () => {
      const disabledGroups = groups({
        configure: {
          ...configure,
          settingsOrientation: false,
        },
      });

      render(
        <Panel
          model={model}
          configuration={{ ...configure, settingsOrientation: false }}
          onChangeModel={onChange}
          onChangeConfiguration={onChange}
          groups={disabledGroups}
        />,
      );

      // Should not render radio when settingsOrientation is false
      expect(screen.queryByText('Orientation')).not.toBeInTheDocument();
    });
  });
});

// Utility function tests - these are simple unit tests that don't need RTL
describe('toggle', () => {
  it('returns a toggle type object', () => {
    const setting = toggle('Label');

    expect(setting).toEqual({
      label: 'Label',
      type: 'toggle',
      isConfigProperty: false,
      disabled: false,
    });
  });
});

describe('radio', () => {
  it('returns a radio type object', () => {
    const setting = radio('Radio', ['one', 'two']);

    expect(setting).toEqual({
      label: 'Radio',
      type: 'radio',
      isConfigProperty: false,
      choices: [
        {
          label: 'one',
          value: 'one',
        },
        {
          label: 'two',
          value: 'two',
        },
      ],
    });
  });
});

describe('dropdown', () => {
  it('returns a dropdown type object', () => {
    const setting = dropdown('Dropdown', ['one', 'two']);

    expect(setting).toEqual({
      label: 'Dropdown',
      type: 'dropdown',
      isConfigProperty: false,
      choices: ['one', 'two'],
    });
  });
});

describe('numberField', () => {
  it('returns a numberField type object', () => {
    const setting = numberField('Number Field', { max: 12 }, true);

    expect(setting).toEqual({
      label: 'Number Field',
      type: 'numberField',
      isConfigProperty: true,
      max: 12,
    });
  });
});

describe('numberFields', () => {
  it('returns a numberFields type object', () => {
    const setting = numberFields('Number Fields', {
      one: {
        label: 'One',
      },
      two: {
        label: 'Two',
      },
    });

    expect(setting).toEqual({
      label: 'Number Fields',
      type: 'numberFields',
      fields: {
        one: {
          type: 'numberField',
          label: 'One',
          isConfigProperty: false,
        },
        two: {
          type: 'numberField',
          label: 'Two',
          isConfigProperty: false,
        },
      },
    });
  });
});
