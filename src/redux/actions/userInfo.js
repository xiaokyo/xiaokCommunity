export const saveUser = data => ({
  type: 'SAVE_USER',
  data,
});

export const fetchUserData = () => {
  return dispatch =>
    new Promise (resolve => {
      setTimeout (() => {
        dispatch (saveUser ({username: 'xiaokyo'}));
        resolve (true);
      }, 1000);
    });
};

export const login = (username, password) => {
  return dispatch =>
    new Promise (resolve => {
      setTimeout (() => {
        localStorage.setItem ('username', username);
        dispatch (saveUser ({username, password}));
        resolve (true);
      }, 1000);
    });
};
