import { ExtendedListItem } from '../extended-list-item';

describe('ExtendedListItem', () => {
  it('extends listItem and prefers div over paragraph in content spec', () => {
    expect(ExtendedListItem.name).toBe('listItem');

    const content =
      ExtendedListItem.options?.content ?? ExtendedListItem.config?.content ?? ExtendedListItem.extendOptions?.content;

    expect(String(content)).toMatch(/^\(div \| paragraph/);
    expect(String(content)).toContain('imageUploadNode');
  });
});
