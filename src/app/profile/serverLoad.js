import { loadProfile } from '@redux/actions/profile';

export default () => {
	return async (dispatch, match) => {
		await loadProfile(match.params.id)(dispatch);
	};
};
