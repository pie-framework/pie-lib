export const parseHtmlHasText = input => {
  if (!input) {
    return false;
  }

  const htmlDoc = document.createElement('div');

  htmlDoc.innerHTML = input;

  if (htmlDoc.innerText.trim()) {
    return true;
  } else {
    let hasText = false;
    const listItems = htmlDoc.children;
    const listArray = Array.from(listItems);

    listArray.forEach(item => {
      if (item.innerText.trim()) {
        hasText = true;
      }
    });

    return hasText;
  }
};
