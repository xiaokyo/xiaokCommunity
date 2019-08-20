import { loadProfile } from '@redux/actions/profile';
import to from '@common/to';

export default () => {
	return async (dispatch, match) => {
		const [err, res] = await to(loadProfile(match.params.id)(dispatch));
		if (err) return console.log(err);
	};
};
