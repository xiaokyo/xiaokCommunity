import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

//routers
import routers from '@routers';

//style
import './style.less';

export default (props) => {
	return (
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
