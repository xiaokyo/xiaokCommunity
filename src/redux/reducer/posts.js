export default (state = [], action) => {
  switch (action.type) {
    case 'SAVE_POST_BY_ID':
      return [...state, action.data];
    default:
      return state;
  }
};
