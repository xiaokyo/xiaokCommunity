import React, { useRef, useState } from 'react';
import { Button, Select, Input } from 'antd';
const { Option } = Select;
//cropper
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

//style
import './style.less';

export default props => {
	const cropper = useRef(null);
	const [clipimg, setClipimg] = useState();
	const [formdata, setFormdata] = useState({
		username: 'xiaokyo',
		sex: '1',
		phone: '18989443542',
	});

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

	const sexOnChange = e => {
		// let val = e.currentTarget.value;
		console.log(e);
		setFormdata({ ...formdata, sex: e.key });
	};

	//clip image
	const _crop = () => {
		// image in dataUrl
		console.log(cropper.current.getCroppedCanvas().toDataURL());
	};

	return (
		<div styleName="setting">
			{/* <Cropper
				ref={cropper}
				src="//xiaokyoimg.oss-cn-hangzhou.aliyuncs.com/1564576732838"
				style={{ height: 400, width: 400, margin: 'auto' }}
				// Cropper.js options
				aspectRatio={10 / 10}
				guides={false}
				// crop={() => _crop()}
      /> */}

			<div styleName="_item">
				<div styleName="name">头像</div>
				<div styleName="con">
					<div styleName="avatar">
						<img src="//img.xiaoduyu.com/88b8737e-870a-45a0-af9e-7ce829fda190.jpg?imageMogr2/crop/!200x200a0a0/thumbnail/!200/quality/90" />
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
				<Button type="primary">保存</Button>
				<Button type="default">取消</Button>
			</div>
		</div>
	);
};
