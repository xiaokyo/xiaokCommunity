import { savePostById } from '@redux/actions/posts';
import doPromise from '@common/doPromise';

export default () => {
	return async (dispatch, match) => {
		const [err, res] = await doPromise(savePostById(match.params.id)(dispatch));
		if (err) return console.log(err);
	};
};
