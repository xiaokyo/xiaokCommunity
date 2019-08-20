import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

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

const render = async () => {
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
