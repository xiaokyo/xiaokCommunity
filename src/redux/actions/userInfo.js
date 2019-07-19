import fetch from 'isomorphic-fetch';

export const storeData = data => ({
  type: 'STORE_DATA',
  data,
});

function fetchCircuits () {
  return fetch ('http://ergast.com/api/f1/2018/circuits.json')
    .then (res => res.json ())
    .then (res => res.MRData.CircuitTable.Circuits);
}

export const fetchUserData = () => {
  return dispatch =>
    new Promise (resolve => {
      fetchCircuits ().then (res => {
        dispatch (storeData (res));
        resolve (true);
      });
    });
};

export const TimeUserData = () => {
  return dispatch =>
    new Promise (resolve => {
      setTimeout (() => {
        dispatch (storeData ([{username: 'xiaokyo'}]));
        resolve (true);
      }, 1000);
    });
};
