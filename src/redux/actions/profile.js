import { graphql } from '@graphql';

export const saveProfile = data => ({
	type: 'SAVE_PROFILE_BY_USER_ID',
	data,
});

export const loadMoreProfile = data => ({
	type: 'LOAD_MORE_PROFILE',
	data,
});

// 关注
const actionFollow = () => ({
	type: 'FOLLOW_THIS_AUTHOR',
});

//取消关注
export const actionUnFollow = () => ({
	type: 'UNFOLLOW_THIS_AUTHOR',
});

export const follow = followid => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `
			follow($_id:String!){
				follow(_id:$_id){
					success
					msg
				}
			}`;

			const [err, res] = await graphql({ type: 'mutation', args, variables: { _id: followid } });
			if (err) return reject(err);
			const { success, msg } = res.follow;
			if (!success) return reject(msg);
			dispatch(actionFollow());
			resolve(msg);
		});
};

export const unFollow = followid => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `unFollow($_id:String!){
			unFollow(_id:$_id){
				success
				msg
			}
		}`;

			const [err, res] = await graphql({ type: 'mutation', args, variables: { _id: followid } });
			if (err) return reject(err);
			if (res.unFollow == null) return reject(err);
			const { success, msg } = res.unFollow;
			if (!success) return reject(msg);
			dispatch(actionUnFollow());
			resolve(msg);
		});
};

//加载当前userid的主页信息
export const loadProfile = (userid, limit = 10, skip = 0) => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `homebyuserid($id:String,$limit:Int,$skip:Int){
        homebyuserid(id:$id,limit:$limit,skip:$skip){
          user{
						_id
            username
            avatar
            fan
            follow
					}
					isFollow
          posts{
            _id
            title
          }  
        }
      }`;
			const [err, res] = await graphql({ args, variables: { id: userid, limit, skip } });
			if (err) return reject(err);
			if (!res.homebyuserid.user) return reject('用户不存在');
			if (skip > 0) dispatch(loadMoreProfile(res.homebyuserid.posts));
			if (skip <= 0) dispatch(saveProfile(res.homebyuserid));
			return resolve(res.homebyuserid);
		});
};
