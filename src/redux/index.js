import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

//reducer
import userInfo from './reducer/userInfo';
import postlist from './reducer/postlist';

const reducer = combineReducers ({userInfo, postlist});

const middleware = [thunk, logger];

export default initialState =>
  createStore (reducer, initialState, applyMiddleware (...middleware));
