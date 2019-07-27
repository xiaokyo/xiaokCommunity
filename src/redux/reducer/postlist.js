export default (state = [], action) => {
  switch (action.type) {
    case 'SAVE_POSTLIST':
      return [...state, ...action.data];
    case 'LOAD_MORE_POSTLIST':
      return [...state, ...action.data];
    default:
      return state;
  }
};
