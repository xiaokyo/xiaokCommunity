export default (state = {}, action) => {
	switch (action.type) {
		case 'SAVE_PROFILE_BY_USER_ID':
			return { ...action.data };
		default:
			return state;
	}
};
