import React from 'react';
import { shallow } from 'enzyme';
import { Panel } from '../settings/panel';
import { toggle, radio } from '../settings';

describe('Settings Panel', () => {
  let w;
  let onChange = jest.fn();
  let configure = {
    orientationLabel: 'Orientation',

    settingsOrientation: true,
    editChoiceLabel: false
  };
  let model = {
    choiceAreaLayout: 'vertical',
    configure
  };

  let groups = ({ configure }) => ({
    'Group 1': {
      choiceAreaLayout: configure.settingsOrientation && {
        type: 'radio',
        label: configure.orientationLabel,
        choices: [{ label: 'opt1', value: 'opt1' }, { label: 'opt2', value: 'opt2' }]
      },
      'configure.editChoiceLabel': { type: 'toggle', label: 'Edit choice label' }
    }
  });

  const wrapper = extras => {
    return shallow(<Panel model={model} onChange={onChange} groups={groups(model)} {...extras} />);
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
      it('updates root props', () => {
        w.instance().changeModel('test', false);

        expect(onChange).toBeCalledWith(
          {
            ...model,
            test: false
          },
          'test'
        );
      });

      it('updates nested props', () => {
        w.instance().changeModel('configure.test.test', true);

        expect(onChange).toBeCalledWith(
          {
            ...model,
            configure: {
              ...configure,
              test: {
                test: true
              }
            }
          },
          'configure.test.test'
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
      type: 'toggle'
    });
  });
});

describe('radio', () => {
  it('returns a radio type object', () => {
    const setting = radio('Radio', 'one', 'two');

    expect(setting).toEqual({
      label: 'Radio',
      type: 'radio',
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
