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
});
