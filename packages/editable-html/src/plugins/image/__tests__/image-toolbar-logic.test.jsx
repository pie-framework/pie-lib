import { configure, shallow } from 'enzyme';

import { Data, Block, Value } from 'slate';
import { ImageToolbar } from '../image-toolbar';
import MockChange from './mock-change';
import React from 'react';

test('onChange is called on button click', () => {
  const onChange = jest.fn();
  const node = Block.fromJSON({
    type: 'image',
    key: 1,
    data: Data.create({ resizePercent: 100 })
  });

  const value = Value.fromJSON({});

  const c = {};
  c.setNodeByKey = jest.fn().mockReturnValue(c);

  value.change = jest.fn().mockReturnValue(c);

  const toolbar = shallow(
    <ImageToolbar node={node} value={value} classes={{}} onChange={onChange} />
  );

  const tbs = toolbar.find('[percent=25]');

  tbs.simulate('click');
  expect(c.setNodeByKey).toBeCalledWith(1, {
    data: expect.anything()
  });
  expect(onChange).toBeCalledWith(c);
});
