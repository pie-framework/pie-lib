import get from 'lodash/get';
import shuffle from 'lodash/shuffle';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
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

const decideSessionChanged = session =>
  !isEmpty(get(session, 'answers', get(session, 'value', [])));

export const decideLockChoiceOrder = (model, session, env, customDecideSession) => {
  const decideSessionFn = isFunction(customDecideSession)
    ? customDecideSession
    : decideSessionChanged;
  const hasSession = decideSessionFn(session);
  // don't override if model lockChoiceOrder is true, otherwise take the value from the env
  const lockChoiceOrder = get(model, 'lockChoiceOrder') || get(env, 'lockChoiceOrder');

  log('hasSession: ', hasSession);
  log('model.lockChoiceOrder value: ', model.lockChoiceOrder);
  log('env.lockChoiceOrder value: ', env.lockChoiceOrder);

  if (lockChoiceOrder) {
    return true;
  }

  const role = get(env, 'role', 'student');

  log('role: ', role);

  if (role === 'instructor') {
    // if there's a session, display the session order, otherwise the ordinal
    return !!hasSession;
  }

  if (role === 'student') {
    // if there's no session, we shuffle every time for the student
    if (!hasSession) {
      if (session) {
        delete session.shuffledValues;
      }
    }

    // otherwise we keep the session order (first shuffled option)
    return false;
  }

  return true;
};

const hasShuffledValues = s => !!(s || {}).shuffledValues;

export const lockChoices = (model, session, env, isShuffled = hasShuffledValues) => {
  if (model.lockChoiceOrder) {
    return true;
  }
  if (get(env, ['@pie-element', 'lockChoiceOrder'], false)) {
    return true;
  }

  const role = get(env, 'role', 'student');

  if (role === 'instructor') {
    const alreadyShuffled = isShuffled(session);
    if (!alreadyShuffled) {
      return true;
    }

    // TODO: .. in the future the instructor can toggle between ordinal and shuffled here
    return false;
  }

  // here it's a student, so don't lock and it will shuffle if needs be
  return false;
};
