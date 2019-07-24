export default (state = {}, action) => {
  switch (action.type) {
    case 'SAVE_USER':
      return {...state, ...action.data};
    case 'REMOVE_USER':
      return {};
    default:
      return state;
  }
};
