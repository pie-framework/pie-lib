import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { EditableHtml } from '../components/EditableHtml';

describe('Div to Paragraph Conversion', () => {
  it('converts consecutive divs to paragraph with br tags', async () => {
    const markup = '<div>A</div><div>B</div>';
    const { container } = render(<EditableHtml markup={markup} onChange={() => {}} pluginProps={{}} />);

    // Wait for the editor to initialize
    await waitFor(() => {
      const prosemirror = container.querySelector('.ProseMirror');
      expect(prosemirror).toBeInTheDocument();
    });

    // Check that the content was converted to a paragraph
    const paragraph = container.querySelector('.ProseMirror p');
    expect(paragraph).toBeInTheDocument();

    // Check that br tag is present
    const br = container.querySelector('.ProseMirror p br');
    expect(br).toBeInTheDocument();

    // Verify the text content
    expect(paragraph.textContent).toBe('AB');
  });

  it('converts three consecutive divs correctly', async () => {
    const markup = '<div>First</div><div>Second</div><div>Third</div>';
    const { container } = render(<EditableHtml markup={markup} onChange={() => {}} pluginProps={{}} />);

    await waitFor(() => {
      const prosemirror = container.querySelector('.ProseMirror');
      expect(prosemirror).toBeInTheDocument();
    });

    const paragraph = container.querySelector('.ProseMirror p');
    expect(paragraph).toBeInTheDocument();

    // Should have 2 br tags (between 3 items)
    const brTags = container.querySelectorAll('.ProseMirror p br');
    expect(brTags.length).toBe(2);

    expect(paragraph.textContent).toBe('FirstSecondThird');
  });

  it('does not convert single div', async () => {
    const markup = '<div>Single</div>';
    const { container } = render(<EditableHtml markup={markup} onChange={() => {}} pluginProps={{}} />);

    await waitFor(() => {
      const prosemirror = container.querySelector('.ProseMirror');
      expect(prosemirror).toBeInTheDocument();
    });

    // Should remain as a div
    const div = container.querySelector('.ProseMirror div');
    expect(div).toBeInTheDocument();
    expect(div.textContent).toBe('Single');
  });

  it('does not convert divs with attributes', async () => {
    const markup = '<div class="test">A</div><div>B</div>';
    const { container } = render(<EditableHtml markup={markup} onChange={() => {}} pluginProps={{}} />);

    await waitFor(() => {
      const prosemirror = container.querySelector('.ProseMirror');
      expect(prosemirror).toBeInTheDocument();
    });

    // Should remain as divs since one has an attribute
    const divs = container.querySelectorAll('.ProseMirror div');
    expect(divs.length).toBeGreaterThanOrEqual(2);
  });

  it('handles divs with inline formatting', async () => {
    const markup = '<div><strong>Bold</strong></div><div><em>Italic</em></div>';
    const { container } = render(<EditableHtml markup={markup} onChange={() => {}} pluginProps={{}} />);

    await waitFor(() => {
      const prosemirror = container.querySelector('.ProseMirror');
      expect(prosemirror).toBeInTheDocument();
    });

    // Should be converted to paragraph
    const paragraph = container.querySelector('.ProseMirror p');
    expect(paragraph).toBeInTheDocument();

    // Check that formatting is preserved
    const strong = container.querySelector('.ProseMirror p strong');
    const em = container.querySelector('.ProseMirror p em');
    expect(strong).toBeInTheDocument();
    expect(em).toBeInTheDocument();
  });

  it('does not convert mixed element types', async () => {
    const markup = '<div>A</div><p>B</p>';
    const { container } = render(<EditableHtml markup={markup} onChange={() => {}} pluginProps={{}} />);

    await waitFor(() => {
      const prosemirror = container.querySelector('.ProseMirror');
      expect(prosemirror).toBeInTheDocument();
    });

    // Should have both div and paragraph
    const div = container.querySelector('.ProseMirror div');
    const p = container.querySelector('.ProseMirror p');
    expect(div).toBeInTheDocument();
    expect(p).toBeInTheDocument();
  });

  it('does not convert divs with nested block elements', async () => {
    const markup = '<div><div>Nested</div></div><div>B</div>';
    const { container } = render(<EditableHtml markup={markup} onChange={() => {}} pluginProps={{}} />);

    await waitFor(() => {
      const prosemirror = container.querySelector('.ProseMirror');
      expect(prosemirror).toBeInTheDocument();
    });

    // Should remain as divs
    const divs = container.querySelectorAll('.ProseMirror > div');
    expect(divs.length).toBeGreaterThanOrEqual(1);
  });
});
