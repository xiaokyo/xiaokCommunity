import io from 'socket.io-client';
import config from '@config';

//actions
import { newNotification, initNotification } from '@redux/actions/notification';

const socketConnect = store => {
	const { userInfo } = store.getState();
	const token = __CLIENT__ ? localStorage.getItem('accessToken') : userInfo.accessToken ? userInfo.accessToken : '';

	if (!token) return;
	const socket = io(config.socketUri, {
		// 是否自动重新连接
		reconnection: true,
		// 自动重连10次后放弃
		reconnectionAttempts: 15,
		// 发送参数给服务器，服务端获取参数 socket.handshake.query
		query: {
			token: token,
		},
	});

	//成功连接
	socket.on('connect', function() {
		console.log('socket connect success');
	});

	const dispatch = store.dispatch;

	//init notification
	socket.on(userInfo.my._id + 'init', function(data) {
		if (data.length <= 0) return;
		initNotification(data)(dispatch);
	});

	//获取到关于自己的消息时
	socket.on(userInfo.my._id, function(data) {
		// console.log(data);
		newNotification(data)(dispatch);
	});

	// 如果断开了连接，尝试重新连接
	socket.on('disconnect', function() {
		console.log('socket has disconnect.');
	});
};

export default socketConnect;
