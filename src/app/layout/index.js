import React from 'react';
import {Route, Link, Switch, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

//routers
import routers from '../../routers';

//style
import './style.less';

export default props => {
  return (
    <div className="layout">
      <div className="header">
        <div className="_box">
          <div className="left_login">
            <div className="logo">
              <Link to="/"><img src={require ('./images/logo.png')} /></Link>
            </div>

            <div className="search">
              <input type="text" placeholder="搜索" />
              <i className="iconfont icon-search" />
            </div>
          </div>

          <div className="right_login">
            <Link to="/login">登入</Link>
            <Link to="/register">注册</Link>
          </div>
        </div>
      </div>
      <div className="container">
        <Switch>
          {routers.map ((route, index) => {
            if (route.private) {
              return (
                <PrivateRoute
                  key={index}
                  exact={route.exact}
                  path={route.path}
                  component={route.component}
                />
              );
            } else {
              return (
                <Route
                  key={index}
                  exact={route.exact}
                  path={route.path}
                  component={route.component}
                />
              );
            }
          })}
        </Switch>
      </div>
    </div>
  );
};

function PrivateRoute({component: Component, ...rest}) {
  const userInfo = useSelector (state => state.userInfo);
  // console.log (userInfo);
  return (
    <Route
      {...rest}
      render={props =>
        userInfo.username
          ? <Component {...props} />
          : <Redirect
              to={{
                pathname: '/login',
                state: {from: props.location},
              }}
            />}
    />
  );
}
