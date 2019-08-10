import { graphql } from '@graphql';

export const getPostById = id => {
	return postsState => {
		let currentPost = null;
		let isExist = postsState.some(item => {
			// console.log (item);
			currentPost = item;
			return item._id === id;
		});
		if (isExist) {
			return currentPost;
		}

		return {};
	};
};

const savePost = data => ({ type: 'SAVE_POST_BY_ID', data });

//喜欢当前帖子
export const like = (postid, currentPost) => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `
			like($postid:String!){
				like(postid:$postid){
					success
					msg
				}
			}`;
			const [err, res] = await graphql({ type: 'mutation', args, variables: { postid } });
			if (err) return reject(err);

			dispatch({ type: 'LIKE_POST_BY_ID', data: currentPost });
			resolve(res.like);
		});
};

export const savePostById = id => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			//请求postbyid
			const args = `
			getPostById($id:String!){
        getPostById(id:$id){
          _id
          title
          content
					createDate
					like
					like_count
          user{
            _id
            username
            avatar
          }
        }
      }`;

			const [err, res] = await graphql({ args, variables: { id } });
			if (err) return reject(err);
			if (res.getPostById._id == '') return reject('没有此帖子');
			dispatch(savePost(res.getPostById));
			return resolve();
		});
};
