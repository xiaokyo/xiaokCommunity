import React, { useState } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown, Icon } from 'antd';

//routers
import routers from '@routers';

//actions
import { logout } from '@redux/actions/userInfo';

//style
import './style.less';

export default () => {
	const userInfo = useSelector(state => state.userInfo);
	const dispatch = useDispatch();

	//退出并删除本地token
	const _logout = () => {
		logout()(dispatch).then(res => {
			localStorage.removeItem('accessToken');
			window.location.reload();
		});
	};

	// menu item handle click
	const handleMenuClick = e => {
		if (e.key == '/logout') return _logout();
		// props.history.push (e.key);
	};

	// 个人下拉菜单
	const MenuView = () => (
		<Menu onClick={handleMenuClick}>
			<Menu.Item key="/profile">
				<Link to={`/user/${userInfo.my._id}`} styleName="menu_item">
					<Icon type="user" />
					{userInfo.my.username}
				</Link>
			</Menu.Item>
			<Menu.Item key="/setting">
				<Link to="/setting" styleName="menu_item">
					<Icon type="setting" />
					设置
				</Link>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="/sendPost">
				<Link to="/sendPost" styleName="menu_item">
					<Icon type="form" />
					我要发帖
				</Link>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="/logout">退出</Menu.Item>
		</Menu>
	);

	const [key, setKey] = useState('');
	const searchIptOnChange = e => {
		let val = e.target.value;
		setKey(val);
		// console.log(val);
	};

	return (
		<div className="layout">
			<div className="header">
				<div className="_box">
					<div className="left_login">
						<div className="logo">
							<Link to="/">
								<img src={require('./images/logo.png')} />
							</Link>
						</div>

						<div className="search">
							<input type="text" placeholder="搜索" value={key} onChange={searchIptOnChange} />
							<Link to={`/search/${key}`}>
								<i className="iconfont icon-search" />
							</Link>
						</div>
					</div>

					<div className="right_login">
						{userInfo.my ? (
							<Dropdown overlay={MenuView} trigger={['click']}>
								<a className="ant-dropdown-link" href="#">
									<img src={userInfo.my.avatar} />
								</a>
							</Dropdown>
						) : (
							<div className="right_login">
								<Link to="/login">登入</Link>
								<Link to="/register">注册</Link>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="container">
				<Switch>
					{routers.map((route, index) => {
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
								<Route key={index} exact={route.exact} path={route.path} component={route.component} />
							);
						}
					})}
				</Switch>
			</div>
		</div>
	);
};

// 登陆后可访问的路由
function PrivateRoute({ component: Component, ...rest }) {
	const userInfo = useSelector(state => state.userInfo);
	// console.log (userInfo);
	return (
		<Route
			{...rest}
			render={props =>
				userInfo.my ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
}
