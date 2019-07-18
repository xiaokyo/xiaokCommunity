import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';

//react
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MetaTagsServer from 'react-meta-tags/server';
import {MetaTagsContext} from 'react-meta-tags';
import {StaticRouter as Router, Route, Link, matchPath} from 'react-router-dom';
import {Provider as ReduxProvider} from 'react-redux';
import routers from '../routers';
import createStore, {initializeSession, storeData} from '../redux';

//components
import Layout from '../app/layout';
import Home from '../app/home';
import Notification from '../app/notification';

const app = express ();

app.use (helmet ()); //阻挡一些web的安全隐患
app.use (bodyParser.json ({limit: '20mb'}));
app.use (bodyParser.urlencoded ({limit: '20mb', extended: true}));
app.use (cookieParser ());

// 静态资源
app.use ('/', express.static ('./dist'));
app.use ('/', express.static ('./public'));

// 读取模板页面
const htmlTemplate = fs.readFileSync ('./dist/app.html', 'utf-8');

app.get ('*', async (req, res) => {
  const store = createStore ();
  const dispatch = store.dispatch;

  let currentRoute = null;
  routers.some (route => {
    const match = matchPath (req.path, route);
    // console.log (match);
    if (match) currentRoute = route;
    return match;
  });

  if (currentRoute.loadData) {
    await currentRoute.loadData () (dispatch);
  }

  const metaTagsInstance = MetaTagsServer ();

  // const context = {};
  const AppComponent = ReactDOMServer.renderToString (
    <ReduxProvider store={store}>
      <MetaTagsContext extract={metaTagsInstance.extract}>
        <Router location={req.url}>
          <Layout />
        </Router>
      </MetaTagsContext>
    </ReduxProvider>
  );

  const meta = metaTagsInstance.renderToString ();
  const reduxState = JSON.stringify (store.getState ()).replace (/</g, '\\x3c');

  let reactDom = htmlTemplate.replace ('<!--app-->', AppComponent);
  // console.log (reactDom);
  reactDom = reactDom.replace ('<!--initState-->', reduxState);
  reactDom = reactDom.replace ('<!--meta-->', meta);
  res.send (reactDom);
});

app.listen (3000, function () {
  console.log ('Example app listening on port 3000!');
});
