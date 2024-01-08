import * as React from 'react';
import componentize from '../componentize';
import { deserialize } from '../serialization';

describe('index', () => {
  describe('componentize', () => {
    it('should return an array with the appropriate markup', () => {
      const dropDownMarkup = componentize('{{0}} foo {{1}}', 'dropdown');

      expect(dropDownMarkup).toEqual({
        markup:
          '<span data-component="dropdown" data-id="0"></span> foo <span data-component="dropdown" data-id="1"></span>',
      });
    });
  });

  describe('serialization', () => {
    it('should have default node a span', () => {
      expect(deserialize('something')).toEqual(
        expect.objectContaining({
          children: [
            {
              children: [
                {
                  text: 'something',
                },
              ],
              data: {
                attributes: {},
                dataset: {},
              },
              type: 'span',
            },
          ],
          data: {
            attributes: {},
            dataset: {},
          },
          type: 'body',
        }),
      );
    });
  });
});
