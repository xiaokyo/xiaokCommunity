import { savePostById } from '@redux/actions/posts';
import to from '@common/to';

export default () => {
	return async (dispatch, match) => {
		const [err, res] = await to(savePostById(match.params.id)(dispatch));
		if (err) return console.log(err);
	};
};
