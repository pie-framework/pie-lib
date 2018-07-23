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
      percent: 100,
      onChange,
      classes: {},
      ...extras
    };

    return shallow(<ImageToolbar {...props} />);
  };

  describe('onChange', () => {
    it('calls onChange with percent', () => {
      const w = mkWrapper();
      w.instance().onPercentClick(25);
      expect(onChange).toHaveBeenCalledWith(25);
    });
  });
});
