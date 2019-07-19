import React from 'react';
import Loadable from 'react-loadable';

const Loading = props => <div>loading</div>;
//loadable
const loadCp = func => {
  return Loadable ({
    loader: func,
    loading: Loading,
  });
};
//redux
import {fetchUserData} from '../redux/actions/userInfo';

export default [
  {
    path: '/',
    component: loadCp (() => import ('../app/home')),
    exact: true,
    loadData: fetchUserData,
  },
  {
    path: '/notification',
    exact: true,
    component: loadCp (() => import ('../app/notification')),
  },
  {
    path: '*',
    exact: true,
    component: loadCp (() => import ('../app/error')),
  },
];
