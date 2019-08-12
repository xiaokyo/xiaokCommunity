import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';

//react
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
import { StaticRouter as Router, matchPath } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import routers from '@routers';
import createStore from '@redux';

//components
import Layout from '@app/layout';

const app = express();

app.use(helmet()); //阻挡一些web的安全隐患
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());

// 静态资源
app.use('/', express.static('./dist'));
app.use('/', express.static('./public'));

//设置auth cookie
app.post('/setAuth', async (req, res) => {
	const access_token = req.headers.accesstoken;
	// console.log(req.headers, access_token);
	res.cookie('access_token', access_token, { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
	res.send({ success: true });
});

//清除auth cookie
app.post('/clearAuth', async (req, res) => {
	res.clearCookie('access_token');
	res.send({ success: true });
});

// 读取模板页面
const htmlTemplate = fs.readFileSync('./dist/app.html', 'utf-8');

import { fetchUserData } from '@redux/actions/userInfo';

app.get('*', async (req, res) => {
	let access_token = req.cookies['access_token'] || '';
	// console.log(`access_token:${access_token}`);
	const store = createStore({});
	const dispatch = store.dispatch;
	if (access_token) {
		//获取用户信息存入store
		await fetchUserData(access_token)(dispatch).catch(err => console.log(err));
		return res.send(renderReplace({ store }));
	}
	let currentRoute = null,
		match = null;
	routers.some(route => {
		let _match = matchPath(req.path, route);
		if (_match) {
			currentRoute = route;
			match = _match;
		}
		return _match;
	});

	//加载redux数据的方法
	if (currentRoute.loadData) {
		await currentRoute.loadData()(dispatch, match);
		//组件预加载
		await currentRoute.component.preload();
	} else {
		currentRoute.component = () => <div />;
	}

	const metaTagsInstance = MetaTagsServer();

	// const context = {};
	const AppComponent = ReactDOMServer.renderToString(
		<ReduxProvider store={store}>
			<MetaTagsContext extract={metaTagsInstance.extract}>
				<Router location={req.url}>
					<Layout />
				</Router>
			</MetaTagsContext>
		</ReduxProvider>
	);

	const meta = metaTagsInstance.renderToString();
	res.send(renderReplace({ store, meta, AppComponent }));
});

//模板字段替换
const renderReplace = ({ store, meta = '', AppComponent = '' }) => {
	const reduxState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');
	let reactDom = htmlTemplate.replace('<!--app-->', AppComponent);
	reactDom = reactDom.replace('<!--initState-->', reduxState);
	reactDom = reactDom.replace('<!--meta-->', meta);
	return reactDom;
};

const port = 8080;
app.listen(port, function() {
	console.log(`xiaokCommunity on port ${port}!`);
});
