import React from 'react';
import { shallow } from 'enzyme';
import { NumberTextField } from '../number-text-field';
import TextField from '@material-ui/core/TextField';

describe('NumberTextField', () => {
  describe('render', () => {
    let value = 1;
    let onChange, component, textField, onBlur;
    let min = 1;
    let max = 10;

    describe('TextField', () => {
      beforeEach(() => {
        onChange = jest.fn();
        onBlur = jest.fn();
        component = shallow(
          <NumberTextField
            value={value}
            min={min}
            max={max}
            classes={{}}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
        textField = component.find(TextField);
      });

      it('should render mui TextField', () => {
        expect(textField.length).toEqual(1);
      });

      describe('props', () => {
        let props;

        beforeEach(() => {
          props = textField.props();
        });

        it('should contain value', () => {
          expect(props.value).toEqual(value);
        });
      });

      describe('logic', () => {
        describe('clamp', () => {
          const assertClamp = (input, expected) => {
            it(`${input} => ${expected}`, () => {
              const result = component.instance().clamp(input);
              expect(result).toEqual(expected);
            });
          };

          assertClamp('foo', 1);
          assertClamp(1, 1);
          assertClamp(2, 2);
          assertClamp(0, 1);
          assertClamp(-1, 1);
          assertClamp(10, 10);
          assertClamp(11, 10);
        });

        describe('onBlur', () => {
          const event = value => ({
            target: { value }
          });

          describe('called with valid string representation of int', () => {
            it('should be called with parsed int', () => {
              const e = event('1');

              textField.simulate('change', e);

              expect(component.state('value')).toEqual('1');

              e.target.value = '100';

              textField.simulate('change', e);

              expect(component.state('value')).toEqual('100');

              const beforeMax = (max - 1).toString();
              e.target.value = beforeMax;

              textField.simulate('blur', e);

              expect(component.state('value')).toEqual(beforeMax);
            });
          });

          describe('called with invalid string representation of int', () => {
            it('should be called with min value', () => {
              const e = event('aa');

              textField.simulate('change', e);

              expect(component.state('value')).toEqual('aa');

              textField.simulate('blur', e);

              expect(component.state('value')).toEqual(min.toString());
            });
          });

          describe('called with empty string', () => {
            it('should be called with min value', () => {
              const e = event('');

              textField.simulate('change', e);

              expect(component.state('value')).toEqual('');

              textField.simulate('blur', e);

              expect(component.state('value')).toEqual(min.toString());
            });
          });

          describe('string int less than min', () => {
            const value = (min - 1).toString();

            it('should be called with value of min', () => {
              const e = event(value);

              textField.simulate('change', e);

              expect(component.state('value')).toEqual(value);

              textField.simulate('blur', e);

              expect(component.state('value')).toEqual(min.toString());
            });
          });

          describe('string int exceeds max', () => {
            const value = (max + 1).toString();

            it('should be called with value of max', () => {
              const e = event(value);

              textField.simulate('change', e);

              expect(component.state('value')).toEqual(value);

              textField.simulate('blur', e);

              expect(component.state('value')).toEqual(max.toString());
            });
          });
        });
      });
    });
  });
});
