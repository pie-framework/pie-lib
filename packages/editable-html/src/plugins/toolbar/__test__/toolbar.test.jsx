import { classObject, mockIconButton, mockMathInput } from '../../../__test__/utils';

import { Data } from 'slate';
import { RawToolbar } from '../toolbar';
import React from 'react';
import debug from 'debug';
import renderer from 'react-test-renderer';
import { stub } from 'sinon';

mockMathInput();

jest.mock('material-ui/IconButton', () => {
  return (props) => <div className={props.className} style={props.style} ariaLabel={props['aria-label']}></div>
});

const log = debug('editable-html:test:toolbar');


describe('toolbar', () => {

  let onDelete, classes;

  beforeEach(() => {
    onDelete = stub();
    classes = classObject('iconRoot', 'inline', 'toolbar', 'focused', 'shared', 'inline')
  });

  test('renders custom toolbar', () => {

    const node = {}

    const value = {
      isCollapsed: true,
      startKey: 1,
      document: {
        getClosestInline: stub().returns(node)
      }
    }

    const plugins = [
      {
        deleteNode: () => true,
        toolbar: {
          supports: () => true,
          customToolbar: () => () => <div> --------- custom toolbar ----------- </div>
        }
      }
    ];

    const tree = renderer
      .create(<RawToolbar
        plugins={plugins}
        classes={classes}
        value={value}
        onDone={() => ({})} />).toJSON();

    log('tree: ', JSON.stringify(tree, null, '  '));
    expect(tree).toMatchSnapshot();
  });

  describe('default', () => {
    let plugins;

    beforeEach(() => {
      plugins = [
        {
          toolbar: {}
        }
      ];
    });

    test('renders default toolbar', () => {

      const tree = renderer
        .create(<RawToolbar
          plugins={plugins}
          classes={classes}
          value={{}}
          onDone={() => ({})} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

  });
});
