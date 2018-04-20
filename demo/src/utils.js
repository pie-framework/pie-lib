export const asPath = p => {
  const isProd =
    process && process.env && process.env.NODE_ENV === 'production'; // eslint-disable-line
  return isProd ? `/pie-lib${p}` : p;
};
