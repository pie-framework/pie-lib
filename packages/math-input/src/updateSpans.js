// increase the font of parallel notation
const updateSpans = () => {
  const spans = Array.from(document.querySelectorAll('span[mathquill-command-id]'));
  (spans || []).forEach((span) => {
    if (span && span.innerText === '∥' && span.className !== 'mq-editable-field') {
      span.style.fontSize = '32px';
    }

    if ((span.innerText === '′' || span.innerText === '′′') && !span.hasAttribute('data-prime')) {
      span.setAttribute('data-prime', 'true');
    }
  });
};

export { updateSpans };
