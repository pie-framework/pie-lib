import React from 'react';
import debug from 'debug';
import MockChange from '../../image/__tests__/mock-change';
import { Data } from 'slate';
import MathPlugin, { serialization, inlineMath, CustomToolbarComp } from '../index';
import { shallow } from 'enzyme';
import { MathToolbar } from '@pie-lib/math-toolbar';
jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn(),
  getInterface: jest.fn().mockReturnThis(),
  registerEmbed: jest.fn()
}));
jest.mock('@pie-lib/math-toolbar', () => ({
  MathPreview: () => <div />,
  MathToolbar: () => <div />
}));
const log = debug('@pie-lib:editable-html:test:math');

// I believe @andrei is moving this stuff out.
describe('MathPlugin', () => {
  describe('toolbar', () => {
    describe('onClick', () => {
      let plugin, mockChange, value, onChange;
      beforeEach(() => {
        plugin = MathPlugin({});
        mockChange = new MockChange();
        value = {
          change: jest.fn(() => mockChange)
        };
        onChange = jest.fn();
        plugin.toolbar.onClick(value, onChange);
      });

      test('calls insertInline', () => {
        expect(mockChange.insertInline).toBeCalledWith(
          expect.objectContaining({ data: inlineMath().data })
        );
      });

      test('it calls onChange', () => {
        expect(onChange).toHaveBeenCalledWith(mockChange);
      });
    });
  });

  describe('renderNode', () => {
    test('the component has props', () => {
      const plugin = MathPlugin({});
      const { props } = plugin.renderNode({ node: { type: 'math' } });
      expect(props.node).toEqual({ type: 'math' });
    });
  });

  describe('serialization', () => {
    describe('deserialize', () => {
      const assertDeserialize = (html, expected, wrapType) => {
        it(`innerHTML: ${html} is deserialized to: ${expected} with wrapType: ${wrapType}`, () => {
          const el = {
            tagName: 'span',
            childNodes: [],
            getAttribute: jest.fn(() => ''),
            hasAttribute: jest.fn(() => true),
            innerHTML: html
          };
          const next = jest.fn();

          const out = serialization.deserialize(el, next);
          expect(out).toEqual({
            object: 'inline',
            type: 'math',
            isVoid: true,
            nodes: [],
            data: {
              latex: expected,
              wrapper: wrapType
            }
          });
        });
      };

      assertDeserialize('$$&lt;$$', '<', MathPlugin.DOLLAR);
      assertDeserialize('$&lt;$', '<', MathPlugin.DOLLAR);
      assertDeserialize('\\(&lt;\\)', '<', MathPlugin.ROUND_BRACKETS);
      assertDeserialize('\\[&lt;\\]', '<', MathPlugin.ROUND_BRACKETS);
      assertDeserialize('latex', 'latex', MathPlugin.ROUND_BRACKETS);
      assertDeserialize('\\displaystyle foo', 'foo', MathPlugin.ROUND_BRACKETS);
    });

    describe('serialize', () => {
      const assertSerialize = (latex, expectedHtml, wrapper) => {
        wrapper = wrapper || MathPlugin.ROUND_BRACKETS;
        it(`${latex} is serialized to: ${expectedHtml}`, () => {
          const object = {
            kind: 'inline',
            type: 'math',
            isVoid: true,
            nodes: [],
            data: Data.create({ latex, wrapper })
          };
          const children = [];

          const out = serialization.serialize(object, children);
          log('out: ', out);
          expect(out).toEqual(
            <span data-latex="" data-raw={latex}>
              {expectedHtml}
            </span>
          );
        });
      };

      assertSerialize('latex', '\\(latex\\)', MathPlugin.ROUND_BRACKETS);
      assertSerialize('latex', '\\(latex\\)', MathPlugin.SQUARE_BRACKETS);
      assertSerialize('latex', '$latex$', MathPlugin.DOLLAR);
      assertSerialize('latex', '$latex$', MathPlugin.DOUBLE_DOLLAR);

      /**
       * Note that when this is converted to html it get's escaped - but that's an issue with the slate html-serializer.
       */
      assertSerialize('<', '\\(<\\)');
    });
  });
});

describe('CustomToolbarComp', () => {
  let onDataChange;
  let onToolbarDone;

  const wrapper = extras => {
    let mockChange = new MockChange();
    const defaults = {
      node: {
        key: '1',
        data: Data.create({ latex: 'foo' }),
        equals: () => true
      },
      value: {
        document: {
          getNextText: jest.fn().mockReturnValue({ key: 'nt' })
        },
        change: jest.fn().mockReturnValue(mockChange)
      },
      onDataChange,
      onToolbarDone
    };

    const props = {
      ...defaults,
      ...extras
    };

    return shallow(<CustomToolbarComp {...props} />);
  };

  describe('render', () => {
    it('renders without default keypadMode', () => {
      const w = wrapper();

      expect(w).toMatchSnapshot();

      w.setProps({ pluginProps: { math: { keypadMode: 3 } } });

      expect(w).toMatchSnapshot();
    });

    it('renders with default keypadMode', () => {
      const w = wrapper({ pluginProps: { math: { keypadMode: 'geometry' } } });

      expect(w).toMatchSnapshot();

      w.setProps({ pluginProps: { math: { keypadMode: 3 } } });

      expect(w).toMatchSnapshot();
    });
  });

  describe('onDone', () => {
    it('calls onToolbarDone', () => {
      onToolbarDone = jest.fn();
      const w = wrapper();
      w.find(MathToolbar).prop('onDone')('oo');
      expect(onToolbarDone).toHaveBeenCalledWith(expect.anything(), false);
    });
  });

  describe('onChange', () => {
    it('calls onDataChange', () => {
      onDataChange = jest.fn();
      const w = wrapper();
      w.find(MathToolbar).prop('onChange')('oo');
      expect(onDataChange).toHaveBeenCalledWith('1', { latex: 'oo' });
    });
  });
});
