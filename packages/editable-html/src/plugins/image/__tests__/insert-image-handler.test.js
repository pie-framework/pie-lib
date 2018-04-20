import MockChange, { MockDocument } from './mock-change';

import { Data } from 'slate';
import InsertImageHandler from '../insert-image-handler';

expect.extend({
  toMatchData: (received, argument) => {
    const argData = Data.create(argument);
    const pass = argData.equals(received.data);
    if (pass) {
      return {
        message: () =>
          `expected ${received.toJSON()} not to be divisible by ${argData.toJSON()}`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `expected ${received.toJSON()} to be divisible by ${argData.toJSON()}`,
        pass: false
      };
    }
  }
});
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

  const block = { key: 1 };
  const onChange = jest.fn();

  const handler = new InsertImageHandler(block, () => value, onChange);

  test('it constructs', () => {
    expect(handler).not.toEqual(undefined);
  });

  describe('fileChosen', () => {
    let fileReader;
    beforeEach(() => {
      fileReader = {
        readAsDataURL: jest.fn()
      };

      global.FileReader = () => fileReader;
      handler.fileChosen({});
    });

    test('calls readAsDataURL', () => {
      expect(fileReader.readAsDataURL).toBeCalledWith({});
    });

    test('calls onChange with src -> dataUrl', () => {
      fileReader.result = 'dataURL';
      fileReader.onload();
      expect(change.setNodeByKey).toBeCalledWith(block.key, expect.anything());
      expect(change.setNodeByKey.mock.calls[0][1]).toMatchData({
        src: 'dataURL'
      });
      expect(onChange).toBeCalledWith(change);
    });
  });

  describe('progress', () => {
    test('calls change w/ percent', () => {
      handler.progress(40, 40, 100);
      expect(change.setNodeByKey).toBeCalledWith(block.key, expect.anything());

      expect(change.setNodeByKey.mock.calls[0][1].data.toJS()).toMatchObject({
        percent: 40
      });
    });
  });

  describe('done', () => {
    test('calls setNodeByKey', () => {
      handler.done(null, 'src');

      expect(change.setNodeByKey).toBeCalledWith(block.key, expect.anything());

      expect(change.setNodeByKey.mock.calls[0][1].data.toJS()).toMatchObject({
        src: 'src',
        loaded: true,
        percent: 100
      });
    });
  });

  describe('cancel', () => {
    beforeEach(() => {
      handler.cancel();
    });

    test('calls onChange', () => {
      expect(onChange).toBeCalled();
    });

    test('calls removeNodeByKey', () => {
      expect(change.removeNodeByKey).toBeCalledWith(block.key);
    });
  });
});
