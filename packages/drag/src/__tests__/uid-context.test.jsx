import { createContext, createElement } from 'react';
import { withUid } from '../uid-context';

jest.mock('react', () => ({
  createElement: jest.fn(c => c),
  createContext: jest.fn().mockReturnValue({
    Consumer: jest.fn(fn => fn),
    Provider: jest.fn()
  })
}));

describe('id-context', () => {
  describe('withUid', () => {
    it('calls createElement', () => {
      const Wrapped = withUid(() => ({}));

      const Consumer = Wrapped({});
      expect(createElement).toBeCalledWith(
        expect.any(Function),
        null,
        expect.anything()
      );
    });
  });
});
