import reducer from '../reducer';
import { changeMarks } from '../actions';

describe('container reducer', () => {
  describe('reducer creation', () => {
    it('creates a reducer function', () => {
      const rootReducer = reducer();
      expect(typeof rootReducer).toBe('function');
    });

    it('returns an object with marks property', () => {
      const rootReducer = reducer();
      const state = rootReducer(undefined, { type: 'INIT' });
      expect(state).toHaveProperty('marks');
    });

    it('wraps marks reducer with undoable', () => {
      const rootReducer = reducer();
      const state = rootReducer(undefined, { type: 'INIT' });

      expect(state.marks).toHaveProperty('past');
      expect(state.marks).toHaveProperty('present');
      expect(state.marks).toHaveProperty('future');
    });
  });

  describe('initial state', () => {
    it('initializes with empty past', () => {
      const rootReducer = reducer();
      const state = rootReducer(undefined, { type: 'INIT' });

      expect(state.marks.past).toEqual([]);
    });

    it('initializes with empty present', () => {
      const rootReducer = reducer();
      const state = rootReducer(undefined, { type: 'INIT' });

      expect(state.marks.present).toEqual([]);
    });

    it('initializes with empty future', () => {
      const rootReducer = reducer();
      const state = rootReducer(undefined, { type: 'INIT' });

      expect(state.marks.future).toEqual([]);
    });
  });

  describe('CHANGE_MARKS action', () => {
    it('updates present with new marks', () => {
      const rootReducer = reducer();
      const newMarks = [{ id: 1, type: 'point', x: 5, y: 10 }];
      const action = changeMarks(newMarks);

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, action);

      expect(state.marks.present).toEqual(newMarks);
    });

    it('adds previous state to past', () => {
      const rootReducer = reducer();
      const firstMarks = [{ id: 1, type: 'point' }];
      const secondMarks = [{ id: 2, type: 'line' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(firstMarks));
      state = rootReducer(state, changeMarks(secondMarks));

      expect(state.marks.past.length).toBeGreaterThan(0);
      expect(state.marks.present).toEqual(secondMarks);
    });

    it('clears future on new action', () => {
      const rootReducer = reducer();
      const firstMarks = [{ id: 1, type: 'point' }];
      const secondMarks = [{ id: 2, type: 'line' }];
      const thirdMarks = [{ id: 3, type: 'circle' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(firstMarks));
      state = rootReducer(state, changeMarks(secondMarks));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      expect(state.marks.future.length).toBeGreaterThan(0);

      state = rootReducer(state, changeMarks(thirdMarks));
      expect(state.marks.future).toEqual([]);
    });

    it('handles empty marks array', () => {
      const rootReducer = reducer();
      const action = changeMarks([]);

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, action);

      expect(state.marks.present).toEqual([]);
    });

    it('handles multiple marks', () => {
      const rootReducer = reducer();
      const marks = [
        { id: 1, type: 'point', x: 1, y: 2 },
        { id: 2, type: 'line', from: { x: 0, y: 0 }, to: { x: 5, y: 5 } },
        { id: 3, type: 'circle', center: { x: 3, y: 3 }, radius: 2 },
      ];
      const action = changeMarks(marks);

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, action);

      expect(state.marks.present).toEqual(marks);
      expect(state.marks.present.length).toBe(3);
    });
  });

  describe('undo functionality', () => {
    it('supports undo action', () => {
      const rootReducer = reducer();
      const firstMarks = [{ id: 1, type: 'point' }];
      const secondMarks = [{ id: 2, type: 'line' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(firstMarks));
      state = rootReducer(state, changeMarks(secondMarks));

      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      expect(state.marks.present).toEqual(firstMarks);
    });

    it('moves present to future on undo', () => {
      const rootReducer = reducer();
      const firstMarks = [{ id: 1, type: 'point' }];
      const secondMarks = [{ id: 2, type: 'line' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(firstMarks));
      state = rootReducer(state, changeMarks(secondMarks));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      expect(state.marks.future.length).toBeGreaterThan(0);
    });

    it('handles multiple undos', () => {
      const rootReducer = reducer();
      const marks1 = [{ id: 1 }];
      const marks2 = [{ id: 2 }];
      const marks3 = [{ id: 3 }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(marks1));
      state = rootReducer(state, changeMarks(marks2));
      state = rootReducer(state, changeMarks(marks3));

      state = rootReducer(state, { type: '@@redux-undo/UNDO' });
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      expect(state.marks.present).toEqual(marks1);
    });

    it('does not undo beyond initial state', () => {
      const rootReducer = reducer();
      const marks = [{ id: 1, type: 'point' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(marks));

      state = rootReducer(state, { type: '@@redux-undo/UNDO' });
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      expect(state.marks.present).toEqual([]);
      expect(state.marks.past).toEqual([]);
    });
  });

  describe('redo functionality', () => {
    it('supports redo action', () => {
      const rootReducer = reducer();
      const firstMarks = [{ id: 1, type: 'point' }];
      const secondMarks = [{ id: 2, type: 'line' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(firstMarks));
      state = rootReducer(state, changeMarks(secondMarks));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      // Redo
      state = rootReducer(state, { type: '@@redux-undo/REDO' });

      expect(state.marks.present).toEqual(secondMarks);
    });

    it('moves future to past on redo', () => {
      const rootReducer = reducer();
      const firstMarks = [{ id: 1, type: 'point' }];
      const secondMarks = [{ id: 2, type: 'line' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(firstMarks));
      state = rootReducer(state, changeMarks(secondMarks));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      const futureBeforeRedo = state.marks.future.length;
      state = rootReducer(state, { type: '@@redux-undo/REDO' });

      expect(state.marks.future.length).toBe(futureBeforeRedo - 1);
    });

    it('handles multiple redos', () => {
      const rootReducer = reducer();
      const marks1 = [{ id: 1 }];
      const marks2 = [{ id: 2 }];
      const marks3 = [{ id: 3 }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(marks1));
      state = rootReducer(state, changeMarks(marks2));
      state = rootReducer(state, changeMarks(marks3));

      // undo twice, then redo twice
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });
      state = rootReducer(state, { type: '@@redux-undo/REDO' });
      state = rootReducer(state, { type: '@@redux-undo/REDO' });

      expect(state.marks.present).toEqual(marks3);
    });

    it('does not redo beyond last state', () => {
      const rootReducer = reducer();
      const marks = [{ id: 1, type: 'point' }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(marks));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });
      state = rootReducer(state, { type: '@@redux-undo/REDO' });

      // try to redo beyond the end
      state = rootReducer(state, { type: '@@redux-undo/REDO' });
      state = rootReducer(state, { type: '@@redux-undo/REDO' });

      expect(state.marks.present).toEqual(marks);
      expect(state.marks.future).toEqual([]);
    });
  });

  describe('state structure', () => {
    it('maintains correct undoable structure', () => {
      const rootReducer = reducer();
      const state = rootReducer(undefined, { type: 'INIT' });

      expect(state.marks).toHaveProperty('past');
      expect(state.marks).toHaveProperty('present');
      expect(state.marks).toHaveProperty('future');
      expect(Array.isArray(state.marks.past)).toBe(true);
      expect(Array.isArray(state.marks.future)).toBe(true);
    });

    it('preserves mark properties through undo/redo', () => {
      const rootReducer = reducer();
      const marks = [
        {
          id: 1,
          type: 'point',
          x: 10,
          y: 20,
          label: 'A',
          correctness: { value: 'correct' },
        },
      ];

      let state = rootReducer(undefined, { type: 'INIT' });
      state = rootReducer(state, changeMarks(marks));
      state = rootReducer(state, changeMarks([]));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      expect(state.marks.present).toEqual(marks);
      expect(state.marks.present[0]).toBeDefined();
      if (state.marks.present[0]) {
        expect(state.marks.present[0]).toEqual(marks[0]);
        expect(state.marks.present[0].correctness).toBeDefined();
      }
    });
  });

  describe('integration', () => {
    it('handles complex undo/redo sequences', () => {
      const rootReducer = reducer();
      const marks1 = [{ id: 1 }];
      const marks2 = [{ id: 2 }];
      const marks3 = [{ id: 3 }];
      const marks4 = [{ id: 4 }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks(marks1));
      state = rootReducer(state, changeMarks(marks2));
      state = rootReducer(state, changeMarks(marks3));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' }); // back to marks2
      state = rootReducer(state, { type: '@@redux-undo/UNDO' }); // back to marks1
      state = rootReducer(state, { type: '@@redux-undo/REDO' }); // forward to marks2
      state = rootReducer(state, changeMarks(marks4));

      expect(state.marks.present).toEqual(marks4);
      expect(state.marks.future).toEqual([]);
    });

    it('works with empty state transitions', () => {
      const rootReducer = reducer();
      const marks = [{ id: 1 }];

      let state = rootReducer(undefined, { type: '@@INIT' });
      state = rootReducer(state, changeMarks([]));
      state = rootReducer(state, changeMarks(marks));
      state = rootReducer(state, changeMarks([]));
      state = rootReducer(state, { type: '@@redux-undo/UNDO' });

      expect(state.marks.present).toEqual(marks);
    });
  });
});
