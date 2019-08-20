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

//验证是否是邮箱
var regEmail = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'); //正则表达式
const checkEmail = email => {
	if (!regEmail.test(email)) return false;
	return true;
};

//邮箱验证
const editEmail = data => ({ type: 'EDIT_EMAIL', data });

//发送邮件验证码
export const sendEmailAsync = async email => {
	if (!checkEmail(email)) throw new Error('邮箱格式不正确！');
	const args = `sendEmailCode($email:String!){
      sendEmailCode(email:$email){
        success
        msg
      }
    }`;
	const [err, res] = await graphql({ args, variables: { email } });
	if (err) throw new Error(err.message);
	let { success, msg } = res.sendEmailCode;
	if (!success) throw new Error(msg);
	return msg;
};

//绑定邮箱
export const bindEmailAsync = (email, emailCode) => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `verifyEmail($email:String!,$emailCode:String!){
				verifyEmail(email:$email,emailCode:$emailCode){
					success
					msg
				}
			}`;
			const [err, res] = await graphql({ type: 'mutation', args, variables: { email, emailCode } });
			if (err) return reject(err);
			const { success, msg } = res.verifyEmail;
			if (!success) return reject(msg);
			dispatch(editEmail(email));
			resolve(msg);
		});
};

//清除用户
export const removeUser = () => ({ type: 'REMOVE_USER' });

const userModel = `
		_id
		username
		avatar
		phone
		sex
		email
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
			if (res.verifyToken != null && !res.verifyToken.username) return reject('用户不匹配');

			dispatch(
				saveUser({
					accessToken,
					my: res.verifyToken,
				})
			);
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
export const login = (email, password) => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `login($email:String!,$password:String!){
        login(email:$email,password:$password){
          code
          accessToken
          user{
						${userModel}
          }
        }
      }`;
			const [err, res] = await graphql({ type: 'mutation', args, variables: { email, password } });
			if (err) return reject(err);
			if (res.login.code == 0) return reject('用户不匹配');
			// console.log (res);
			const { accessToken, user } = res.login;

			dispatch(
				saveUser({
					accessToken: accessToken,
					my: user,
				})
			);
			setAuth(accessToken);
			await localStorage.setItem('accessToken', accessToken);
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
			if (!res.logout.success) return reject('用户不匹配');

			dispatch(removeUser());
			clearAuth();
			localStorage.removeItem('accessToken');
			window.location.reload();
			resolve();
		});
};
