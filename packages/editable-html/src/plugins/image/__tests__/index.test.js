import MockChange, { MockDocument } from './mock-change';

import { Data } from 'slate';
import ImageToolbar from '../';

describe('image plugin', () => {
  let value = {};

  const imageSupport = {
    delete: jest.fn(),
    add: jest.fn()
  };

  const imagePlugin = ImageToolbar({
    onDelete: ((src, done) => {
      imageSupport.delete(src, e => {
        done(e, value);
      });
    }),
    insertImageRequested: getHandler => {
      const handler = getHandler(() => value);
      imageSupport.add(handler);
    }
  });

  describe('normalizeNode', () => {
    it('should exit the function if the node is not of type document', () => {
      const returnValue = imagePlugin.normalizeNode({ object: 'image' });

      expect(returnValue).toEqual(undefined);
    });

    it('should exit if the function if there are no changes needed', () => {
      const nodes = [
        {
          object: 'text',
          text: 'Before Image'
        },
        {
          type: 'image'
        },
        {
          object: 'text',
          text: 'After Image'
        }
      ];
      const returnValue = imagePlugin.normalizeNode({
        object: 'document',
        findDescendant: jest.fn((callback) => {
          nodes.forEach(n => callback(n));
        })
      });
      expect(returnValue).toEqual(undefined);
    });

    it('should return a function if there is a node with an empty text before an image', () => {
      const nodes = [
        {
          object: 'text',
          text: '',
          key: '1'
        },
        {
          type: 'image',
          key: '2'
        },
        {
          object: 'text',
          text: 'After Image',
          key: '3'
        }
      ];
      const findDescendant = jest.fn((callback) => {
        nodes.forEach(n => callback(n));
      });
      const change = {
        withoutNormalization: jest.fn((callback) => {
          callback();
        }),
        insertTextByKey: jest.fn()
      };
      const returnValue = imagePlugin.normalizeNode({
        object: 'document',
        findDescendant
      });

      expect(returnValue).toEqual(expect.any(Function));

      returnValue(change);

      expect(change.withoutNormalization).toHaveBeenCalledWith(expect.any(Function));
      expect(change.insertTextByKey).toHaveBeenCalledWith('1', 0, ' ');
    });
  });
});
