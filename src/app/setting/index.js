import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Select, Input, message, Modal, Form } from 'antd';
const { Option } = Select;
import axios from 'axios';

//config
import config from '@config';

//common
import { fileOrBlobToDataURL, dataURLToBlob } from '@common/base64';

//actions
import { saveMy } from '@redux/actions/userInfo';

//actions
import { sendEmailAsync, bindEmailAsync } from '@redux/actions/userInfo';

//common
import to from '@common/to';

//cropper
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

//graphql
import { graphql } from '@graphql';

//style
import './style.less';

export default props => {
	const cropper = useRef(null);
	const { my } = useSelector(state => state.userInfo);
	const dispatch = useDispatch();
	const [bindEmailVisible, setBindEmailVisible] = useState(false);
	const [clipImg, setClipImg] = useState();
	const [visible, setVisible] = useState(false);
	const [formdata, setFormdata] = useState({
		avatar: my.avatar,
		username: my.username,
		sex: my.sex,
		phone: my.phone,
	});

	//处理关闭头像裁剪model
	const handleCancel = () => {
		setVisible(false);
	};

	//当有新图片选择后打开裁剪model
	const fileOnChange = async e => {
		let _file = e.currentTarget.files[0];
		if (!_file) return;
		// console.log(_file.size);
		if (_file.size >= 1 * 1024 * 1024) return message.warn('必须小于1mb');
		fileOrBlobToDataURL(_file, function (res) {
			// console.log(res);
			console.log('translate');
			setClipImg(res);
			setVisible(true);
		});
	};

	//username onchange
	const usernameOnChange = e => {
		let val = e.currentTarget.value;
		setFormdata({ ...formdata, username: val });
	};

	//sex onchange
	const sexOnChange = e => {
		// let val = e.currentTarget.value;
		// console.log(e);
		setFormdata({ ...formdata, sex: e.key });
	};

	//clip image
	const _crop = () => {
		// image in dataUrl
		// console.log(cropper.current.getCroppedCanvas().toDataURL());
		let fd = new FormData();
		fd.append('file', dataURLToBlob(cropper.current.getCroppedCanvas().toDataURL()));
		let content = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}; //添加请求头
		axios.post(config.uploadurl, fd, content).then(response => {
			// console.log(response.data);
			if (!response.data.url) return message.error(response.data.msg);
			setFormdata({ ...formdata, avatar: response.data.url + '?x-oss-process=image/resize,m_lfit,h_100,w_100' });
			// dispatch(saveMy({ avatar: response.data.url }));
			setVisible(false);
		});
	};

	//修改提交到服务器
	const _submitUpdate = async () => {
		const { username, sex, phone, avatar } = formdata;
		const args = `updateUser($username:String!,$sex:String!,$phone:String!,$avatar:String!){
			updateUser(username:$username,sex:$sex,phone:$phone,avatar:$avatar){
				success
				msg
			}
		}`;
		const [err, res] = await graphql({ type: 'mutation', args, variables: { username, sex, phone, avatar } });

		if (err) return message.warn('修改失败，请检查后重新操作');
		// console.log(err, res);
		if (!res.updateUser.success) return message.warn(res.updateUser.msg);
		message.success(res.updateUser.msg);
		dispatch(saveMy(formdata));
	};

	return (
		<>
			<div styleName="setting">
				<Modal
					title="头像裁剪"
					visible={visible}
					onOk={_crop}
					// confirmLoading={confirmLoading}
					onCancel={handleCancel}
				>
					<Cropper
						ref={cropper}
						src={clipImg ? clipImg : ''}
						style={{ height: 250, width: '100%', margin: 'auto' }}
						// Cropper.js options
						aspectRatio={10 / 10}
						guides={false}
					// crop={() => _crop()}
					/>
				</Modal>

				<EmailBind visible={bindEmailVisible} cancelFunc={setBindEmailVisible} />

				<div styleName="_item">
					<div styleName="name">头像</div>
					<div styleName="con">
						<div styleName="default">点击图片修改头像</div>
						<div styleName="avatar">
							<img src={formdata.avatar} />
							<input type="file" accept="image/*" onChange={fileOnChange} styleName="selectImg" />
						</div>
					</div>
				</div>
				<div styleName="_item">
					<div styleName="name">昵称</div>
					<div styleName="con">
						<Input type="text" allowClear value={formdata.username} onChange={usernameOnChange} />
					</div>
				</div>
				<div styleName="_item">
					<div styleName="name">性别</div>
					<div styleName="con">
						{/* <div styleName="default">男</div> */}
						<Select labelInValue defaultValue={{ key: formdata.sex }} onChange={sexOnChange}>
							<Option value="0">保密</Option>
							<Option value="1">男</Option>
							<Option value="2">女</Option>
						</Select>
					</div>
				</div>
				<div styleName="_item">
					<div styleName="name">邮箱</div>
					<div styleName="con">
						{my.email ? (
							my.email
						) : (
								<span style={{ cursor: 'pointer' }} onClick={() => setBindEmailVisible(true)}>
									点击绑定邮箱
						</span>
							)}
					</div>
				</div>

				<div styleName="setting_btns">
					<Button type="primary" onClick={_submitUpdate}>
						保存
				</Button>
					{/* <Button type="default">取消</Button> */}
				</div>
			</div>
		</>
	);
};

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

//绑定邮箱ui
const EmailBind = props => {
	const { visible = true, cancelFunc } = props;
	// const { getFieldDecorator } = props.form;
	const [form] = Form.useForm()
	const dispatch = useDispatch();
	const emailRef = useRef();
	const [codeState, setCodeState] = useState('发送验证码');
	const [seconds, setSeconds] = useState(60);
	const [inter, setInter] = useState(null);

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

	// 处理form提交
	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields((err, values) => {
			if (!err) {
				const { email, emailCode } = values;
				//发送绑定邮箱请求
				bindEmailAsync(email, emailCode)(dispatch)
					.then(res => {
						message.success(res);
						cancelFunc(false);
					})
					.catch(err => message.warn(err));
			}
		});
	};

	//unmount的时候清除定时器
	useEffect(() => {
		return () => {
			if (inter) {
				window.clearInterval(inter);
			}
		};
	}, [inter]);

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

	return (
		<Modal title="绑定邮箱" visible={visible} width={350} onOk={handleSubmit} onCancel={() => cancelFunc(false)}>
			<div styleName="bind_email">
				<Form {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed} className="login-form">
					<Form.Item
						label="邮箱"
						name="email"
						rules={[{ required: true, message: '请输入邮箱！' }]}
					>
						<Input
							prefix={<i className="iconfont icon-mail" />}
							ref={emailRef}
						/>
					</Form.Item>
					<Form.Item
						label="邮箱"
						name="email"
						rules={[{ required: true, message: '请输入验证码！' }]}
					>
						<Input
							prefix={<i className="iconfont icon-yanzhengma" />}
							suffix={
								<span className="sendState" onClick={sendEmailCode}>
									{codeState}
								</span>
							}
						/>
					</Form.Item>
				</Form>
			</div>
		</Modal>
	);
};
