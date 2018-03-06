import { assert, match, stub } from 'sinon';
import { configure, shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-15';
import { Data } from 'slate';
import { ImageToolbar } from '../image-toolbar';
import MockChange from './mock-change';
import React from 'react';

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

test('onChange is called on button click', () => {

  const onChange = stub();
  const node = {
    key: 1,
    data: Data.create({ resizePercent: 100 })
  }

  const change = new MockChange();

  const value = {
    change: stub().returns(change)
  }

  const toolbar = shallow(<ImageToolbar
    node={node}
    value={value}
    classes={{}}
    onChange={onChange} />);

  const tbs = toolbar.find('[percent=25]');

  tbs.simulate('click');
  assert.calledWith(change.setNodeByKey, 1, { data: match.object });
  assert.calledWith(onChange, change);
});