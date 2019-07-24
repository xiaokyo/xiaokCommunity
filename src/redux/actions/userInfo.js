import axios from 'axios';

export const saveUser = data => ({
  type: 'SAVE_USER',
  data,
});

export const removeUser = () => ({type: 'REMOVE_USER'});

export const fetchUserData = accessToken => {
  return dispatch =>
    new Promise (resolve => {
      axios ('/profile').then (res => {
        dispatch (saveUser (res.data));
        resolve (true);
      });
    });
};

//{userid,username,accessToken}
export const login = (username, password) => {
  return dispatch =>
    new Promise ((resolve, reject) => {
      axios ({
        method: 'post',
        url: '/login',
        data: {
          username,
          password,
        },
      })
        .then (function (res) {
          dispatch (saveUser (res.data));
          localStorage.setItem ('accessToken', res.data.accessToken);
          resolve (true);
        })
        .catch (function (error) {
          reject (error);
        });
    });
};
