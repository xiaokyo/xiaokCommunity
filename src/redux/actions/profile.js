import { graphql } from '@graphql';
import { message } from 'antd';

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
			const args = `{
			follow(_id:"${followid}"){
				success
				msg
			}
		}`;

			const [err, res] = await graphql({ type: 'mutation', args });
			if (err) return reject(err);
			const { success, msg } = res.data.follow;
			if (!success) return reject(msg);
			dispatch(actionFollow());
			resolve(msg);
		});
};

export const unFollow = followid => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
			unFollow(_id:"${followid}"){
				success
				msg
			}
		}`;

			const [err, res] = await graphql({ type: 'mutation', args });
			if (err) return reject(err);
			if (res.data.unFollow == null) return reject(err);
			const { success, msg } = res.data.unFollow;
			if (!success) return reject(msg);
			dispatch(actionUnFollow());
			resolve(msg);
		});
};

//加载当前userid的主页信息
export const loadProfile = (userid, limit = 10, skip = 0) => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
        homebyuserid(id:"${userid}",limit:${limit},skip:${skip}){
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
			const [err, res] = await graphql({ args });
			if (err) return reject(err);
			if (!res.data.homebyuserid.user) return reject('用户不存在');
			if (skip > 0) dispatch(loadMoreProfile(res.data.homebyuserid.posts));
			if (skip <= 0) dispatch(saveProfile(res.data.homebyuserid));
			return resolve(res.data.homebyuserid);
		});
};
