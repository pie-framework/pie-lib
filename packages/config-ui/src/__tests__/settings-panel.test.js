import React from 'react';
import { shallow } from 'enzyme';
import { Panel } from '../settings/panel';
import { toggle, radio, dropdown, numberField, numberFields } from '../settings';

describe('Settings Panel', () => {
  let w;
  let onChange = jest.fn();
  let configure = {
    orientationLabel: 'Orientation',

    settingsOrientation: true,
    editChoiceLabel: false
  };
  let model = {
    choiceAreaLayout: 'vertical'
  };

  let groups = ({ configure }) => ({
    'Group 1': {
      choiceAreaLayout: configure.settingsOrientation && {
        type: 'radio',
        label: configure.orientationLabel,
        choices: [{ label: 'opt1', value: 'opt1' }, { label: 'opt2', value: 'opt2' }],
        equationEditor: dropdown('Dropdown', [
          'geometry',
          'advanced-algebra',
          'statistics',
          'miscellaneous'
        ]),
        graph: numberFields('Graph Display Size', {
          domain: {
            label: 'Domain',
            suffix: 'px'
          },
          range: {
            label: 'Range',
            suffix: 'px'
          },
          width: {
            label: 'Width',
            suffix: 'px',
            min: 50,
            max: 250
          }
        })
      },
      editChoiceLabel: { type: 'toggle', label: 'Edit choice label', isConfigProperty: true }
    }
  });

  const wrapper = extras => {
    return shallow(
      <Panel
        model={model}
        configuration={configure}
        onChangeModel={onChange}
        onChangeConfiguration={onChange}
        groups={groups({ configure })}
        {...extras}
      />
    );
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();

      expect(w).toMatchSnapshot();
    });

    it('does not render radio buttons', () => {
      w = wrapper({
        groups: groups({
          configure: {
            ...configure,
            settingsOrientation: false
          }
        })
      });

      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('onChange gets called', () => {
      it('updates model props', () => {
        w.instance().change('test', false);

        expect(onChange).toBeCalledWith(
          {
            ...model,
            test: false
          },
          'test'
        );
      });

      it('updates configuration props', () => {
        w.instance().change('test.test', true, true);

        expect(onChange).toBeCalledWith(
          {
            ...configure,
            test: {
              test: true
            }
          },
          'test.test'
        );
      });
    });
  });
});

describe('toggle', () => {
  it('returns a toggle type object', () => {
    const setting = toggle('Label');

    expect(setting).toEqual({
      label: 'Label',
      type: 'toggle',
      isConfigProperty: false
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
          value: 'one'
        },
        {
          label: 'two',
          value: 'two'
        }
      ]
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
      choices: ['one', 'two']
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
      max: 12
    });
  });
});

describe('numberFields', () => {
  it('returns a numberFields type object', () => {
    const setting = numberFields('Number Fields', {
      one: {
        label: 'One'
      },
      two: {
        label: 'Two'
      }
    });

    expect(setting).toEqual({
      label: 'Number Fields',
      type: 'numberFields',
      fields: {
        one: {
          type: 'numberField',
          label: 'One',
          isConfigProperty: false
        },
        two: {
          type: 'numberField',
          label: 'Two',
          isConfigProperty: false
        }
      }
    });
  });
});
