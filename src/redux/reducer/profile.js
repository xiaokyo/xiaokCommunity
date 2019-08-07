export default (state = {}, action) => {
	switch (action.type) {
		case 'SAVE_PROFILE_BY_USER_ID':
			return { ...action.data };
		case 'LOAD_MORE_PROFILE':
			let _posts = [...state['posts'], ...action.data];
			return { ...state, posts: _posts };
		case 'FOLLOW_THIS_AUTHOR':
			let _user = { ...state['user'], fan: state['user']['fan'] + 1 };
			return { ...state, user: _user, isFollow: true };
		case 'UNFOLLOW_THIS_AUTHOR':
			_user = { ...state['user'], fan: state['user']['fan'] - 1 };
			return { ...state, user: _user, isFollow: false };
		default:
			return state;
	}
};
