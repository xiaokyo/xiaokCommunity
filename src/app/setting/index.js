import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Select, Input, message, Modal } from 'antd';
const { Option } = Select;
import axios from 'axios';

//config
import config from '@config';

//common
import { fileOrBlobToDataURL, dataURLToBlob } from '@common/base64';

//actions
import { saveMy } from '@redux/actions/userInfo';

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
		fileOrBlobToDataURL(_file, function(res) {
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

	//phone onchange
	const phoneOnChange = e => {
		let val = e.currentTarget.value;
		setFormdata({ ...formdata, phone: val });
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
			setFormdata({ ...formdata, avatar: response.data.url + '?x-oss-process=image/resize,m_lfit,h_100,w_100' });
			// dispatch(saveMy({ avatar: response.data.url }));
			setVisible(false);
		});
	};

	//修改提交到服务器
	const _submitUpdate = async () => {
		const { username, sex, phone, avatar } = formdata;
		const args = `{
			updateUser(username:"${username}",sex:"${sex}",phone:"${phone}",avatar:"${avatar}"){
				success
				msg
			}
		}`;
		const [err, res] = await graphql({ type: 'mutation', args });

		if (err) return message.warn('修改失败，请检查后重新操作');
		// console.log(err, res);
		if (!res.data.updateUser.success) return message.warn(res.data.updateUser.msg);
		message.success(res.data.updateUser.msg);
		dispatch(saveMy(formdata));
	};

	return (
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
					aspectRatio={19 / 19}
					guides={false}
					// crop={() => _crop()}
				/>
			</Modal>

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
				<div styleName="name">手机号码</div>
				<div styleName="con">
					<Input type="tel" number={11} allowClear value={formdata.phone} onChange={phoneOnChange} />
				</div>
			</div>

			<div styleName="setting_btns">
				<Button type="primary" onClick={_submitUpdate}>
					保存
				</Button>
				{/* <Button type="default">取消</Button> */}
			</div>
		</div>
	);
};
