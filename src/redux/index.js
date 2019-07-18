import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import fetch from 'isomorphic-fetch';

function fetchCircuits () {
  return fetch ('http://ergast.com/api/f1/2018/circuits.json')
    .then (res => res.json ())
    .then (res => res.MRData.CircuitTable.Circuits);
}

export const initializeSession = () => ({
  type: 'INITIALIZE_SESSION',
});

export const storeData = data => ({
  type: 'STORE_DATA',
  data,
});

export const fetchData = () => {
  return dispatch =>
    new Promise (resolve => {
      fetchCircuits ().then (res => {
        dispatch (storeData (res));
        resolve (true);
      });
    });
};

export const TimeoutData = () => {
  return dispatch =>
    new Promise (resolve => {
      setTimeout (() => {
        dispatch (storeData ([{username: 'xiaokyo'}]));
        resolve (true);
      }, 1000);
    });
};

const sessionReducer = (state = false, action) => {
  switch (action.type) {
    case 'INITIALIZE_SESSION':
      return true;
    default:
      return state;
  }
};

const dataReducer = (state = [], action) => {
  switch (action.type) {
    case 'STORE_DATA':
      return action.data;
    default:
      return state;
  }
};

const reducer = combineReducers ({
  loggedIn: sessionReducer,
  data: dataReducer,
});

export default initialState =>
  createStore (reducer, initialState, applyMiddleware (thunkMiddleware));
