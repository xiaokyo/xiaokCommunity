import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

//reducer
import userInfo from './reducer/userInfo';
import postlist from './reducer/postlist';
import posts from './reducer/posts';

const reducer = combineReducers ({userInfo, postlist, posts});

//middleware
const middleware = [thunk];

//development
if (__DEV__) {
  middleware.push (logger);
}

export default initialState =>
  createStore (reducer, initialState, applyMiddleware (...middleware));
