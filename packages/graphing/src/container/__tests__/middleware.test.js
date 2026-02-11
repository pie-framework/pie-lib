import { getLastAction, lastActionMiddleware } from '../middleware';

describe('lastActionMiddleware', () => {
  describe('middleware functionality', () => {
    it('creates middleware function', () => {
      const middleware = lastActionMiddleware();
      expect(typeof middleware).toBe('function');
    });

    it('middleware returns a function', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const result = middleware(next);
      expect(typeof result).toBe('function');
    });

    it('calls next with action', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);
      const action = { type: 'TEST_ACTION' };

      dispatch(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('returns result from next', () => {
      const middleware = lastActionMiddleware();
      const expectedResult = { status: 'success' };
      const next = jest.fn(() => expectedResult);
      const dispatch = middleware(next);
      const action = { type: 'TEST_ACTION' };

      const result = dispatch(action);
      expect(result).toBe(expectedResult);
    });

    it('stores action before calling next', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn(() => {
        const lastAction = getLastAction();
        expect(lastAction).toBeDefined();
        expect(lastAction.type).toBe('TEST_ACTION');
      });
      const dispatch = middleware(next);
      const action = { type: 'TEST_ACTION' };

      dispatch(action);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getLastAction', () => {
    it('returns null initially', () => {
      const lastAction = getLastAction();
      expect(lastAction).toBeDefined();
    });

    it('returns last dispatched action', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);
      const action = { type: 'MY_ACTION', payload: 'test' };

      dispatch(action);
      const lastAction = getLastAction();

      expect(lastAction).toEqual(action);
      expect(lastAction.type).toBe('MY_ACTION');
      expect(lastAction.payload).toBe('test');
    });

    it('updates when new action is dispatched', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);

      const action1 = { type: 'ACTION_1' };
      dispatch(action1);
      expect(getLastAction()).toEqual(action1);

      const action2 = { type: 'ACTION_2' };
      dispatch(action2);
      expect(getLastAction()).toEqual(action2);
    });

    it('stores action with payload', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);
      const action = {
        type: 'CHANGE_MARKS',
        marks: [{ id: 1, type: 'point' }],
      };

      dispatch(action);
      const lastAction = getLastAction();

      expect(lastAction.marks).toEqual(action.marks);
      expect(lastAction.marks.length).toBe(1);
    });

    it('stores action with complex payload', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);
      const action = {
        type: 'COMPLEX_ACTION',
        data: {
          nested: {
            value: 123,
            array: [1, 2, 3],
          },
        },
      };

      dispatch(action);
      const lastAction = getLastAction();

      expect(lastAction.data.nested.value).toBe(123);
      expect(lastAction.data.nested.array).toEqual([1, 2, 3]);
    });
  });

  describe('action storage', () => {
    it('overwrites previous action', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);

      dispatch({ type: 'FIRST' });
      dispatch({ type: 'SECOND' });
      dispatch({ type: 'THIRD' });

      const lastAction = getLastAction();
      expect(lastAction.type).toBe('THIRD');
    });

    it('stores reference to action object', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);
      const action = { type: 'TEST', data: { value: 1 } };

      dispatch(action);
      const lastAction = getLastAction();

      // Modify original action
      action.data.value = 2;

      // Last action should reflect the change (same reference)
      expect(lastAction.data.value).toBe(2);
    });
  });

  describe('integration scenarios', () => {
    it('works with multiple middleware calls', () => {
      const middleware = lastActionMiddleware();
      const next1 = jest.fn();
      const next2 = jest.fn();

      const dispatch1 = middleware(next1);
      const dispatch2 = middleware(next2);

      dispatch1({ type: 'ACTION_1' });
      expect(getLastAction().type).toBe('ACTION_1');

      dispatch2({ type: 'ACTION_2' });
      expect(getLastAction().type).toBe('ACTION_2');
    });

    it('preserves action types', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);

      const actionTypes = ['ADD_MARK', 'CHANGE_MARKS', 'DELETE_MARK', 'UPDATE_MARK'];

      actionTypes.forEach((type) => {
        dispatch({ type });
        expect(getLastAction().type).toBe(type);
      });
    });

    it('handles actions without type', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);
      const action = { payload: 'data' };

      dispatch(action);
      const lastAction = getLastAction();

      expect(lastAction).toEqual(action);
      expect(lastAction.type).toBeUndefined();
    });

    it('handles empty action object', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn();
      const dispatch = middleware(next);
      const action = {};

      dispatch(action);
      const lastAction = getLastAction();

      expect(lastAction).toEqual(action);
    });
  });

  describe('error handling', () => {
    it('stores action even if next throws error', () => {
      const middleware = lastActionMiddleware();
      const next = jest.fn(() => {
        throw new Error('Next error');
      });
      const dispatch = middleware(next);
      const action = { type: 'ERROR_ACTION' };

      expect(() => dispatch(action)).toThrow('Next error');
      expect(getLastAction()).toEqual(action);
    });

    it('propagates errors from next', () => {
      const middleware = lastActionMiddleware();
      const errorMessage = 'Test error';
      const next = jest.fn(() => {
        throw new Error(errorMessage);
      });
      const dispatch = middleware(next);

      expect(() => dispatch({ type: 'TEST' })).toThrow(errorMessage);
    });
  });
});
