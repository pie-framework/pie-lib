const marks = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_MARKS':
      if (Array.isArray(action.marks)) {
        return action.marks;
      } else {
        throw new Error('marks must be an array');
      }
    default:
      return state;
  }
};

export default marks;
