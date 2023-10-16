import { useState, useEffect } from 'react';
import { useDebounce } from '../use-debounce';

jest.useFakeTimers();

jest.mock('react', () => ({
  useState: jest.fn(),
  useEffect: jest.fn((fn, deps) => fn()),
}));

describe('useDebounce', () => {
  it('..', () => {
    const debouncedValue = null;
    const setDebouncedValue = jest.fn();

    useState.mockReturnValue([debouncedValue, setDebouncedValue]);
    useDebounce('foo', 1000);
    jest.runAllTimers();
    expect(setDebouncedValue).toHaveBeenCalledWith('foo');
  });
});
