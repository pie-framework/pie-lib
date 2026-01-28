export const valueToSize = (v) => {
  if (!v) {
    return;
  }

  const calcRegex = /^calc\((.*)\)$/;

  if (typeof v === 'string') {
    if (v.endsWith('%')) {
      return undefined;
    }

    if (
      v.endsWith('px') ||
      v.endsWith('vh') ||
      v.endsWith('vw') ||
      v.endsWith('ch') ||
      v.endsWith('em') ||
      v.match(calcRegex)
    ) {
      return v;
    }

    const value = parseInt(v, 10);

    return Number.isNaN(value) ? value : `${value}px`;
  }

  if (typeof v === 'number') {
    return `${v}px`;
  }
};
