import { graphql } from '@graphql';

const savePostList = data => ({ type: 'SAVE_POSTLIST', data });
const loadMorePostList = data => ({ type: 'LOAD_MORE_POSTLIST', data });

const args = `
getPosts($limit:Int,$skip:Int){
	getPosts(limit:$limit,skip:$skip){
		_id
		title
		description
		content
		like_count
		comment_count
		createDate
		user{
			_id
			username
		}
	}
}
`;

export const load_postlist = () => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const [err, res] = await graphql({ args, variables: { limit: 10, skip: 0 } });
			if (err) return reject(err);
			if (res.getPosts.length < 0) return reject('没有帖子');
			dispatch(savePostList(res.getPosts));
			resolve(res.getPosts);
		});
};

export const load_more_postlist = pageIndex => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const [err, res] = await graphql({ args, variables: { limit: 10, skip: pageIndex } });
			if (err) return reject(err);
			if (res.getPosts.length <= 0) return reject('没有帖子');
			dispatch(loadMorePostList(res.getPosts));
			resolve(res.getPosts);
		});
};
