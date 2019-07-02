import cloneDeep from 'lodash/cloneDeep';

export default (arr, fromIndex, toIndex) => {
  if (!arr || arr.length <= 1 || fromIndex === undefined || toIndex === undefined) {
    throw new Error(
      `swap requires a non-empty array, fromIndex, toIndex: ${arr}, ${fromIndex} ${toIndex}`
    );
  }
  const update = cloneDeep(arr);
  const tmp = arr[toIndex];
  update[toIndex] = update[fromIndex];
  update[fromIndex] = tmp;
  return update;
};
