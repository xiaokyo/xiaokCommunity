import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';

//actions
import { login } from '@redux/actions/userInfo';

//style
import './style.less';

export default Form.create({ name: 'login' })(props => {
	// console.log('login render');
	const { getFieldDecorator } = props.form;
	const dispatch = useDispatch();

	// 处理form提交
	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields((err, values) => {
			if (!err) {
				// console.log ('Received values of form: ', values);
				const { email, password } = values;
				const fromPath = props.location.state ? props.location.state.from.pathname : '/';

				login(email, password)(dispatch)
					.then(res => {
						message.success('登入成功');
						props.history.push(fromPath);
					})
					.catch(err => {
						message.warning(err);
					});
			}
		});
	};

	// const qqAuth = () => {
	// 	window.open(
	// 		`https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=${Date.now()}&response_type=token&scope=get_user_info&redirect_uri=https%3A%2F%2Fxiaok.club/qqAuth`
	// 	);
	// };

	return (
		<div styleName="login">
			<h1>登录</h1>
			<div styleName="_box">
				<Form onSubmit={handleSubmit} className="login-form">
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, message: '请输入邮箱/用户名！' }],
						})(<Input prefix={<i className="iconfont icon-my" />} placeholder="输入邮箱/用户名" />)}
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
						{/* <a className="login-form-forgot" href="">
              Forgot password
            </a> */}
						<Button type="primary" htmlType="submit" className="login-form-button">
							确定
						</Button>
					</Form.Item>
				</Form>

				{/* <div onClick={qqAuth}>qq登录</div> */}
			</div>
		</div>
	);
});
