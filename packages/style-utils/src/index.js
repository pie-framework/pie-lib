/**
 *  disable text selection
 */
export const noSelect = () => ({
  cursor: 'default',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
});
