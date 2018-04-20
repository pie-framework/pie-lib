import React from 'react';

import renderer from 'react-test-renderer';
import { PartialScoringConfig } from '../index';

describe('index', () => {

  it('empty - renders snapshots', () => {
    const tree = renderer
      .create(<PartialScoringConfig
        classes={{}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});