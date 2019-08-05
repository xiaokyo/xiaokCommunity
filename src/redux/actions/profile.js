import { graphql } from '@graphql';

export const saveProfile = data => ({
	type: 'SAVE_PROFILE_BY_USER_ID',
	data,
});

export const loadMoreProfile = data => ({
	type: 'LOAD_MORE_PROFILE',
	data,
});

//加载当前userid的主页信息
export const loadProfile = (userid, limit = 10, skip = 0) => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
        homebyuserid(id:"${userid}",limit:${limit},skip:${skip}){
          user{
            username
            avatar
            fan
            follow
          }
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
