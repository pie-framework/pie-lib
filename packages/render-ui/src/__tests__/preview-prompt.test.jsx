import React from 'react';
import _ from 'lodash';
import {shallow} from 'enzyme';
import PreviewPrompt from '../preview-prompt';

describe('Prompt without Custom tag ', () => {
    let wrapper;
    let mkWrapper = (opts) => {
      opts = _.extend(
            {
                classes : {},
                prompt: 'Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math>',
                tagName: "",
                className: ""
            },
            opts
          );
     
        return shallow(<PreviewPrompt {...opts} />);
      };
    
    beforeEach(() => {
        wrapper = mkWrapper();
    });

    describe('default class with markup', () => {
        it('renders', () => {
            expect(wrapper.hasClass("prompt")).toEqual(false);
            expect(wrapper).toMatchSnapshot();
        });
    });
});

describe('Prompt with Custom tag ', () => {
    let wrapper;
    let mkWrapper = (opts) => {
      opts = _.extend(
            {
                classes : {},
                prompt: 'Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math>',
                tagName: "",
                className: ""
            },
            opts
          );    
        return shallow(<PreviewPrompt {...opts} />);
    };

    
    beforeEach(() => {
        wrapper = mkWrapper({tagName: "span", className: "prompt"});
    });

    describe('renders with custom tag "span" correctly', () => {
        it('renders', () => {
            expect(wrapper.hasClass("prompt")).toEqual(true);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
