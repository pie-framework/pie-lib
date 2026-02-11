import { addMark, changeMarks } from '../actions';

describe('container actions', () => {
  describe('addMark', () => {
    it('creates ADD_MARK action', () => {
      const action = addMark();
      expect(action).toEqual({
        type: 'ADD_MARK',
      });
    });

    it('creates action without parameters', () => {
      const action = addMark();
      expect(action.type).toBe('ADD_MARK');
      expect(Object.keys(action)).toEqual(['type']);
    });
  });

  describe('changeMarks', () => {
    it('creates CHANGE_MARKS action with marks', () => {
      const marks = [{ id: 1, type: 'point' }];
      const action = changeMarks(marks);

      expect(action).toEqual({
        type: 'CHANGE_MARKS',
        marks,
      });
    });

    it('creates action with empty marks array', () => {
      const marks = [];
      const action = changeMarks(marks);

      expect(action).toEqual({
        type: 'CHANGE_MARKS',
        marks: [],
      });
    });

    it('creates action with multiple marks', () => {
      const marks = [
        { id: 1, type: 'point', x: 1, y: 2 },
        { id: 2, type: 'line', from: { x: 0, y: 0 }, to: { x: 5, y: 5 } },
      ];
      const action = changeMarks(marks);

      expect(action.marks).toEqual(marks);
      expect(action.marks.length).toBe(2);
    });

    it('creates action with null marks', () => {
      const marks = null;
      const action = changeMarks(marks);

      expect(action).toEqual({
        type: 'CHANGE_MARKS',
        marks: null,
      });
    });

    it('creates action with undefined marks', () => {
      const marks = undefined;
      const action = changeMarks(marks);

      expect(action).toEqual({
        type: 'CHANGE_MARKS',
        marks: undefined,
      });
    });

    it('preserves mark properties', () => {
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
      const action = changeMarks(marks);

      expect(action.marks[0]).toEqual(marks[0]);
      expect(action.marks[0].correctness).toBeDefined();
    });
  });

  describe('action types', () => {
    it('has consistent action type strings', () => {
      const addMarkAction = addMark();
      const changeMarksAction = changeMarks([]);

      expect(typeof addMarkAction.type).toBe('string');
      expect(typeof changeMarksAction.type).toBe('string');
    });

    it('has unique action types', () => {
      const addMarkAction = addMark();
      const changeMarksAction = changeMarks([]);

      expect(addMarkAction.type).not.toBe(changeMarksAction.type);
    });
  });
});
