import React from 'react';
import debug from 'debug';
import MockChange from '../../image/__tests__/mock-change';
import { Data } from 'slate';
import MathPlugin, { CustomToolbarComp, inlineMath, serialization } from '../index';
import { render, screen } from '@testing-library/react';

jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn(),
  getInterface: jest.fn().mockReturnThis(),
  registerEmbed: jest.fn(),
}));

let mockMathToolbarOnChange;
let mockMathToolbarOnDone;

jest.mock('@pie-lib/math-toolbar', () => ({
  MathPreview: () => <div data-testid="math-preview" />,
  MathToolbar: (props) => {
    // Store callbacks for testing
    mockMathToolbarOnChange = props.onChange;
    mockMathToolbarOnDone = props.onDone;
    return (
      <div data-testid="math-toolbar" role="toolbar">
        <button data-testid="toolbar-change" onClick={() => props.onChange && props.onChange('test-latex')}>
          Change
        </button>
        <button data-testid="toolbar-done" onClick={() => props.onDone && props.onDone('test-latex')}>
          Done
        </button>
      </div>
    );
  },
}));

jest.mock('@pie-lib/math-rendering', () => ({
  ...jest.requireActual('@pie-lib/math-rendering'),
  mmlToLatex: jest.fn(() => {
    return '/foobar/latex';
  }),
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
          change: jest.fn(() => mockChange),
        };
        onChange = jest.fn();
        plugin.toolbar.onClick(value, onChange);
      });

      test('calls insertInline', () => {
        expect(mockChange.insertInline).toBeCalledWith(expect.objectContaining({ data: inlineMath().data }));
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
            innerHTML: html,
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
              wrapper: wrapType,
            },
          });
        });
      };

      assertDeserialize('$$&lt;$$', '<', MathPlugin.DOLLAR);
      assertDeserialize('$&lt;$', '<', MathPlugin.DOLLAR);
      assertDeserialize('\\(&lt;\\)', '<', MathPlugin.ROUND_BRACKETS);
      assertDeserialize('\\[&lt;\\]', '<', MathPlugin.ROUND_BRACKETS);
      assertDeserialize('latex', 'latex', MathPlugin.ROUND_BRACKETS);
      assertDeserialize('\\displaystyle foo', 'foo', MathPlugin.ROUND_BRACKETS);

      it('should make mathml editable if MathPlugin.mathMlOptions.mmlEditing is true', () => {
        MathPlugin.mathMlOptions.mmlEditing = true;
        const el = {
          tagName: 'math',
          outerHTML:
            '<math xmlns="http://www.w3.org/1998/Math/MathML">  <mn>2</mn>  <mi>x</mi>  <mtext>&#xA0;</mtext>  <mo>&#x2264;</mo>  <mn>4</mn>  <mi>y</mi>  <mtext>&#xA0;</mtext>  <mo>+</mo>  <mtext>&#xA0;</mtext>  <mn>8</mn> <msqrt>    <mi>h</mi>  </msqrt></math>',
        };
        const next = jest.fn();

        const out = serialization.deserialize(el, next);

        expect(out).toEqual({
          object: 'inline',
          type: 'math',
          isVoid: true,
          nodes: [],
          data: {
            latex: '/foobar/latex',
            wrapper: 'round_brackets',
          },
        });
      });

      it('should make mathml readOnly if MathPlugin.mathMlOptions.mmlEditing is false', () => {
        MathPlugin.mathMlOptions.mmlEditing = false;
        const el = {
          tagName: 'math',
          outerHTML:
            '<math xmlns="http://www.w3.org/1998/Math/MathML">  <mn>2</mn>  <mi>x</mi>  <mtext>&#xA0;</mtext>  <mo>&#x2264;</mo>  <mn>4</mn>  <mi>y</mi>  <mtext>&#xA0;</mtext>  <mo>+</mo>  <mtext>&#xA0;</mtext>  <mn>8</mn> <msqrt>    <mi>h</mi>  </msqrt></math>',
        };
        const next = jest.fn();

        const out = serialization.deserialize(el, next);

        expect(out).toEqual({
          object: 'inline',
          isVoid: true,
          type: 'mathml',
          data: {
            html: el.outerHTML,
          },
        });
      });
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
            data: Data.create({ latex, wrapper }),
          };
          const children = [];

          const out = serialization.serialize(object, children);
          log('out: ', out);
          expect(out).toEqual(
            <span data-latex="" data-raw={latex}>
              {expectedHtml}
            </span>,
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
      assertSerialize('x<y', '\\(x<y\\)');
    });
  });
});

describe('CustomToolbarComp', () => {
  let onDataChange;
  let onToolbarDone;

  const renderComponent = (extras = {}) => {
    let mockChange = new MockChange();
    const defaults = {
      node: {
        key: '1',
        data: Data.create({ latex: 'foo' }),
        equals: () => true,
      },
      value: {
        document: {
          getNextText: jest.fn().mockReturnValue({ key: 'nt' }),
        },
        change: jest.fn().mockReturnValue(mockChange),
      },
      onDataChange,
      onToolbarDone,
    };

    const props = {
      ...defaults,
      ...extras,
    };

    return render(<CustomToolbarComp {...props} />);
  };

  describe('render', () => {
    it('renders toolbar without default keypadMode', () => {
      renderComponent();

      // Verify the toolbar is rendered
      expect(screen.getByTestId('math-toolbar')).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('renders toolbar with default keypadMode', () => {
      renderComponent({ pluginProps: { math: { keypadMode: 'geometry' } } });

      // Verify the toolbar is rendered with keypadMode prop
      expect(screen.getByTestId('math-toolbar')).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });
  });

  describe('onDone', () => {
    it('calls onToolbarDone when done callback is triggered', () => {
      onToolbarDone = jest.fn();
      renderComponent();

      // Trigger the onDone callback that was passed to MathToolbar
      mockMathToolbarOnDone('oo');

      expect(onToolbarDone).toHaveBeenCalledWith(expect.anything(), false);
    });
  });

  describe('onChange', () => {
    it('calls onDataChange when change callback is triggered', () => {
      onDataChange = jest.fn();
      renderComponent();

      // Trigger the onChange callback that was passed to MathToolbar
      mockMathToolbarOnChange('oo');

      expect(onDataChange).toHaveBeenCalledWith('1', { latex: 'oo' });
    });
  });
});
