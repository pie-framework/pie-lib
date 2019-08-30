import shuffle from 'lodash/shuffle';
import compact from 'lodash/compact';

const lg = n => console[n].bind(console);
const debug = lg('debug');
const log = lg('log');
const warn = lg('warn');
const error = lg('error');

export const getShuffledChoices = async (choices, session, updateSession, key) => {
  log('updateSession type: ', typeof updateSession);
  log('session: ', session);
  if (!session) {
    warn("unable to save shuffled choices because there's no session.");
  } else if (session.shuffledValues) {
    debug('use shuffledValues to sort the choices...', session.shuffledValues);

    return compact(session.shuffledValues.map(v => choices.find(c => c[key] === v)));
  } else {
    const shuffledChoices = shuffle(choices);

    if (updateSession && typeof updateSession === 'function') {
      try {
        //Note: session.id refers to the id of the element within a session
        const shuffledValues = shuffledChoices.map(c => c[key]);
        log('try to save shuffledValues to session...', shuffledValues);
        console.log('call updateSession... ', session.id, session.element);
        await updateSession(session.id, session.element, { shuffledValues });
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
