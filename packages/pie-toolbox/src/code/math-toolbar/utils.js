export const markFractionBaseSuperscripts = () => {
  console.log('Andreea heree');
  document.querySelectorAll('.mq-supsub.mq-sup-only').forEach((supsub) => {
    const prev = supsub.previousElementSibling;

    if (prev && prev.classList.contains('mq-non-leaf') && prev.querySelector('.mq-fraction')) {
      supsub.classList.add('mq-after-fraction-group');
    } else {
      supsub.classList.remove('mq-after-fraction-group');
    }
  });
};
