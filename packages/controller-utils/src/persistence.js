import shuffle from 'lodash/shuffle';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';

// eslint-disable-next-line no-console
const lg = n => console[n].bind(console, 'controller-utils:');
const debug = lg('debug');
const log = lg('log');
const warn = lg('warn');
const error = lg('error');

export const getShuffledChoices = async (choices, session, updateSession, key) => {
  log('updateSession type: ', typeof updateSession);
  log('session: ', session);

  const currentShuffled = compact((session || {}).shuffledValues);

  if (!session) {
    // eslint-disable-next-line quotes
    warn("unable to save shuffled choices because there's no session.");
  } else if (!isEmpty(currentShuffled)) {
    debug('use shuffledValues to sort the choices...', session.shuffledValues);
    return compact(currentShuffled.map(v => choices.find(c => c[key] === v)));
  } else {
    const shuffledChoices = shuffle(choices);

    if (updateSession && typeof updateSession === 'function') {
      try {
        //Note: session.id refers to the id of the element within a session
        const shuffledValues = compact(shuffledChoices.map(c => c[key]));
        log('try to save shuffledValues to session...', shuffledValues);
        log('call updateSession... ', session.id, session.element);
        if (isEmpty(shuffledValues)) {
          error(
            `shuffledValues is an empty array? - refusing to call updateSession: shuffledChoices: ${JSON.stringify(
              shuffledChoices
            )}, key: ${key}`
          );
        } else {
          await updateSession(session.id, session.element, { shuffledValues });
        }
      } catch (e) {
        warn('unable to save shuffled order for choices');
        error(e);
      }
    } else {
      warn('unable to save shuffled choices, shuffle will happen every time.');
    }
    //save this shuffle to the session for later retrieval
    return shuffledChoices;
  }
};
