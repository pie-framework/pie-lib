import MockChange, { MockDocument } from './mock-change';
import { assert, match, stub } from 'sinon';

import { Data } from 'slate';
import InsertImageHandler from '../insert-image-handler';

describe('insert image handler', () => {

  let change, document, value;
  beforeEach(() => {
    document = new MockDocument();
    change = new MockChange();
    value = {
      change: () => change,
      document
    };
  });



  const block = { key: 1 }
  const onChange = stub();

  const handler = new InsertImageHandler(
    block,
    () => value,
    onChange);

  test('it constructs', () => {
    expect(handler).not.toEqual(undefined);
  });

  describe('fileChosen', () => {
    let fileReader;
    beforeEach(() => {

      fileReader = {
        readAsDataURL: stub()
      }

      global.FileReader = () => fileReader
      handler.fileChosen({});
    });

    test('calls readAsDataURL', () => {
      assert.calledWith(fileReader.readAsDataURL, {});
    });

    test('calls onChange with src -> dataUrl', () => {
      fileReader.result = 'dataURL';
      fileReader.onload();
      assert.calledWith(
        change.setNodeByKey,
        block.key,
        match(v => v.data.get('src', 'dataURL'), 'matched'));
      assert.calledWith(onChange, change);
    });
  });

  describe('progress', () => {

    test('calls change w/ percent', () => {

      handler.progress(40, 40, 100);
      assert.calledWith(change.setNodeByKey, block.key, match(v => v.data.get('percent') === 40, 'matched'));
    });
  });

  describe('done', () => {

    test('calls setNodeByKey', () => {
      handler.done(null, 'src');

      assert.calledWith(change.setNodeByKey, block.key, {
        data: match(v => {
          return v.get('src') === 'src' &&
            v.get('loaded') &&
            v.get('percent') === 100;
        }, 'data matched')
      });
    });
  });

  describe('cancel', () => {
    beforeEach(() => {
      handler.cancel();
    });

    test('calls onChange', () => {
      assert.called(onChange);
    });

    test('calls removeNodeByKey', () => {
      assert.calledWith(change.removeNodeByKey, block.key);
    });
  });
});