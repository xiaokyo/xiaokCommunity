import Loadable from 'react-loadable';
import Loading from '@components/loading';
//loadable
const loadCp = func => {
	return Loadable({
		loader: func,
		loading: Loading,
	});
};
//serverload
import { load_postlist } from '@redux/actions/postlist';
import loadCurrentPost from '@app/post/serverLoad';
import loadCurrentProfile from '@app/profile/serverLoad';

export default [
	{
		path: '/',
		component: loadCp(() => import('@app/home')),
		exact: true,
		loadData: load_postlist,
	},
	{
		path: '/search/:key',
		component: loadCp(() => import('@app/search')),
		exact: true,
	},
	{
		path: '/post/:id',
		exact: true,
		component: loadCp(() => import('@app/post')),
		loadData: loadCurrentPost,
	},
	{
		path: '/sendPost',
		exact: true,
		private: true,
		component: loadCp(() => import('@app/sendPost')),
	},
	{
		path: '/user/:id',
		exact: false,
		component: loadCp(() => import('@app/profile')),
		loadData: loadCurrentProfile,
	},
	{
		path: '/setting',
		exact: true,
		private: true,
		component: loadCp(() => import('@app/setting')),
	},
	{
		path: '/notification',
		exact: true,
		private: true,
		component: loadCp(() => import('@app/notification')),
	},
	{
		path: '/creditCards',
		exact: true,
		private: true,
		component: loadCp(() => import('@app/cards')),
	},
	{
		path: '/login',
		exact: true,
		component: loadCp(() => import('@app/login')),
	},
	{
		path: '/register',
		exact: true,
		component: loadCp(() => import('@app/register')),
	},
	{
		path: '*',
		exact: true,
		component: loadCp(() => import('@app/error')),
	},
];
