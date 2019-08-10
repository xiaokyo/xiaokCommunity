import React from 'react';
// import { Spin } from 'antd';
// import { LoadingOutline } from '@ant-design/icons/lib/dist';
// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
export default props => (
	<div
		style={{
			padding: '25px',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		}}
	>
		{/* <Spin indicator={antIcon} tip="Loading..." /> */}
		加载中...
	</div>
);
