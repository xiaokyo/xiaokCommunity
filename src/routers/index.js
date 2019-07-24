import Loadable from 'react-loadable';
import Loading from '@components/loading';
//loadable
const loadCp = func => {
  return Loadable ({
    loader: func,
    loading: Loading,
  });
};
//serverload
import {load_postlist} from '@redux/actions/postlist';
import loadCurrentPost from '@app/post/serverLoad';

export default [
  {
    path: '/',
    component: loadCp (() => import ('@app/home')),
    exact: true,
    loadData: load_postlist,
  },
  {
    path: '/post/:id',
    exact: true,
    component: loadCp (() => import ('@app/post')),
    loadData: loadCurrentPost,
  },
  {
    path: '/notification',
    exact: true,
    private: true,
    component: loadCp (() => import ('@app/notification')),
  },
  {
    path: '/login',
    exact: true,
    component: loadCp (() => import ('@app/login')),
  },
  {
    path: '*',
    exact: true,
    component: loadCp (() => import ('@app/error')),
  },
];
