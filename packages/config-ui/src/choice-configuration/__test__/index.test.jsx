import React from 'react';
import ChoiceConfiguration, { RawChoiceConfiguration } from '../index';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });

const defaultFeedback = {
  correct: 'Correct',
  incorrect: 'Incorrect'
}

const data = {
  checked: true,
  value: 'foo',
  label: 'Foo',
  feedback: {
    type: 'custom'
  }
}

const classes = {
  choiceConfiguration: 'choiceConfiguration'
}

describe('index - snapshot', () => {

  it('renders correctly', () => {

    const tree = renderer
      .create(<ChoiceConfiguration
        defaultFeedback={defaultFeedback}
        data={data}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});


describe('index - logic', () => {

  let wrapper, instance, onChange;

  beforeEach(() => {
    onChange = jest.fn();

    wrapper = shallow(<RawChoiceConfiguration
      classes={classes}
      defaultFeedback={defaultFeedback}
      data={data}
      onChange={onChange} />);
    instance = wrapper.instance();
  });

  describe('onValueChange', () => {

    it('calls onChange', () => {

      const event = {
        target: {
          value: 'foo'
        }
      }

      instance.onValueChange(event);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toMatchObject({ value: 'foo' });
    });
  });

  describe('onCheckedChange', () => {
    it('calls onChange', () => {
      instance.onLabelChange('new label');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toMatchObject({ label: 'new label' });
    });
  });


  describe('onFeedbackTypeChange', () => {

    it('calls onChange', () => {
      instance.onFeedbackTypeChange('default');
      expect(onChange.mock.calls[0][0]).toMatchObject({ feedback: { type: 'default' } });
    });
  });

  describe('onFeedbackValueChange', () => {

    it('calls onChange', () => {
      instance.onFeedbackValueChange('new feedback');
      expect(onChange.mock.calls[0][0]).toMatchObject({ feedback: { value: 'new feedback' } });
    });
  });

});
