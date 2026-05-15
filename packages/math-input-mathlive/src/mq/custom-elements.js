/**
 * Registers a newLine embed handler for MathLive.
 * In MathQuill, \embed{newLine}[] was a custom embed; in MathLive we use \\.
 */
export function registerLineBreak({ registerEmbed }) {
  if (typeof registerEmbed !== 'function') return;
  registerEmbed('newLine', () => ({
    toLatex: () => '\\\\',
    serialize: () => '\\embed{newLine}[]',
  }));
}
