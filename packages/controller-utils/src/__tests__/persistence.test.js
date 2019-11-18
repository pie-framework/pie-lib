import { getShuffledChoices } from '../persistence';

describe('persistence', () => {
  let choices, session, updateSession, key;

  beforeEach(() => {
    updateSession = jest.fn().mockResolvedValue([]);
    session = {
      id: '1',
      element: 'element'
    };
    choices = [
      {
        value: 1
      },
      {
        value: 2
      }
    ];
    key = 'value';
  });

  describe('0 key', () => {
    it('calls update session w/ 0 as a key', async () => {
      const result = await getShuffledChoices(
        [{ value: 0 }, { value: 1 }],
        session,
        updateSession,
        'value'
      );
      expect(updateSession).toHaveBeenCalledWith(session.id, session.element, {
        shuffledValues: expect.arrayContaining([0, 1])
      });
    });
  });

  describe('handles null values in session', () => {
    beforeEach(async () => {
      const result = await getShuffledChoices(
        choices,
        { ...session, shuffledValues: [null] },
        updateSession,
        'value'
      );
    });

    it('calls updateSession w/ new shuffle cos [null] is treated as empty', () => {
      expect(updateSession).toHaveBeenCalledWith(session.id, session.element, {
        shuffledValues: expect.arrayContaining([1, 2])
      });
    });
  });
  describe('bad shuffle generation does not call updateSession', () => {
    beforeEach(async () => {
      const result = await getShuffledChoices(choices, {}, updateSession, 'foo');
    });
    it('does not call update session', () => {
      expect(updateSession).not.toHaveBeenCalled();
    });
  });

  describe('session does not exist', () => {
    it('returns undefined for empty session', async () => {
      const result = await getShuffledChoices(choices, undefined, updateSession, key);
      expect(result).toEqual(undefined);
    });
  });

  describe('session exists', () => {
    it('returns compact choices if session has shuffledValues', async () => {
      session = { shuffledValues: [2, 1] };
      const result = await getShuffledChoices(choices, session, updateSession, key);
      expect(result).toEqual(expect.arrayContaining(choices));
    });

    it('returns shuffled choices if updateSession is a function', async () => {
      session = {};
      updateSession = jest.fn().mockResolvedValue();
      const result = await getShuffledChoices(choices, session, updateSession, key);
      expect(result).toEqual(expect.arrayContaining(choices));
    });

    it('calls updateSession as expected if updateSession is a function', async () => {
      session = { id: '1', element: 'pie-element' };
      await getShuffledChoices(choices, session, updateSession, key);
      expect(updateSession).toHaveBeenCalledWith('1', 'pie-element', {
        shuffledValues: expect.arrayContaining([1, 2])
      });
    });
  });
});
