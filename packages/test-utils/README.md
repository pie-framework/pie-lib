# test-utils


`test-utils` is a small collection of tools and helper functions that facilitate testing for components of the PIE framework.

## Usage

### Install

    npm install --save @pie-lib/test-utils


### Import

    import { shallowChild } from '@pie-lib/test-utils';


### Use it for testing HoC wrapped components

    const wrapper = shallowChild(ComponentX, defaultProps, 1); // 1 being nest level, for instance Material-UI styles wrapper HoC
    const componentWithSpecificProps = wrapper(specificProps);

    expect(componentWithSpecificProps.find('div').length).toEqual(1);
