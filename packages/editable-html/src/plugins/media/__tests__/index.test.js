import MediaPlugin from '../';

describe('media plugin', () => {
  const imagePlugin = MediaPlugin('video');

  describe('normalizeNode', () => {
    it('should exit the function if the node is not of type document', () => {
      const returnValue = imagePlugin.normalizeNode({ object: 'image' });

      expect(returnValue).toEqual(undefined);
    });

    it('should exit there are no changes needed', () => {
      const nodes = [
        {
          object: 'text',
          text: 'Before Media'
        },
        {
          type: 'video'
        },
        {
          object: 'text',
          text: 'After Media'
        }
      ];
      const returnValue = imagePlugin.normalizeNode({
        object: 'document',
        findDescendant: jest.fn(callback => {
          nodes.forEach(n => callback(n));
        })
      });
      expect(returnValue).toEqual(undefined);
    });

    it('should return a function if there is a node with an empty text before a media element', () => {
      const nodes = [
        {
          object: 'text',
          text: '',
          key: '1'
        },
        {
          type: 'video',
          key: '2'
        },
        {
          object: 'text',
          text: 'After Media',
          key: '3'
        }
      ];
      const findDescendant = jest.fn(callback => {
        nodes.forEach(n => callback(n));
      });
      const change = {
        withoutNormalization: jest.fn(callback => {
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
