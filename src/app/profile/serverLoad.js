import { loadProfile } from '@redux/actions/profile';
import doPromise from '@common/doPromise';

export default () => {
	return async (dispatch, match) => {
		const [err, res] = await doPromise(loadProfile(match.params.id)(dispatch));
		if (err) return console.log(err);
	};
};
