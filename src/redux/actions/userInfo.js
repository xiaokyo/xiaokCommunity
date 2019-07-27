import axios from 'axios';
import {graphql} from '@graphql';

export const saveUser = data => ({
  type: 'SAVE_USER',
  data,
});

export const removeUser = () => ({type: 'REMOVE_USER'});

//token 验证并获取userinfo
export const fetchUserData = accessToken => {
  return dispatch =>
    new Promise (async (resolve, reject) => {

      const args = `{
        verifyToken{
          username
        }
      }`;

      const headers = {
        authorization: `bearer ${accessToken}`,
      };

      const [err, res] = await graphql ({args, headers});
      if (err) return reject (err);
      if (res.data.verifyToken.username == '') return reject ('用户不匹配');

      const userInfo = {
        accessToken,
        username: res.data.verifyToken.username,
      };
      dispatch (saveUser (userInfo));
      resolve ();
    });
};

//{userid,username,accessToken}
export const login = (username, password) => {
  return dispatch =>
    new Promise (async (resolve, reject) => {
      const args = `{
        login(username:"${username}",password:"${password}"){
          code
          accessToken
          user{
            username
            gender
          }
        }
      }`;
      const [err, res] = await graphql ({type: 'mutation', args});
      if (err) return reject (err);
      if (res.data.login.code == 0) return reject ('用户不匹配');
      // console.log (res);

      const userInfo = {
        accessToken: res.data.login.accessToken,
        username: res.data.login.user.username,
      };
      dispatch (saveUser (userInfo));
      await localStorage.setItem ('accessToken', res.data.login.accessToken);
      return resolve ();
    });
};
