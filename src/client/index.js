import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, matchPath } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

//routers
import routers from '@routers';

//components
import Layout from '@app/layout';

//store
import createStore from '@redux';

const store = createStore(window.REDUX_DATA);

const jsx = (
	<ReduxProvider store={store}>
		<Router>
			<Layout />
		</Router>
	</ReduxProvider>
);

const app = document.getElementById('app');

// render
import to from '@common/to';
import { fetchUserData } from '@redux/actions/userInfo';

//预加载首屏组件的js
const PreLoadRoute = async () => {
	let currentRoute = null,
		match = null;
	routers.some(route => {
		let _match = matchPath(window.location.pathname, route);
		if (_match) {
			currentRoute = route;
			match = _match;
		}
		return _match;
	});
	await currentRoute.component.preload();
}

//渲染前查询用户数据，无用户则不查询
const render = async () => {
	await PreLoadRoute();
	if (store.getState().userInfo.my) return true;
	const accessToken = localStorage.getItem('accessToken');
	if (!accessToken) return false;
	const [err] = await to(fetchUserData(accessToken)(store.dispatch));
	if (err) return false;
	return true;
};

render().then(res => {
	// console.log (res);
	__DEV__ ? ReactDOM.render(jsx, app) : ReactDOM.hydrate(jsx, app);
});
