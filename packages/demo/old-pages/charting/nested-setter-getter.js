export const setValueByArray = (obj, parts, value) => {
  if (!parts) {
    throw 'No parts array passed in';
  }

  if (parts.length === 0) {
    throw 'parts should never have a length of 0';
  }

  if (parts.length === 1) {
    obj[parts[0]] = value;
  } else {
    var next = parts.shift();

    if (!obj[next]) {
      obj[next] = {};
    }
    setValueByArray(obj[next], parts, value);
  }
};

const getValueByArray = (obj, parts, value) => {
  if (!parts) {
    return null;
  }

  if (parts.length === 1) {
    return obj[parts[0]];
  } else {
    var next = parts.shift();

    if (!obj[next]) {
      return null;
    }
    return getValueByArray(obj[next], parts, value);
  }
};

export const set = (obj, path, value) => setValueByArray(obj, path.split('.'), value);

export const get = (obj, path) => getValueByArray(obj, path.split('.'));
