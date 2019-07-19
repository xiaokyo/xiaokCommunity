import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

//reducer
import session from './reducer/session';
import userInfo from './reducer/userInfo';

const reducer = combineReducers ({session, userInfo});

export default initialState =>
  createStore (reducer, initialState, applyMiddleware (thunkMiddleware));
