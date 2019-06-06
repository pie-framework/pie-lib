import React from 'react';
import { render } from 'react-dom';
import { Data } from 'slate';
import { defaultIDD, defaultECR, getDefaultElement, insertSnackBar, isNumber } from '../utils';

jest.useFakeTimers();

let mockRender;

jest.mock('react-dom', () => {
  mockRender = jest.fn();

  return {
    render: mockRender
  };
});
describe('utils', () => {
  describe('insertSnackBar', () => {
    let prevSnacks, newElMock, documentMock, document;

    beforeEach(() => {
      prevSnacks = [{ remove: jest.fn() }, { remove: jest.fn() }];

      newElMock = { className: '', remove: jest.fn() };
      documentMock = {
        createElement: jest.fn().mockReturnValue(newElMock),
        querySelectorAll: jest.fn().mockReturnValue(prevSnacks),
        body: {
          appendChild: jest.fn()
        }
      };
      document = jest.spyOn(window, 'document', 'get');
    });

    it('should add SnackBar', () => {
      document.mockReturnValue(documentMock);
      insertSnackBar('Foo bar');

      prevSnacks.forEach(s => expect(s.remove).toBeCalled());

      expect(mockRender).toBeCalledWith(expect.anything(), {
        className: 'response-area-alert',
        remove: expect.anything()
      });
      expect(documentMock.body.appendChild).toBeCalledWith({
        className: 'response-area-alert',
        remove: expect.anything()
      });
      jest.runAllTimers();
      expect(newElMock.remove).toBeCalled();
    });
  });
  describe('getDefaultElement', () => {
    it('should return correct value', () => {
      expect(getDefaultElement({})).toEqual(defaultIDD);
      const dibElNoDup = getDefaultElement({
        type: 'drag-in-the-blank',
        options: { duplicates: false }
      });
      const dibElWithDup = getDefaultElement({
        type: 'drag-in-the-blank',
        options: { duplicates: true }
      });
      expect(dibElNoDup.data.toJSON()).toMatchObject({
        duplicates: false,
        value: null
      });
      expect(dibElWithDup.data.toJSON()).toMatchObject({
        duplicates: true,
        value: null
      });
      expect(getDefaultElement({ type: 'explicit-constructed-response' })).toEqual(defaultECR);
    });
  });
  describe('isNumber', () => {
    it('should return true if number, false otherwise', () => {
      expect(isNumber(NaN)).toEqual(false);
      expect(isNumber(null)).toEqual(false);
      expect(isNumber('0A')).toEqual(false);
      expect(isNumber('A0')).toEqual(false);
      expect(isNumber(0)).toEqual(true);
      expect(isNumber('0')).toEqual(true);
    });
  });
});
