import EditTable from 'slate-edit-table';
import TablePlugin, { serialization, parseStyleString, reactAttributes } from '../index';
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
        plugin.toolbar.onClick({ change: jest.fn().mockReturnValue({}) }, onChange);

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

    describe('customToolbar', () => {
      describe('toggleBorder', () => {
        const assertToggle = (border, expectedBorder) => {
          describe(`with initial border of ${border}`, () => {
            let change;
            let done;

            beforeEach(() => {
              const plugin = TablePlugin();
              change = {
                setNodeByKey: jest.fn().mockReturnThis()
              };
              plugin.utils.getTableBlock = jest.fn().mockReturnValue({
                key: 'tableKey',
                data: Data.create({ border })
              });
              const node = { key: 'nodeKey' };
              const value = {
                change: jest.fn().mockReturnValue(change)
              };
              done = jest.fn();
              const Comp = plugin.toolbar.customToolbar(node, value, done);
              const c = Comp();
              c.props.onToggleBorder();
            });

            it(`calls setNodeByKey with ${expectedBorder}`, () => {
              expect(change.setNodeByKey).toHaveBeenCalledWith('tableKey', {
                data: Data.create({ border: expectedBorder })
              });
            });

            it('calls onToolbarDone', () => {
              expect(done).toHaveBeenCalledWith(change, false);
            });
          });
        };

        assertToggle(null, '1');
        assertToggle(undefined, '1');
        assertToggle('0', '1');
        assertToggle('1', '0');
        assertToggle('2', '0');
      });
    });

    describe('normalizeNode', () => {
      it('should exit the function if the node is not of type document', () => {
        const tablePlugin = TablePlugin();
        const returnValue = tablePlugin.normalizeNode({ object: 'table' });

        expect(returnValue).toEqual(undefined);
      });

      it('should exit there are no changes needed', () => {
        const tablePlugin = TablePlugin();
        const nodes = {
          size: 3,
          findLastIndex: jest.fn().mockReturnValue(1)
        };
        const returnValue = tablePlugin.normalizeNode({
          object: 'document',
          nodes
        });
        expect(returnValue).toEqual(undefined);
      });

      it('should return a function if the last element in the document is a table', () => {
        const tablePlugin = TablePlugin();
        const nodes = {
          size: 2,
          findLastIndex: jest.fn().mockReturnValue(1),
          get: jest.fn().mockReturnValue({
            key: '99',
            toJSON: jest.fn().mockReturnValue({ object: 'block', type: 'table' })
          })
        };
        const findDescendant = jest.fn(callback => {
          nodes.forEach(n => callback(n));
        });
        const prevTextReturned = { key: '1', text: 'foobar' };
        const change = {
          withoutNormalization: jest.fn(callback => {
            callback();
          }),
          insertBlock: jest.fn(),
          removeNodeByKey: jest.fn(),
          value: {
            document: {
              getPreviousText: jest.fn().mockReturnValue(prevTextReturned)
            }
          }
        };
        change.moveFocusTo = jest.fn().mockReturnValue(change);
        change.moveAnchorTo = jest.fn().mockReturnValue(change);

        const returnValue = tablePlugin.normalizeNode({
          object: 'document',
          nodes,
          findDescendant
        });

        expect(returnValue).toEqual(expect.any(Function));

        returnValue(change);

        expect(change.removeNodeByKey).toHaveBeenCalledWith('99');
        expect(change.insertBlock).toHaveBeenCalledWith(expect.any(Object));

        expect(change.withoutNormalization).toHaveBeenCalledWith(expect.any(Function));

        expect(change.moveFocusTo).toHaveBeenCalledWith('1', prevTextReturned.text.length);
        expect(change.moveAnchorTo).toHaveBeenCalledWith('1', prevTextReturned.text.length);

        expect(change.insertBlock).toHaveBeenCalledWith(
          expect.objectContaining({ object: 'block', type: 'table' })
        );
      });
    });
  });
});

describe('parseStyleString', () => {
  const parses = (s, expected) => {
    it(`parses ${s} -> ${JSON.stringify(expected)}`, () => {
      const result = parseStyleString(s);
      expect(result).toEqual(expected);
    });
  };
  parses(' width: 10px ', { width: '10px' });
  parses(' width: 10px; ', { width: '10px' });
  parses(' border-width: 10px; ', { 'border-width': '10px' });
  parses(' border: solid 1px red; height: 1px', {
    border: 'solid 1px red',
    height: '1px'
  });
});

describe('toStyleString', () => {
  const styleString = (o, expected) => {
    it(`${JSON.stringify(s)} -> ${expected}`, () => {
      const result = toStyleString(o);
      expect(result).toEqual(expected);
    });
  };
});

describe('reactAttributes', () => {
  const attributes = (o, expected) => {
    it(`${JSON.stringify(o)} -> ${JSON.stringify(expected)}`, () => {
      const result = reactAttributes(o);
      expect(result).toEqual(expected);
    });
  };
  attributes({ 'border-width': '10px' }, { borderWidth: '10px' });
});

describe('serialization', () => {
  describe('deserialize', () => {
    let next;

    beforeEach(() => {
      next = jest.fn().mockReturnValue([]);
    });

    describe('table', () => {
      let el;
      let out;
      beforeEach(() => {
        el = {
          tagName: 'table',
          children: [],
          getAttribute: jest.fn(name => {
            switch (name) {
              case 'border':
                return '1';
              case 'cellspacing':
                return '2';
              case 'cellpadding':
                return '3';
              case 'class':
                return 'table-class';
              case 'style':
                return 'width: 10px';
            }
          })
        };
        out = serialization.deserialize(el, next);
      });

      const assertData = (name, value) => {
        it(`data.${name} should eql ${value}`, () => {
          expect(out.data[name]).toEqual(value);
        });
      };

      assertData('border', '1');
      assertData('cellspacing', '2');
      assertData('cellpadding', '3');
      assertData('class', 'table-class');
      assertData('style', { width: '10px' });
      it('returns a table block', () => {
        expect(out).toMatchObject({
          object: 'block',
          type: 'table',
          nodes: []
        });
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
        childNodes: [],
        getAttribute: jest.fn(function(name) {
          const o = {
            class: 'class name',
            colspan: '1',
            rowspan: '1'
          };
          return o[name];
        })
      };

      const out = serialization.deserialize(el, next);

      expect(out).toEqual({
        object: 'block',
        type: 'table_cell',
        nodes: [],
        data: {
          colspan: '1',
          rowspan: '1',
          class: 'class name',
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
        data: Data.create({
          border: '1',
          cellpadding: '2',
          cellspacing: '3'
        })
      });

      expect(el).toEqual(
        <table border="1" cellPadding="2" cellSpacing="3">
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
          header: false,
          style: { width: '10px' },
          class: 'foo'
        })
      });

      expect(el).toEqual(<td style={{ width: '10px' }} className={'foo'} />);
    });
  });
});
