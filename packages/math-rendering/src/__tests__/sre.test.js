const mockSetupEngine = jest.fn(() => Promise.resolve());
const mockEngineReady = jest.fn(() => Promise.resolve());

jest.mock('speech-rule-engine/js/common/system', () => ({
  setupEngine: (...args) => mockSetupEngine(...args),
  engineReady: (...args) => mockEngineReady(...args),
}));

describe('sre', () => {
  let sre;

  beforeEach(() => {
    jest.resetModules();
    mockSetupEngine.mockClear();
    mockEngineReady.mockClear();
    sre = require('../sre');
  });

  it('does not touch the engine until initSre is called', () => {
    expect(mockSetupEngine).not.toHaveBeenCalled();
    expect(mockEngineReady).not.toHaveBeenCalled();
    expect(sre.isSreReady()).toBe(false);
  });

  it('starts the engine once and reports ready', async () => {
    await Promise.all([sre.initSre(), sre.initSre(), sre.initSre()]);

    expect(mockSetupEngine).toHaveBeenCalledTimes(1);
    expect(mockEngineReady).toHaveBeenCalledTimes(1);
    expect(sre.isSreReady()).toBe(true);
  });

  it('points the engine at a self hosted mathmaps path when given one', async () => {
    await sre.initSre({ mathmapsPath: '/assets/sre/mathmaps' });

    expect(mockSetupEngine).toHaveBeenCalledWith({ json: '/assets/sre/mathmaps' });
  });

  it('leaves the mathmaps path to speech-rule-engine when not configured', async () => {
    await sre.initSre();

    expect(mockSetupEngine).toHaveBeenCalledWith({});
  });

  it('stays unready when the engine fails to start', async () => {
    mockSetupEngine.mockImplementationOnce(() => Promise.reject(new Error('no locale data')));

    await sre.initSre();

    expect(sre.isSreReady()).toBe(false);
  });

  it('markSreNotReady turns enrichment back off', async () => {
    await sre.initSre();
    expect(sre.isSreReady()).toBe(true);

    sre.markSreNotReady();

    expect(sre.isSreReady()).toBe(false);
  });
});
