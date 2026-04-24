import marks from '../marks';

describe('marks reducer', () => {
  describe('initial state', () => {
    it('returns empty array as initial state', () => {
      const state = marks(undefined, { type: 'INIT' });
      expect(state).toEqual([]);
    });

    it('handles no state parameter', () => {
      const state = marks(undefined, { type: 'UNKNOWN_ACTION' });
      expect(Array.isArray(state)).toBe(true);
    });
  });

  describe('CHANGE_MARKS action', () => {
    it('updates state with new marks', () => {
      const initialState = [];
      const newMarks = [{ id: 1, type: 'point' }];
      const action = { type: 'CHANGE_MARKS', marks: newMarks };

      const state = marks(initialState, action);
      expect(state).toEqual(newMarks);
    });

    it('replaces existing marks', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const newMarks = [{ id: 2, type: 'line' }];
      const action = { type: 'CHANGE_MARKS', marks: newMarks };

      const state = marks(initialState, action);
      expect(state).toEqual(newMarks);
      expect(state.length).toBe(1);
      expect(state[0].id).toBe(2);
    });

    it('handles empty marks array', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const action = { type: 'CHANGE_MARKS', marks: [] };

      const state = marks(initialState, action);
      expect(state).toEqual([]);
    });

    it('handles multiple marks', () => {
      const initialState = [];
      const newMarks = [
        { id: 1, type: 'point', x: 1, y: 2 },
        { id: 2, type: 'line', from: { x: 0, y: 0 }, to: { x: 5, y: 5 } },
        { id: 3, type: 'circle', center: { x: 3, y: 3 }, radius: 2 },
      ];
      const action = { type: 'CHANGE_MARKS', marks: newMarks };

      const state = marks(initialState, action);
      expect(state).toEqual(newMarks);
      expect(state.length).toBe(3);
    });

    it('throws error when marks is not an array', () => {
      const initialState = [];
      const action = { type: 'CHANGE_MARKS', marks: 'not an array' };

      expect(() => marks(initialState, action)).toThrow('marks must be an array');
    });

    it('throws error when marks is null', () => {
      const initialState = [];
      const action = { type: 'CHANGE_MARKS', marks: null };

      expect(() => marks(initialState, action)).toThrow('marks must be an array');
    });

    it('throws error when marks is undefined', () => {
      const initialState = [];
      const action = { type: 'CHANGE_MARKS', marks: undefined };

      expect(() => marks(initialState, action)).toThrow('marks must be an array');
    });

    it('throws error when marks is an object', () => {
      const initialState = [];
      const action = { type: 'CHANGE_MARKS', marks: { id: 1 } };

      expect(() => marks(initialState, action)).toThrow('marks must be an array');
    });

    it('throws error when marks is a number', () => {
      const initialState = [];
      const action = { type: 'CHANGE_MARKS', marks: 123 };

      expect(() => marks(initialState, action)).toThrow('marks must be an array');
    });

    it('preserves mark properties', () => {
      const initialState = [];
      const newMarks = [
        {
          id: 1,
          type: 'point',
          x: 10,
          y: 20,
          label: 'A',
          correctness: { value: 'correct' },
          editable: true,
          interactive: true,
        },
      ];
      const action = { type: 'CHANGE_MARKS', marks: newMarks };

      const state = marks(initialState, action);
      expect(state[0]).toEqual(newMarks[0]);
      expect(state[0].correctness).toBeDefined();
      expect(state[0].editable).toBe(true);
    });
  });

  describe('unknown actions', () => {
    it('returns current state for unknown action', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const action = { type: 'UNKNOWN_ACTION' };

      const state = marks(initialState, action);
      expect(state).toBe(initialState);
    });

    it('returns current state for ADD_MARK action', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const action = { type: 'ADD_MARK' };

      const state = marks(initialState, action);
      expect(state).toBe(initialState);
    });

    it('does not modify state for unknown actions', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const action = { type: 'SOME_OTHER_ACTION', data: 'test' };

      const state = marks(initialState, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('immutability', () => {
    it('does not mutate original state', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const originalState = [...initialState];
      const newMarks = [{ id: 2, type: 'line' }];
      const action = { type: 'CHANGE_MARKS', marks: newMarks };

      marks(initialState, action);
      expect(initialState).toEqual(originalState);
    });

    it('returns new array reference for CHANGE_MARKS', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const newMarks = [{ id: 1, type: 'point' }];
      const action = { type: 'CHANGE_MARKS', marks: newMarks };

      const state = marks(initialState, action);
      expect(state).not.toBe(initialState);
      expect(state).toBe(newMarks);
    });

    it('returns same reference for unknown actions', () => {
      const initialState = [{ id: 1, type: 'point' }];
      const action = { type: 'UNKNOWN_ACTION' };

      const state = marks(initialState, action);
      expect(state).toBe(initialState);
    });
  });
});
