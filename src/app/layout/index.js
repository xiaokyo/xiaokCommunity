import React, { useState, useEffect } from 'react';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

//components
import Notice from '@components/notice';

//routers
import routers from '@routers';

//actions
import { logout } from '@redux/actions/userInfo';

//style
import './style.less';

export default withRouter((props) => {
	// console.log(props);
	const userInfo = useSelector(state => state.userInfo);
	console.log(props)
	const [key, setKey] = useState('');
	const searchIptOnChange = e => {
		let val = e.target.value;
		setKey(val);
		// console.log(val);
	};

	//回车触发搜索
	const searchIptOnkeyup = (e) => {
		if (e.keyCode == 13) {
			props.history.push(`/search/${key}`)
		}
	}

	useEffect(() => {

		return () => { }
	}, [])

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
							<input type="text" placeholder="搜索" value={key} onChange={searchIptOnChange} onKeyUp={searchIptOnkeyup} />
							<Link to={`/search/${key}`}>
								<i className="iconfont icon-search" />
							</Link>
						</div>
					</div>

					<div className="right_login">
						{userInfo.my ? (
							<UserMenu {...userInfo.my} />
						) : (
								<div>
									<Link to="/login">登入</Link>
									<Link to="/register">注册</Link>
								</div>
							)}
					</div>
				</div>
			</div>
			<div className={`container ${props.location.pathname === '/' || props.location.pathname === '/search' ? 'index' : ''}`}>
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
			{userInfo.my ? <Notice /> : ''}
		</div>
	);
});

//点击头像显示menu
const UserMenu = ({ _id, avatar, username }) => {
	const [show, setShow] = useState(false);

	const dispatch = useDispatch();
	//退出并删除本地token
	const _logout = () => {
		logout()(dispatch);
	};

	const handleClick = e => {
		e.nativeEvent.stopImmediatePropagation(); //阻断事件冒泡
		setShow(!show);
	};

	//点击其他地方关闭menu
	const hideMenu = () => {
		setShow(false);
	};

	useEffect(() => {
		document.addEventListener('click', hideMenu);
		return () => document.removeEventListener('click', hideMenu);
	}, []);

	return (
		<div>
			<div className="user_menu" onClick={handleClick}>
				<img src={avatar} className="avatar" />
				<ul className="menu_list" style={{ display: show ? 'block' : 'none' }}>
					<li>
						<Link to={`/user/${_id}`}>
							<i className="iconfont icon-my" />
							{username}
						</Link>
					</li>
					<li>
						<Link to={`/setting`}>
							<i className="iconfont icon-settings_light" />
							设置
						</Link>
					</li>
					<li>
						<Link to={`/sendPost`}>
							<i className="iconfont icon-write" />
							我要发帖
						</Link>
					</li>
					<li>
						<a href="#" onClick={_logout}>
							退出
						</a>
					</li>
				</ul>
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
