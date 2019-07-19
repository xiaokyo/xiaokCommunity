import Home from '../app/home';
import Notification from '../app/notification';
import Error from '../app/error';

//redux
import {fetchUserData, TimeUserData} from '../redux/actions/userInfo';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
    loadData: fetchUserData,
  },
  {
    path: '/notification',
    exact: true,
    component: Notification,
    loadData: TimeUserData,
  },
  {
    path: '*',
    exact: true,
    component: Error,
  },
];
