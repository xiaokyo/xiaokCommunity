import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
//redux
import { useStore, useSelector } from 'react-redux';
//socket
import socketConnect from '../socket';

export default props => {
	const store = useStore();
	const { userInfo } = store.getState();
	const notification = useSelector(state => state.notification);

	const noreadArr = notification.filter(item => item['isread'] == false);

	useEffect(() => {
		socketConnect(store);
	}, [userInfo]);

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 20,
				right: 20,
				width: 40,
				height: 40,
				borderRadius: '50%',
				backgroundColor: '#e3a86c',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Link to="/notification" style={{ textDecoration: 'none' }}>
				<i className="iconfont icon-notice" style={{ fontSize: 25, color: '#fff' }} />
				{noreadArr.length > 0 ? (
					<span
						style={{
							zIndex: 10,
							padding: '0 8px',
							position: 'absolute',
							right: -5,
							top: -5,
							fontSize: 12,
							whiteSpace: 'nowrap',
							textAlign: 'center',
							minWidth: 20,
							backgroundColor: '#f5222d',
							color: '#fff',
							borderRadius: '10px',
						}}
					>
						{noreadArr.length}
					</span>
				) : (
						''
					)}
			</Link>
		</div>
	);
};
