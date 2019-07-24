export default (state = {data: []}, action) => {
  switch (action.type) {
    case 'SAVE_POSTLIST':
      return {...state, ...action.data};
    case 'LOAD_MORE_POSTLIST':
      return {data: [...state.data, ...action.data.data]};
    default:
      return state;
  }
};
