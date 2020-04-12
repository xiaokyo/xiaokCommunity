export default (state = [], action) => {
	switch (action.type) {
		case 'SAVE_CREDITCARD':
			const list = action.data
			return [...list];
		default:
			return state;
	}
};
