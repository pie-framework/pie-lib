import { resetValues } from '../chart-setup';

describe('resetValues', () => {
  let data;
  let range;
  let model;
  let onChange;

  beforeEach(() => {
    range = { min: 0, max: 10, step: 1 };
    data = [
      { value: 2 },
      { value: 11 },
      { value: 5.5 },
      { value: 2.0000000001 }, // A float close to an integer
      { value: 2.9999999999 }, // Another float close to an integer
    ];
    model = { someField: 'someValue', data };
    onChange = jest.fn();
  });

  it('should reset values greater than range.max to zero', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[1].value).toBe(0);
  });

  it('should reset values that are not multiples of range.step to zero', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[2].value).toBe(0);
  });

  it('should not reset values that are within range and multiples of range.step', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[0].value).toBe(2);
  });

  it('should not reset floating point values that are close to multiples of range.step', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[3].value).toBe(2.0000000001); // remains unchanged
    expect(data[4].value).toBe(2.9999999999); // remains unchanged
  });

  it('should not call onChange when updateModel is false', () => {
    resetValues(data, false, range, onChange, model);
    expect(onChange).not.toHaveBeenCalled();
  });
});
