import React from 'react';

export default ({ status = 'hasmore', funcLoadMore }) => {
	switch (status) {
		case 'hasmore':
			return (
				<div style={{ textAlign: 'center', padding: '20px 25px' }} onClick={funcLoadMore}>
					点击加载更多哟 ~汪~
				</div>
			);
		case 'nomore':
			return <div style={{ textAlign: 'center', padding: '20px 25px' }}>这是本汪的底线了 ~汪~</div>;
		case 'loading':
			return (
				<div
					style={{
						padding: '20px 25px',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					加载中...
				</div>
			);
		default:
			return <></>;
	}
};
