import React, { PropTypes } from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { NumberTextField } from '../number-text-field';
import TextField from 'material-ui/TextField';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });

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
            onChange={onChange} />
        );
        textField = component.find(TextField);
      });


      it('should exist', () => {
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
              expect(onChange.mock.calls[0][0]).toEqual(e);
              expect(onChange.mock.calls[0][1]).toEqual(parseInt('3', 10));
            });

          });

          describe('called with empty string', () => {
            it('should be called empty string', () => {
              const e = event('');
              props.onChange(e);
              expect(onChange.mock.calls[0][0]).toEqual(e);
              expect(onChange.mock.calls[0][1]).toEqual(undefined);
            });

          });

          describe('called with invalid int', () => {

            it('should be called with undefined it not a valid number', () => {
              const e = event('nope');
              props.onChange(e);
              expect(onChange.mock.calls[0][0]).toEqual(e);
              expect(onChange.mock.calls[0][1]).toEqual(undefined);
            });

          });

          describe('string int exceeds max', () => {
            let value = (max + 1).toString();

            it('should be called with value of max', () => {
              let e = event(value);
              props.onChange(e);
              expect(onChange.mock.calls[0][0]).toEqual(e);
              expect(onChange.mock.calls[0][1]).toEqual(max);
            });

          });

          describe('string int less than min', () => {
            let value = (min - 1).toString();

            it('should be called with valie of min', () => {
              const e = event(value);
              props.onChange(e, value);
              expect(onChange.mock.calls[0][0]).toEqual(e);
              expect(onChange.mock.calls[0][1]).toEqual(min);
            });
          });
        });
      });
    });
  });
});