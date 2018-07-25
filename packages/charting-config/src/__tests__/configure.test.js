import * as React from 'react';
import DisplayConfig from '../display-config';
import GraphAttributeConfig from '../graph-attribute-config';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { InputRadio, InputCheckbox, InputContainer } from '@pie-lib/config-ui';
import * as configUi from '@pie-lib/config-ui';
import Box from '../box';
import { shallowChild } from '@pie-lib/test-utils';

const defaultProps = {
  model: {
    id: '1',
    element: 'point-intercept',
    //below is the legacy corespring point intercept model...
    minimumWidth: 500,
    correctResponse: ['0,0', '1,1', '2,2', '3,3'],
    partialScoring: [],
    feedback: {
      correctFeedbackType: 'none',
      correctFeedbackValue: '',
      partialFeedbackType: 'none',
      partialFeedbackValue: '',
      incorrectFeedbackType: 'none',
      incorrectFeedbackValue: ''
    },
    model: {
      config: {
        graphTitle: '',
        graphWidth: 500,
        graphHeight: 500,
        maxPoints: '',
        labelsType: 'present',
        pointLabels: ['A', 'B', 'C', 'D'],
        domainLabel: '',
        domainMin: -10,
        domainMax: 10,
        domainStepValue: 1,
        domainSnapValue: 1,
        domainLabelFrequency: 1,
        domainGraphPadding: 50,
        rangeLabel: '',
        rangeMin: -10,
        rangeMax: 10,
        rangeStepValue: 1,
        rangeSnapValue: 1,
        rangeLabelFrequency: 1,
        rangeGraphPadding: 50,
        sigfigs: -1,
        allowPartialScoring: false,
        pointsMustMatchLabels: false,
        showCoordinates: false,
        showPointLabels: true,
        showInputs: true,
        showAxisLabels: true,
        showFeedback: true
      }
    }
  }
};

describe('DisplayConfig', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      config: defaultProps.model.model.config,
      onChange: jest.fn(),
      resetToDefaults: jest.fn()
    };

    wrapper = shallowChild(DisplayConfig, props, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(Button).length).toEqual(1);
    expect(component.find(InputCheckbox).length).toEqual(3);
    expect(component.find(InputContainer).length).toEqual(5);
    expect(component.find(Input).length).toEqual(5);
  });
});

describe('GraphAttributeConfig', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      config: defaultProps.model.model.config,
      onChange: jest.fn()
    };

    wrapper = shallowChild(GraphAttributeConfig, props, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(Box).length).toEqual(1);
    //expect(component.find(Input).length).toBeGreaterThan(10);
    //expect(component.find(InputContainer).length).toBeGreaterThan(10);
  });
});
