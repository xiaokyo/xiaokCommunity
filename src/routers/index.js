import Home from '../app/home';
import Notification from '../app/notification';
import Error from '../app/error';

//redux
import {fetchData, TimeoutData} from '../redux';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
    loadData: fetchData,
  },
  {
    path: '/notification',
    exact: true,
    component: Notification,
    loadData: TimeoutData,
  },
  {
    path: '*',
    exact: true,
    component: Error,
  },
];
