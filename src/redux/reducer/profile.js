export default (state = {}, action) => {
	switch (action.type) {
		case 'SAVE_PROFILE_BY_USER_ID':
			return { ...action.data };
		case 'LOAD_MORE_PROFILE':
			let _posts = [...state['posts'], ...action.data];
			return { ...state, posts: _posts };
		default:
			return state;
	}
};
