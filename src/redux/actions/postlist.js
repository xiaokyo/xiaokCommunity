import { graphql } from '@graphql';

const savePostList = data => ({ type: 'SAVE_POSTLIST', data });
const loadMorePostList = data => ({ type: 'LOAD_MORE_POSTLIST', data });

const field = `
  _id
  title
  description
  like_count
  comment_count
  createDate
  user{
    _id
    username
  }
`;

export const load_postlist = () => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
        getPosts(limit:10,skip:0){
         ${field}
        }
      }`;

			const [err, res] = await graphql({ args });
			if (err) return reject(err);
			if (res.data.getPosts.length < 0) return reject('没有帖子');
			dispatch(savePostList(res.data.getPosts));
			// console.log(res.data.getPosts);
			resolve(res.data.getPosts);
		});
};

export const load_more_postlist = pageIndex => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			// console.log(pageIndex);
			const args = `{
        getPosts(limit:10,skip:${pageIndex}){
          ${field}
        }
      }`;

			const [err, res] = await graphql({ args });
			if (err) return reject(err);
			if (res.data.getPosts.length <= 0) return reject('没有帖子');
			dispatch(loadMorePostList(res.data.getPosts));
			resolve(res.data.getPosts);
		});
};
