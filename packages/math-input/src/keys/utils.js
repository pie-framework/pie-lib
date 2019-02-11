export const mkSet = category => o => ({ ...o, category });

export const toArray = o => Object.keys(o).map(k => o[k]);

export const toKey = category => v => {
  if (typeof v === 'string') {
    return {
      name: v,
      label: v,
      category,
      write: v
    };
  } else {
    return {
      ...v,
      category
    };
  }
};
