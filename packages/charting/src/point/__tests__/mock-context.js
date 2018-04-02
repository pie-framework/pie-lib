const scale = () => {
  const mock = jest.fn(n => n);
  mock.invert = jest.fn(n => n);
  return mock;
};

export const context = () => ({
  scale: {
    x: scale(),
    y: scale()
  },
  snap: {
    x: jest.fn(n => n),
    y: jest.fn(n => n)
  }
});
