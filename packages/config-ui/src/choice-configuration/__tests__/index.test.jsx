import React from 'react';
import { ChoiceConfiguration } from '../index';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const defaultFeedback = {
  correct: 'Correct',
  incorrect: 'Incorrect'
};

const data = {
  checked: true,
  value: 'foo',
  label: 'Foo',
  feedback: {
    type: 'custom'
  }
};

const classes = {
  choiceConfiguration: 'choiceConfiguration'
};

describe('index - snapshot', () => {
  it('renders correctly with default props', () => {
    const tree = renderer
      .create(
        <ChoiceConfiguration
          classes={classes}
          defaultFeedback={defaultFeedback}
          data={data}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly when feedback is not allowed', () => {
    const tree = renderer
      .create(
        <ChoiceConfiguration
          allowFeedBack={false}
          classes={classes}
          defaultFeedback={defaultFeedback}
          data={data}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly when delete is not allowed', () => {
    const tree = renderer
      .create(
        <ChoiceConfiguration
          allowDelete={false}
          classes={classes}
          defaultFeedback={defaultFeedback}
          data={data}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('index - logic', () => {
  let wrapper, instance, onChange;

  beforeEach(() => {
    onChange = jest.fn();

    wrapper = shallow(
      <ChoiceConfiguration
        classes={classes}
        defaultFeedback={defaultFeedback}
        data={data}
        onChange={onChange}
      />
    );
    instance = wrapper.instance();
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
      expect(onChange.mock.calls[0][0]).toMatchObject({
        feedback: { type: 'default' }
      });
    });
  });

  describe('onFeedbackValueChange', () => {
    it('calls onChange', () => {
      instance.onFeedbackValueChange('new feedback');
      expect(onChange.mock.calls[0][0]).toMatchObject({
        feedback: { value: 'new feedback' }
      });
    });
  });
});
