export const parseHtmlHasText = input => {
  if (!input) {
    return false;
  }

  const htmlDoc = document.createElement('div');

  htmlDoc.innerHTML = input;

  // jest does not support innerText, so we use textContent for tests
  const text = htmlDoc.innerText ? htmlDoc.innerText : htmlDoc.textContent;

  if (text && text.trim()) {
    return true;
  } else {
    let hasText = false;
    const listItems = htmlDoc.children;
    const listArray = Array.from(listItems);

    listArray.forEach(item => {
      const itemText = item.innerText ? item.innerText : item.textContent;
      if (itemText && itemText.trim()) {
        hasText = true;
      }
    });

    return hasText;
  }
};
