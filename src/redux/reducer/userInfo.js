export default (state = {}, action) => {
  switch (action.type) {
    case 'SAVE_USER':
      return {...state, ...action.data};
    default:
      return state;
  }
};
