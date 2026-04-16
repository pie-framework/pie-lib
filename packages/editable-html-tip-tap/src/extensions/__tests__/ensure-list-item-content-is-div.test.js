import { EnsureListItemContentIsDiv } from '../ensure-list-item-content-is-div';

describe('EnsureListItemContentIsDiv', () => {
  it('registers a ProseMirror plugin that rewrites listItem paragraph children to div', () => {
    const plugins = EnsureListItemContentIsDiv.config.addProseMirrorPlugins();
    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins).toHaveLength(1);

    const plugin = plugins[0];
    const divType = { name: 'div' };
    const tr = { setNodeMarkup: jest.fn() };

    const paragraphChild = {
      type: { name: 'paragraph' },
      attrs: { class: 'x' },
      nodeSize: 6,
    };

    const listItemNode = {
      type: { name: 'listItem' },
      forEach: (cb) => cb(paragraphChild),
    };

    const newState = {
      schema: { nodes: { div: divType } },
      tr,
      doc: {
        descendants: (cb) => cb(listItemNode, 10),
      },
    };

    const result = plugin.spec.appendTransaction([{ docChanged: true }], {}, newState);

    expect(tr.setNodeMarkup).toHaveBeenCalledWith(11, divType, paragraphChild.attrs);
    expect(result).toBe(tr);
  });

  it('returns null when there is no document change', () => {
    const plugin = EnsureListItemContentIsDiv.config.addProseMirrorPlugins()[0];

    const result = plugin.spec.appendTransaction([{ docChanged: false }], {}, {});
    expect(result).toBeNull();
  });
});
