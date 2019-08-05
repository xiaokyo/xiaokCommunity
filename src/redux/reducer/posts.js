export default (state = [], action) => {
	switch (action.type) {
		case 'SAVE_POST_BY_ID':
			return [...state, action.data];
		case 'LIKE_POST_BY_ID':
			let _state = state;
			let _index = 0;
			let currentpost = action.data;
			_state.some((item, index) => {
				_index = index;
				return item._id === currentpost._id;
			});
			let currentLike = _state[_index]['like'];
			_state[_index]['like'] = !currentLike;
			_state[_index]['like'] ? _state[_index]['like_count']++ : _state[_index]['like_count']--;
			// console.log(_state[_index]['like']);
			return [..._state];
		default:
			return state;
	}
};
