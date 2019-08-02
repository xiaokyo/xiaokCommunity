export default (state = {}, action) => {
	switch (action.type) {
		case 'SAVE_USER':
			return { ...state, ...action.data };
		case 'SAVE_MY':
			return { ...state, my: { ...state.my, ...action.data } };
		case 'REMOVE_USER':
			return {};
		default:
			return state;
	}
};
