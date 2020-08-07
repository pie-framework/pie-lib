import { decideLockChoiceOrder, getShuffledChoices } from '../persistence';

// describe('getShuffledChoices', () => {
//   let choices, session, updateSession, key;
//
//   beforeEach(() => {
//     updateSession = jest.fn().mockResolvedValue([]);
//     session = {
//       id: '1',
//       element: 'element'
//     };
//     choices = [
//       {
//         value: 1
//       },
//       {
//         value: 2
//       }
//     ];
//     key = 'value';
//   });
//
//   describe('0 key', () => {
//     it('calls update session w/ 0 as a key', async () => {
//       const result = await getShuffledChoices(
//         [{ value: 0 }, { value: 1 }],
//         session,
//         updateSession,
//         'value'
//       );
//       expect(updateSession).toHaveBeenCalledWith(session.id, session.element, {
//         shuffledValues: expect.arrayContaining([0, 1])
//       });
//     });
//   });
//
//   describe('handles null values in session', () => {
//     beforeEach(async () => {
//       const result = await getShuffledChoices(
//         choices,
//         { ...session, shuffledValues: [null] },
//         updateSession,
//         'value'
//       );
//     });
//
//     it('calls updateSession w/ new shuffle cos [null] is treated as empty', () => {
//       expect(updateSession).toHaveBeenCalledWith(session.id, session.element, {
//         shuffledValues: expect.arrayContaining([1, 2])
//       });
//     });
//   });
//   describe('bad shuffle generation does not call updateSession', () => {
//     beforeEach(async () => {
//       const result = await getShuffledChoices(choices, {}, updateSession, 'foo');
//     });
//     it('does not call update session', () => {
//       expect(updateSession).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('session does not exist', () => {
//     it('returns undefined for empty session', async () => {
//       const result = await getShuffledChoices(choices, undefined, updateSession, key);
//       expect(result).toEqual(undefined);
//     });
//   });
//
//   describe('session exists', () => {
//     it('returns compact choices if session has shuffledValues', async () => {
//       session = { shuffledValues: [2, 1] };
//       const result = await getShuffledChoices(choices, session, updateSession, key);
//       expect(result).toEqual(expect.arrayContaining(choices));
//     });
//
//     it('returns shuffled choices if updateSession is a function', async () => {
//       session = {};
//       updateSession = jest.fn().mockResolvedValue();
//       const result = await getShuffledChoices(choices, session, updateSession, key);
//       expect(result).toEqual(expect.arrayContaining(choices));
//     });
//
//     it('calls updateSession as expected if updateSession is a function', async () => {
//       session = { id: '1', element: 'pie-element' };
//       await getShuffledChoices(choices, session, updateSession, key);
//       expect(updateSession).toHaveBeenCalledWith('1', 'pie-element', {
//         shuffledValues: expect.arrayContaining([1, 2])
//       });
//     });
//   });
// });

describe('decideLockChoiceOrder', () => {
  let result;

  describe('model has lockChoiceOrder true', () => {
    it('should return true if env has lockChoiceOrder as false', () => {
      result = decideLockChoiceOrder(
        {
          lockChoiceOrder: true
        },
        {
          answers: ['foo', 'bar']
        },
        {
          lockChoiceOrder: false
        }
      );
      expect(result).toEqual(true);
    });
  });

  describe('model has lockChoiceOrder false or undefined', () => {
    it('should return true if model has lockChoiceOrder false and, env has lockChoiceOrder as true', () => {
      result = decideLockChoiceOrder(
        {
          lockChoiceOrder: false
        },
        {
          answers: ['foo', 'bar']
        },
        {
          lockChoiceOrder: true
        }
      );
      expect(result).toEqual(true);
    });

    it('should return true if model has lockChoiceOrder false and, env has lockChoiceOrder as true', () => {
      result = decideLockChoiceOrder(
        {
          lockChoiceOrder: undefined
        },
        {
          answers: ['foo', 'bar']
        },
        {
          lockChoiceOrder: true
        }
      );
      expect(result).toEqual(true);
    });
  });

  describe('role is student', () => {
    it('should return false for when there is no session', () => {
      result = decideLockChoiceOrder(
        {
          lockChoiceOrder: false
        },
        {
          answers: undefined
        },
        {
          lockChoiceOrder: false
        }
      );
      expect(result).toEqual(false);
    });

    it('should return false and delete the shuffledValues when no answer is present', () => {
      const session = {
        shuffledValues: ['bar', 'foo']
      };

      result = decideLockChoiceOrder(
        {
          lockChoiceOrder: false
        },
        session,
        {
          lockChoiceOrder: false
        }
      );
      expect(result).toEqual(false);
      expect(session.shuffledValues).toEqual(undefined);
    });
  });

  describe('role is instructor', () => {
    it('should return true for when there is a session', () => {
      result = decideLockChoiceOrder(
        {
          lockChoiceOrder: false
        },
        {
          answers: ['foo', 'bar']
        },
        {
          lockChoiceOrder: false,
          role: 'instructor'
        }
      );
      expect(result).toEqual(true);
    });

    it('should return false for when there is no session', () => {
      result = decideLockChoiceOrder(
        {
          lockChoiceOrder: false
        },
        {
          answers: undefined
        },
        {
          lockChoiceOrder: false,
          role: 'instructor'
        }
      );
      expect(result).toEqual(false);
    });
  });
});
