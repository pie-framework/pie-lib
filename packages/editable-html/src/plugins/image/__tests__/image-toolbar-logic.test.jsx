import { configure, shallow } from 'enzyme';

import { Data, Block, Value } from 'slate';
import { ImageToolbar } from '../image-toolbar';
import MockChange from './mock-change';
import React from 'react';

describe('ImageToolbar', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const mkWrapper = extras => {
    const props = {
      onChange,
      classes: {},
      ...extras
    };

    return shallow(<ImageToolbar {...props} />);
  };

  describe('onChange', () => {
      it('renders', function () {
        return expect(mkWrapper()).toMatchSnapshot();
      });
  });
});
