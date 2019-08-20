import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';

//style
import './style.less';
import { graphql } from '@graphql';

//actions
import { sendEmailAsync } from '@redux/actions/userInfo';

//common
import to from '@common/to';

export default Form.create({ name: 'register' })(props => {
	const { getFieldDecorator } = props.form;
	const [codeState, setCodeState] = useState('发送验证码');
	const [seconds, setSeconds] = useState(60);
	const [inter, setInter] = useState(null);

	const emailRef = useRef();

	//60秒发送一次邮件
	const limitClickSend = () => {
		let _seconds = seconds;
		setCodeState(`${_seconds}s`);
		let _inter = setInterval(() => {
			if (_seconds <= 0) {
				setCodeState(`发送验证码`);
				setSeconds(60);
				return window.clearInterval(_inter);
			}
			_seconds = _seconds - 1;
			setSeconds(_seconds);
			setCodeState(`${_seconds}s`);
		}, 1000);
		setInter(_inter);
	};

	useEffect(() => {
		return () => {
			if (inter) {
				window.clearInterval(inter);
			}
		};
	}, [inter]);

	// 处理form提交
	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields((err, values) => {
			if (!err) {
				// console.log ('Received values of form: ', values);
				const { username, password, email, emailCode, confrimPassword } = values;

				if (password != confrimPassword) return message.warning('两次输入的密码不相同');

				//发送注册graphql
				regUser(username, password, email, emailCode);
			}
		});
	};

	//sendEmailCode
	const sendEmailCode = async () => {
		if (codeState != '发送验证码') return;
		let email = emailRef.current.state.value;
		if (!email) return message.warn('请输入邮箱!');
		let [err, res] = await to(sendEmailAsync(email));
		if (err) return message.warn(err.message);
		limitClickSend();
		message.success(res);
	};

	//register graphql
	const regUser = async (username, password, email, emailCode) => {
		const args = `addUser($username:String!,$password:String!,$email:String!,$emailCode:String!){
      addUser(username:$username,password:$password,email:$email,emailCode:$emailCode){
        success
        msg
      }
    }`;
		const [err, res] = await graphql({
			type: 'mutation',
			args,
			variables: { username, password, email, emailCode },
		});
		if (err) return message.warn('服务器错误！');
		let { success, msg } = res.addUser;
		if (!success) return message.warn(msg);
		message.success(msg);
		let toPath = props.location.state ? props.location.state.from.pathname : '/login';
		props.history.push(toPath);
	};

	return (
		<div styleName="register">
			<h1>注册</h1>
			<div styleName="_box">
				<Form onSubmit={handleSubmit} className="login-form">
					<Form.Item>
						{getFieldDecorator('username', {
							rules: [{ required: true, message: '请输入用户名！' }],
						})(<Input prefix={<i className="iconfont icon-my" />} placeholder="用户名" />)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, message: '请输入邮箱！' }],
						})(
							<Input
								prefix={<i className="iconfont icon-mail" />}
								ref={emailRef}
								placeholder="你的邮箱"
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('emailCode', {
							rules: [{ required: true, message: '请输入验证码！' }],
						})(
							<Input
								prefix={<i className="iconfont icon-yanzhengma" />}
								suffix={
									<span className="sendState" onClick={sendEmailCode}>
										{codeState}
									</span>
								}
								placeholder="验证码"
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: '请输入密码！' }],
						})(
							<Input.Password
								prefix={<i className="iconfont icon-lock" />}
								type="password"
								placeholder="密码"
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('confrimPassword', {
							rules: [{ required: true, message: '请确认密码！' }],
						})(
							<Input.Password
								prefix={<i className="iconfont icon-lock" />}
								type="password"
								placeholder="确认密码"
							/>
						)}
					</Form.Item>
					<Form.Item>
						{/* <a className="login-form-forgot" href="">
              Forgot password
            </a> */}
						<Button type="primary" htmlType="submit" className="login-form-button">
							确定
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
});
