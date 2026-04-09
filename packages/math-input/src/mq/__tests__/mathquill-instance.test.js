const mockRegisterEmbed = jest.fn();
const mockStaticMath = jest.fn().mockReturnValue({ mockInstance: true });

jest.mock('@pie-framework/mathquill', () => ({
  __esModule: true,
  default: {
    getInterface: jest.fn(() => ({
      registerEmbed: mockRegisterEmbed,
      StaticMath: mockStaticMath,
    })),
  },
}));

jest.mock('../custom-elements', () => ({
  registerLineBreak: jest.fn(),
}));

describe('mathquill-instance', () => {
  let registerEmbed;
  let applyStaticMath;

  beforeEach(() => {
    jest.resetModules();
    mockRegisterEmbed.mockClear();
    mockStaticMath.mockClear();
    ({ registerEmbed, applyStaticMath } = require('../mathquill-instance'));
  });

  describe('registerEmbed', () => {
    it('delegates to MQ.registerEmbed when available', () => {
      const factory = () => ({});
      registerEmbed('answerBlock', factory);

      expect(mockRegisterEmbed).toHaveBeenCalledTimes(1);
      expect(mockRegisterEmbed).toHaveBeenCalledWith('answerBlock', factory);
    });
  });

  describe('applyStaticMath', () => {
    it('returns undefined when element is missing', () => {
      expect(applyStaticMath(null, 'x')).toBeUndefined();
      expect(mockStaticMath).not.toHaveBeenCalled();
    });

    it('sets textContent when latex is provided and calls StaticMath', () => {
      const el = document.createElement('span');
      const handlers = { edit: jest.fn() };

      const result = applyStaticMath(el, '\\frac{1}{2}', { handlers });

      expect(el.textContent).toBe('\\frac{1}{2}');
      expect(mockStaticMath).toHaveBeenCalledTimes(1);
      expect(mockStaticMath).toHaveBeenCalledWith(el, { handlers });
      expect(result).toEqual({ mockInstance: true });
    });

    it('omits textContent when latex is undefined but still calls StaticMath', () => {
      const el = document.createElement('span');
      el.textContent = 'preset';

      applyStaticMath(el, undefined);

      expect(el.textContent).toBe('preset');
      expect(mockStaticMath).toHaveBeenCalledWith(el, undefined);
    });
  });
});
