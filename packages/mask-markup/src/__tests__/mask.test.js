import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Mask from '../mask';

describe('Mask', () => {
  // Don't mock renderChildren - let the component render naturally
  const onChange = jest.fn();
  const defaultProps = {
    onChange,
    layout: {
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              text: 'Foo',
            },
          ],
        },
      ],
    },
    value: {},
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Mask {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders text content', () => {
      render(<Mask {...defaultProps} />);
      expect(screen.getByText('Foo')).toBeInTheDocument();
    });

    it('renders a paragraph element', () => {
      const { container } = render(
        <Mask
          {...defaultProps}
          layout={{
            nodes: [
              {
                type: 'p',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        text: 'Foo',
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        />,
      );

      // Paragraph is rendered as a styled div, not a <p> tag
      expect(screen.getByText('Foo')).toBeInTheDocument();
    });

    it('renders nested div and paragraph', () => {
      const { container } = render(
        <Mask
          {...defaultProps}
          layout={{
            nodes: [
              {
                type: 'div',
                data: {
                  attributes: {},
                },
                nodes: [
                  {
                    type: 'p',
                    data: {
                      attributes: {},
                    },
                    nodes: [
                      {
                        object: 'text',
                        leaves: [
                          {
                            text: 'Foo',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        />,
      );

      expect(container.querySelector('div')).toBeInTheDocument();
      // Paragraph is rendered as a styled div, not a <p> tag
      expect(screen.getByText('Foo')).toBeInTheDocument();
    });

    it('renders text with italic marks', () => {
      const { container } = render(
        <Mask
          {...defaultProps}
          layout={{
            nodes: [
              {
                leaves: [{ text: 'Foo ' }],
                object: 'text',
              },
              {
                leaves: [
                  {
                    marks: [
                      {
                        data: undefined,
                        type: 'italic',
                      },
                    ],
                    text: 'x',
                  },
                ],
                object: 'text',
              },
              {
                leaves: [{ text: ' bar' }],
                object: 'text',
              },
            ],
            object: 'block',
            type: 'div',
          }}
        />,
      );

      // Text "Foo " is split with spaces, use regex
      expect(screen.getByText(/Foo/)).toBeInTheDocument();
      expect(screen.getByText('x')).toBeInTheDocument();
      expect(screen.getByText(/bar/)).toBeInTheDocument();
      // Check for italic/em element
      const em = container.querySelector('em, i');
      expect(em).toBeInTheDocument();
      expect(em.textContent).toBe('x');
    });

    it('renders tbody without extra space', () => {
      const da = () => ({ data: { attributes: {} } });
      const { container } = render(
        <Mask
          {...defaultProps}
          layout={{
            nodes: [
              {
                type: 'table',
                ...da(),
                nodes: [
                  {
                    type: 'tbody',
                    ...da(),
                    nodes: [
                      {
                        object: 'text',
                        leaves: [{ text: ' ' }],
                      },
                      { type: 'tr', ...da(), nodes: [] },
                    ],
                  },
                ],
              },
            ],
          }}
        />,
      );

      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
      expect(container.querySelector('tr')).toBeInTheDocument();
    });
  });

  describe('mark rendering', () => {
    const markedLayout = (marks, text = 'x') => ({
      nodes: [
        {
          object: 'text',
          leaves: [{ marks, text }],
        },
      ],
    });

    it('renders a mark as an element, not as escaped html text', () => {
      const { container } = render(<Mask {...defaultProps} layout={markedLayout([{ type: 'bold' }])} />);

      const b = container.querySelector('b');
      expect(b).toBeInTheDocument();
      expect(b.textContent).toBe('x');
      // the tag must not leak into the text content
      expect(container.textContent).toBe('x');
    });

    it.each([
      ['bold', 'b'],
      ['italic', 'em'],
      ['underline', 'u'],
      ['strikethrough', 's'],
      ['code', 'code'],
      ['strong', 'strong'],
    ])('maps the %s mark to a <%s> element', (markType, tag) => {
      const { container } = render(<Mask {...defaultProps} layout={markedLayout([{ type: markType }])} />);

      const el = container.querySelector(tag);
      expect(el).toBeInTheDocument();
      expect(el.textContent).toBe('x');
    });

    it('nests multiple marks, keeping the first mark as the outermost tag', () => {
      const { container } = render(
        <Mask {...defaultProps} layout={markedLayout([{ type: 'bold' }, { type: 'italic' }])} />,
      );

      const nested = container.querySelector('b > em');
      expect(nested).toBeInTheDocument();
      expect(nested.textContent).toBe('x');
      expect(container.textContent).toBe('x');
    });

    it('nests three marks in mark order', () => {
      const { container } = render(
        <Mask
          {...defaultProps}
          layout={markedLayout([{ type: 'underline' }, { type: 'strikethrough' }, { type: 'italic' }])}
        />,
      );

      const nested = container.querySelector('u > s > em');
      expect(nested).toBeInTheDocument();
      expect(nested.textContent).toBe('x');
    });

    it('renders plain text when no mark maps to a tag', () => {
      const { container } = render(<Mask {...defaultProps} layout={markedLayout([{ type: 'unknown-mark' }])} />);

      expect(container.textContent).toBe('x');
      expect(container.firstChild.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
    });

    it('wraps only the marks that map to a tag', () => {
      const { container } = render(
        <Mask {...defaultProps} layout={markedLayout([{ type: 'unknown-mark' }, { type: 'bold' }])} />,
      );

      const b = container.querySelector('b');
      expect(b).toBeInTheDocument();
      expect(b.textContent).toBe('x');
      expect(container.textContent).toBe('x');
    });

    it('renders marked text inline alongside unmarked text', () => {
      const { container } = render(
        <Mask
          {...defaultProps}
          layout={{
            nodes: [
              { object: 'text', leaves: [{ text: 'Foo ' }] },
              { object: 'text', leaves: [{ marks: [{ type: 'bold' }, { type: 'italic' }], text: 'x' }] },
              { object: 'text', leaves: [{ text: ' bar' }] },
            ],
            object: 'block',
            type: 'div',
          }}
        />,
      );

      expect(container.querySelector('b > em').textContent).toBe('x');
      expect(container.textContent).toBe('Foo x bar');
    });
  });

  describe('spacer rendering for DnD components', () => {
    it('adds spacers before and after DnD blank components', () => {
      const mockRenderChildren = jest.fn((n) => {
        if (n.data?.dataset?.component === 'blank') {
          return <span data-testid="blank-component">Blank</span>;
        }
        return null;
      });

      const { container } = render(
        <Mask
          {...defaultProps}
          renderChildren={mockRenderChildren}
          layout={{
            nodes: [
              {
                type: 'div',
                data: {
                  dataset: { component: 'blank' },
                  attributes: {},
                },
                nodes: [],
              },
            ],
          }}
        />,
      );

      // Check that renderChildren was called and spacers are present
      // Count all children in the container - should be: spacer + blank + spacer = 3 elements
      const maskContainer = container.firstChild;
      expect(maskContainer.childNodes.length).toBe(3);
      expect(screen.getByTestId('blank-component')).toBeInTheDocument();
    });

    it('does not add spacers for non-DnD components', () => {
      const mockRenderChildren = jest.fn((n) => {
        return <span data-testid="regular-component">Regular</span>;
      });

      const { container } = render(
        <Mask
          {...defaultProps}
          renderChildren={mockRenderChildren}
          layout={{
            nodes: [
              {
                type: 'div',
                data: {
                  attributes: {},
                },
                nodes: [],
              },
            ],
          }}
        />,
      );

      // Should not have spacers - only the regular component
      const maskContainer = container.firstChild;
      expect(maskContainer.childNodes.length).toBe(1);
      expect(screen.getByTestId('regular-component')).toBeInTheDocument();
    });

    it('adds spacers regardless of parent node type', () => {
      const mockRenderChildren = jest.fn((n) => {
        if (n.data?.dataset?.component === 'blank') {
          return <span data-testid="blank-in-td">Blank in TD</span>;
        }
        return null;
      });

      const { container } = render(
        <Mask
          {...defaultProps}
          renderChildren={mockRenderChildren}
          elementType="drag-in-the-blank"
          layout={{
            nodes: [
              {
                type: 'table',
                data: { attributes: {} },
                nodes: [
                  {
                    type: 'tbody',
                    data: { attributes: {} },
                    nodes: [
                      {
                        type: 'tr',
                        data: { attributes: {} },
                        nodes: [
                          {
                            type: 'td',
                            data: { attributes: {} },
                            nodes: [
                              {
                                type: 'div',
                                data: {
                                  dataset: { component: 'blank' },
                                  attributes: {},
                                },
                                nodes: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        />,
      );

      // Should have spacers even inside td element
      const td = container.querySelector('td');
      expect(td.childNodes.length).toBe(3); // spacer + blank + spacer
      expect(screen.getByTestId('blank-in-td')).toBeInTheDocument();
    });

    it('does not add spacers for text content', () => {
      const { container } = render(
        <Mask
          {...defaultProps}
          elementType="drag-in-the-blank"
          layout={{
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'Some text',
                  },
                ],
              },
            ],
          }}
        />,
      );

      // Should not have spacers for plain text - just text node
      const maskContainer = container.firstChild;
      expect(maskContainer.childNodes.length).toBe(1);
      expect(maskContainer.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(screen.getByText('Some text')).toBeInTheDocument();
    });

    it('handles multiple DnD components with correct spacer placement', () => {
      const mockRenderChildren = jest.fn((n) => {
        if (n.data?.dataset?.component === 'blank') {
          return <span data-testid={`blank-${n.data.testId}`}>Blank</span>;
        }
        return null;
      });

      const { container } = render(
        <Mask
          {...defaultProps}
          renderChildren={mockRenderChildren}
          layout={{
            nodes: [
              {
                type: 'div',
                data: {
                  dataset: { component: 'blank' },
                  attributes: {},
                  testId: '1',
                },
                nodes: [],
              },
              {
                type: 'div',
                data: {
                  dataset: { component: 'blank' },
                  attributes: {},
                  testId: '2',
                },
                nodes: [],
              },
            ],
          }}
        />,
      );

      // Should have 2 spacers per component = 4 spacers + 2 blanks = 6 total children
      const maskContainer = container.firstChild;
      expect(maskContainer.childNodes.length).toBe(6);
      expect(screen.getByTestId('blank-1')).toBeInTheDocument();
      expect(screen.getByTestId('blank-2')).toBeInTheDocument();
    });
  });
});
