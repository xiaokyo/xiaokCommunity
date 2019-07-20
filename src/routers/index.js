import React from 'react';
import Loadable from 'react-loadable';
import {Spin, Icon} from 'antd';
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;

const Loading = props => (
  <div
    style={{
      padding: '25px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spin indicator={antIcon} />
  </div>
);
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
    private: true,
    component: loadCp (() => import ('../app/notification')),
  },
  {
    path: '/post/:id',
    exact: true,
    component: loadCp (() => import ('../app/post')),
  },
  {
    path: '/login',
    exact: true,
    component: loadCp (() => import ('../app/login')),
  },
  {
    path: '*',
    exact: true,
    component: loadCp (() => import ('../app/error')),
  },
];
