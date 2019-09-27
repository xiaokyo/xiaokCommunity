import React from 'react';
import { Spin } from 'antd';
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
		<Spin />
		{/* loading... */}
	</div>
);
