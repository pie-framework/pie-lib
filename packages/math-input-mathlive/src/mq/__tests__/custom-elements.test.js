import { registerLineBreak } from '../custom-elements';

describe('registerLineBreak', () => {
  it('calls registerEmbed with newLine', () => {
    const registerEmbed = jest.fn();
    registerLineBreak({ registerEmbed });
    expect(registerEmbed).toHaveBeenCalledWith('newLine', expect.any(Function));
  });

  it('does nothing if registerEmbed is not a function', () => {
    expect(() => registerLineBreak({})).not.toThrow();
  });
});
