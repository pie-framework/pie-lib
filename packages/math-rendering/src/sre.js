import { engineReady, setupEngine } from 'speech-rule-engine/js/common/system';
import debug from 'debug';

const log = debug('pie-lib:math-rendering:sre');

let initializing = null;
let ready = false;

export const isSreReady = () => ready;

export const markSreNotReady = () => {
  ready = false;
};

/**
 * Start speech-rule-engine, once.
 *
 * Deliberately not called at module scope: engineReady() makes SRE load its locale
 * data (base.json + en.json, ~550KB), so calling it on import means every page pays
 * for it whether or not it renders any math.
 *
 * `mathmapsPath` points SRE at locale data the host serves itself - without it SRE
 * fetches them from cdn.jsdelivr.net. The path has to be in place before the first
 * locale load, so it is set here rather than left to MathJax's own engine setup.
 */
export const initSre = ({ mathmapsPath } = {}) => {
  if (initializing) {
    return initializing;
  }

  initializing = setupEngine(mathmapsPath ? { json: mathmapsPath } : {})
    .then(() => engineReady())
    .then(() => {
      ready = true;
    })
    .catch((e) => {
      log('speech-rule-engine failed to initialise: %s', e && e.message);
    });

  return initializing;
};
