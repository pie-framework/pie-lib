import get from 'lodash/get';
import shuffle from 'lodash/shuffle';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

// eslint-disable-next-line no-console
const lg = n => console[n].bind(console, 'controller-utils:');
const debug = lg('debug');
const log = lg('log');
const warn = lg('warn');
const error = lg('error');

export const compact = arr => {
  if (Array.isArray(arr)) {
    return arr.filter(v => !isNull(v) && !isUndefined(v));
  }
  return arr;
};

export const getShuffledChoices = (choices, session, updateSession, choiceKey) =>
  new Promise(resolve => {
    log('updateSession type: ', typeof updateSession);
    log('session: ', session);

    const currentShuffled = compact((session || {}).shuffledValues);

    if (!session) {
      // eslint-disable-next-line quotes
      warn("unable to save shuffled choices because there's no session.");
      resolve(undefined);
    } else if (!isEmpty(currentShuffled)) {
      debug('use shuffledValues to sort the choices...', session.shuffledValues);
      resolve(compact(currentShuffled.map(v => choices.find(c => c[choiceKey] === v))));
    } else {
      const shuffledChoices = shuffle(choices);

      if (updateSession && typeof updateSession === 'function') {
        try {
          //Note: session.id refers to the id of the element within a session
          const shuffledValues = compact(shuffledChoices.map(c => c[choiceKey]));
          log('try to save shuffledValues to session...', shuffledValues);
          log('call updateSession... ', session.id, session.element);
          if (isEmpty(shuffledValues)) {
            error(
              `shuffledValues is an empty array? - refusing to call updateSession: shuffledChoices: ${JSON.stringify(
                shuffledChoices
              )}, key: ${choiceKey}`
            );
          } else {
            updateSession(session.id, session.element, { shuffledValues }).catch(e =>
              // eslint-disable-next-line no-console
              console.error('update session failed for: ', session.id, e)
            );
          }
        } catch (e) {
          warn('unable to save shuffled order for choices');
          error(e);
        }
      } else {
        warn('unable to save shuffled choices, shuffle will happen every time.');
      }
      //save this shuffle to the session for later retrieval
      resolve(shuffledChoices);
    }
  });

const hasShuffledValues = s => !!(s || {}).shuffledValues;

/**
 * If we return:
 * - true - that means that the order of the choices will be ordinal (as is created in the configure item)
 * - false - that means the getShuffledChoices above will be called and that in turn means that we either
 * return the shuffled values on the session (if any exists) or we shuffle the choices
 * @param model - model to check if we should lock order
 * @param session - session to check if we should lock order
 * @param env - env to check if we should lock order
 * @returns {boolean}
 */
export const lockChoices = (model, session, env) => {
  if (model.lockChoiceOrder) {
    return true;
  }

  log('lockChoiceOrder: ', get(env, ['@pie-element', 'lockChoiceOrder'], false));

  if (get(env, ['@pie-element', 'lockChoiceOrder'], false)) {
    return true;
  }

  const role = get(env, 'role', 'student');

  if (role === 'instructor') {
    // TODO: .. in the future the instructor can toggle between ordinal and shuffled here, so keeping this code until then
    /*const alreadyShuffled = hasShuffledValues(session);

    if (alreadyShuffled) {
      return false;
    }

    return true;*/
    return false;
  }

  // here it's a student, so don't lock and it will shuffle if needs be
  return false;
};
