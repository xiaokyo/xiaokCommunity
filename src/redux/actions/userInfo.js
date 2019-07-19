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
      }, 2000);
    });
};
