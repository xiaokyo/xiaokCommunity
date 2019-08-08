import { graphql } from '@graphql';
import axios from 'axios';

export const saveUser = data => ({
	type: 'SAVE_USER',
	data,
});

export const saveMy = data => ({
	type: 'SAVE_MY',
	data,
});

export const removeUser = () => ({ type: 'REMOVE_USER' });

const userModel = `
		_id
		username
		avatar
		phone
		sex
`;

//token 验证并获取userinfo
export const fetchUserData = accessToken => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
        verifyToken{
          ${userModel}
        }
      }`;

			const [err, res] = await graphql({ args, _accessToken: accessToken });
			if (err) return reject(err);
			if (res.data.verifyToken != null && !res.data.verifyToken.username) return reject('用户不匹配');

			const userInfo = {
				accessToken,
				my: res.data.verifyToken,
			};
			dispatch(saveUser(userInfo));
			resolve();
		});
};

//set token of cookie
const setAuth = accessToken => {
	axios.post('/setAuth', {}, { headers: { accessToken } });
};

const clearAuth = () => {
	axios.post('/clearAuth');
};

//{userid,username,accessToken}
export const login = (username, password) => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
        login(username:"${username}",password:"${password}"){
          code
          accessToken
          user{
						${userModel}
          }
        }
      }`;
			const [err, res] = await graphql({ type: 'mutation', args });
			if (err) return reject(err);
			if (res.data.login.code == 0) return reject('用户不匹配');
			// console.log (res);

			const userInfo = {
				accessToken: res.data.login.accessToken,
				my: res.data.login.user,
			};
			dispatch(saveUser(userInfo));
			setAuth(res.data.login.accessToken);
			await localStorage.setItem('accessToken', res.data.login.accessToken);
			resolve();
		});
};

//logout
export const logout = () => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
			logout{
				success
				msg
			}
		}`;
			const [err, res] = await graphql({ type: 'mutation', args });
			if (err) return reject(err);
			if (!res.data.logout.success) return reject('用户不匹配');

			dispatch(removeUser());
			clearAuth();
			localStorage.removeItem('accessToken');
			window.location.reload();
			resolve();
		});
};
