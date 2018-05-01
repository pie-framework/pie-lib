import React from 'react';
import { shallow } from 'enzyme';
import { NumberTextField } from '../number-text-field';
import TextField from 'material-ui/TextField';

describe('NumberTextField', () => {
  describe('render', () => {
    let value = 1;
    let onChange, component, textField;
    let min = 1;
    let max = 10;
    let style = {
      border: '1px solid red'
    };

    describe('TextField', () => {
      beforeEach(() => {
        onChange = jest.fn();
        component = shallow(
          <NumberTextField
            value={value}
            min={min}
            max={max}
            classes={{}}
            onChange={onChange}
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

        describe('onChange', () => {
          const event = value => ({
            target: { value }
          });

          describe('called with valid string representation of int', () => {
            it('should be called with parsed int', () => {
              const e = event('3');
              props.onChange(e);
              expect(onChange).toBeCalledWith(e, 3);
            });
          });

          describe('called with empty string', () => {
            it('should not be called with an empty string', () => {
              const e = event('');
              props.onChange(e);
              expect(onChange).not.toBeCalled();
            });
          });

          describe('called with invalid int', () => {
            it('should not be called with undefined it not a valid number', () => {
              const e = event('nope');
              props.onChange(e);
              expect(onChange).not.toBeCalled();
            });
          });

          describe('string int exceeds max', () => {
            const value = (max + 1).toString();

            it('should be called with value of max', () => {
              const e = event(value);
              props.onChange(e);
              expect(onChange).toBeCalledWith(e, max);
            });
          });

          describe('string int less than min', () => {
            const value = (min - 1).toString();
            it('should not be called with with min if it has initialized to min', () => {
              const e = event(value);
              props.onChange(e, value);
              expect(onChange).not.toBeCalledWith(e, min);
            });

            it('should be called with min for raw value less than min', () => {
              const e = event(value);

              //need to bump it up first
              props.onChange(event('4'));
              props.onChange(e, value);
              expect(onChange).toBeCalledWith(e, min);
            });
          });
        });
      });
    });
  });
});
