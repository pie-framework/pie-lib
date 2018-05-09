import React from 'react';
import renderer from 'react-test-renderer';
import { NChoice } from '../two-choice';

describe('NChoice', () => {
    it('renders n choice radio buttons vertical correctly', () => {
        const tree = renderer
            .create(<NChoice
                direction="vertical"
                header="n-choice-vertical"
                value={'left'}
                onChange={jest.fn()}
                opts={[
                    { label: 'left', value: 'left' },
                    { label: 'center', value: 'center' },
                    { label: 'right', value: 'right' }
                ]}
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
})