import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';

//actions
import { login } from '@redux/actions/userInfo';

//style
import './style.less';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

export default props => {
	// console.log('login render');
	const [form] = Form.useForm()
	// const { getFieldDecorator } = form;
	const dispatch = useDispatch();

	const onFinish = values => {
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

	const onFinishFailed = ({ values, errorFields, outOfDate }) => {

	}

	// const qqAuth = () => {
	// 	window.open(
	// 		`https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=${Date.now()}&response_type=token&scope=get_user_info&redirect_uri=https%3A%2F%2Fxiaok.club/qqAuth`
	// 	);
	// };

	return (
		<>
			<div styleName="login">
				<h1>登录</h1>
				<div styleName="_box">
					<Form {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed} className="login-form">
						<Form.Item
							label="用户名"
							name="email"
							rules={[{ required: true, message: '请输入邮箱/用户名！' }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="密码"
							name="password"
							rules={[{ required: true, message: '请输入密码！' }]}
						>
							<Input.Password />
						</Form.Item>
						{/* <Form.Item>
							{getFieldDecorator('email', {
								rules: [{ required: true, message: '请输入邮箱/用户名！' }],
							})(<Input prefix={<i className="iconfont icon-my" />} placeholder="邮箱/用户名" />)}
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
						</Form.Item> */}
						<Form.Item>
							<Button type="primary" htmlType="submit" className="login-form-button">
								确定
						</Button>
						</Form.Item>
					</Form>

					{/* <div onClick={qqAuth}>qq登录</div> */}
				</div>
			</div>
		</>
	);
};
