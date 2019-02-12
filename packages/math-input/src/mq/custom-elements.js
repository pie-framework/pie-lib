const registerAnswerBlock = function(MQ) {
  MQ.registerEmbed('answerBlock', id => {
    return {
      htmlString: `<span style="min-height: 20px" id=${id}></span>`,
      text: () => "testText",
      latex: () => "\\embed{answerBlock}[" + id + "]"
    };
  });
}

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
  registerAnswerBlock,
  registerLineBreak
};
