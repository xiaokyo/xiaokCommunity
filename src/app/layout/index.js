import React, {useEffect} from 'react';
import {Route, Link, Switch, Redirect} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {Menu, Dropdown, Icon} from 'antd';
import doPromise from '@common/doPromise';

//routers
import routers from '@routers';

//actions
import {fetchUserData, removeUser} from '@redux/actions/userInfo';

//style
import './style.less';

const MenuView = () => (
  <Menu>
    <Menu.Item key="0">
      <Link to="/setting">设置</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to="/setting">个人主页</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3"><div>退出</div></Menu.Item>
  </Menu>
);

export default props => {
  console.log ('layout render');
  const userInfo = useSelector (state => state.userInfo);
  const dispatch = useDispatch ();

  //退出并删除本地token
  const logout = () => {
    localStorage.removeItem ('accessToken');
    dispatch (removeUser ());
  };

  //利用本地token来获取当前用户信息
  const reqUserInfoByToken = async () => {
    const accessToken = localStorage.getItem ('accessToken');
    // console.log (accessToken);
    if (accessToken) {
      const [err] = await doPromise (fetchUserData (accessToken) (dispatch));
    }
  };

  useEffect (() => {
    reqUserInfoByToken ();
  }, []);

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

          {userInfo.username
            ? <div className="right_login">
                <Dropdown overlay={MenuView} trigger={['click']}>
                  <a className="ant-dropdown-link" href="#">
                    {userInfo.username} <Icon type="down" />
                  </a>
                </Dropdown>
              </div>
            : <div className="right_login">
                <Link to="/login">登入</Link>
                {/* <Link to="/register">注册</Link> */}
              </div>}

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

// 登陆后可访问的路由
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
