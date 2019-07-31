import { graphql } from '@graphql';

export const saveProfile = data => ({
	type: 'SAVE_PROFILE_BY_USER_ID',
	data,
});

//加载当前userid的主页信息
export const loadProfile = userid => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
        homebyuserid(id:"${userid}"){
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
			if (!res.data.homebyuserid) return reject('用户不存在');
			// console.log (res);
			dispatch(saveProfile(res.data.homebyuserid));
			return resolve();
		});
};
