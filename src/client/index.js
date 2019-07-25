import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider as ReduxProvider} from 'react-redux';

//mock
import '../../mock';

//components
import Layout from '@app/layout';
import Home from '@app/home';
import Notification from '@app/notification';

//store
import createStore from '@redux';

const store = createStore (window.REDUX_DATA);

const jsx = (
  <ReduxProvider store={store}>
    <Router>
      <Layout />
    </Router>
  </ReduxProvider>
);

const app = document.getElementById ('app');

// render
import doPromise from '@common/doPromise';
import {fetchUserData} from '@redux/actions/userInfo';

const render = async () => {
  const accessToken = localStorage.getItem ('accessToken');
  if (!accessToken) return false;
  const [err] = await doPromise (fetchUserData (accessToken) (store.dispatch));
  if (!err) return true;
  return false;
};

render ().then (res => {
  // console.log (res);
  __DEV__ ? ReactDOM.render (jsx, app) : ReactDOM.hydrate (jsx, app);
});
