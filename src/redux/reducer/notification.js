export default (state = [], action) => {
	switch (action.type) {
		case 'INIT_NOTIFICATION':
			return [...action.data];
		case 'NEW_NOTIFICATION':
			return [action.data, ...state];
		case 'CLEAR_NOTIFICATION':
			let _state = state;
			for (let i = 0; i < _state.length; i++) {
				_state[i]['isread'] = true;
			}
			return [..._state];
		default:
			return state;
	}
};
