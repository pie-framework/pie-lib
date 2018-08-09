import EditTable from 'slate-edit-table';
import TablePlugin, { serialization } from '../index';
import { Data } from 'slate';
import React from 'react';

jest.mock('slate-edit-table', () => {
  const mock = {
    default: jest.fn().mockReturnThis(),
    utils: {
      isSelectionInTable: jest.fn().mockReturnValue(true)
    },
    changes: {
      insertTable: jest.fn(function(c) {
        return c;
      })
    }
  };

  return jest.fn().mockReturnValue(mock);
});

describe('table', () => {
  describe('toolbar', () => {
    describe('onClick', () => {
      it('calls changes.insertTable', () => {
        const plugin = TablePlugin();
        const onChange = jest.fn();
        plugin.toolbar.onClick(
          { change: jest.fn().mockReturnValue({}) },
          onChange
        );

        expect(EditTable().changes.insertTable).toHaveBeenCalledWith({}, 2, 2);
      });
    });

    describe('supports', () => {
      const assertSupports = (inTable, object, expected) => {
        it(`inTable: ${inTable}, type: ${object} => ${expected}`, () => {
          EditTable().utils.isSelectionInTable.mockReturnValue(inTable);
          const plugin = TablePlugin();
          const supports = plugin.toolbar.supports({ object });
          expect(supports).toEqual(expected);
        });
      };

      assertSupports(true, 'block', true);
      assertSupports(false, 'block', false);
      assertSupports(true, 'inline', false);
      assertSupports(false, 'inline', false);
    });
  });
});

describe('serialization', () => {
  describe('deserialize', () => {
    let next;

    beforeEach(() => {
      next = jest.fn().mockReturnValue([]);
    });

    it('deserializes table', () => {
      const el = {
        tagName: 'table',
        children: [],
        getAttribute: jest.fn().mockReturnValue('1')
      };

      const out = serialization.deserialize(el, next);

      expect(out).toEqual({
        object: 'block',
        type: 'table',
        nodes: [],
        data: {
          border: '1'
        }
      });
    });

    it('deserializes tr', () => {
      const el = {
        tagName: 'tr',
        children: []
      };

      const out = serialization.deserialize(el, next);

      expect(out).toEqual({
        object: 'block',
        type: 'table_row',
        nodes: []
      });
    });

    it('deserializes td', () => {
      const el = {
        tagName: 'td',
        children: [],
        getAttribute: jest.fn(function() {
          return '1';
        })
      };

      const out = serialization.deserialize(el, next);

      expect(out).toEqual({
        object: 'block',
        type: 'table_cell',
        nodes: [],
        data: {
          colspan: '1',
          header: false
        }
      });
    });
  });

  describe('serialize', () => {
    it('serializes table', () => {
      const el = serialization.serialize({
        object: 'block',
        type: 'table',
        nodes: [],
        data: Data.create({ border: '1' })
      });

      expect(el).toEqual(
        <table border="1">
          <tbody />
        </table>
      );
    });

    it('serializes table_row', () => {
      const el = serialization.serialize({
        object: 'block',
        type: 'table_row',
        nodes: []
      });

      expect(el).toEqual(<tr />);
    });
    it('serializes table_cell', () => {
      const el = serialization.serialize({
        object: 'block',
        type: 'table_cell',
        nodes: [],
        data: Data.create({
          header: false
        })
      });

      expect(el).toEqual(<td />);
    });
  });
});
