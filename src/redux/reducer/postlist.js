export default (state = [], action) => {
  switch (action.type) {
    case 'LOAD_POSTLIST':
      return action.data;
    case 'LOAD_MORE_POSTLIST':
      return [...state, ...action.data];
    default:
      return state;
  }
};
