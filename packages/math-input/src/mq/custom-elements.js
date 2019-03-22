const registerLineBreak = function(MQ) {
  MQ.registerEmbed('newLine', () => {
    return {
      htmlString: `<div class="newLine"></div>`,
      text: () => 'testText',
      latex: () => '\\embed{newLine}[]'
    };
  });
}

export {
  registerLineBreak
};
