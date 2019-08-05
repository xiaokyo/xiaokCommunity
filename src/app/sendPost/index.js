import React, { useState, useEffect } from 'react';
import { Input, Button, message, Upload } from 'antd';

//brafteditor
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import { ImageUtils } from 'braft-finder';

import { graphql } from '@graphql';
import fetch from 'node-fetch';

//config
import config from '@config';

//style
import 'braft-editor/dist/index.css';
import './style.less';

export default props => {
	const [title, setTitle] = useState('');
	const [editorState, seteditorState] = useState(BraftEditor.createEditorState(null));
	const { search } = props.location;
	const postid = search.split('=')[1];

	//获取当前id的帖子赋值为初始值
	const getPostById = async () => {
		const args = `{
			getPostById(id:"${postid}"){
				_id
				title
				content
			}
		}`;

		const [err, res] = await graphql({ args });
		if (err) return;

		const { _id, title, content } = res.data.getPostById;
		setTitle(title);
		seteditorState(BraftEditor.createEditorState(content));
	};

	useEffect(() => {
		if (postid) {
			getPostById();
		}
	}, []);

	// editor onchange
	const handleEditorChange = State => {
		seteditorState(State);
	};

	// 发表
	const submitPost = async () => {
		let _title = title
			.replace(/\s+/g, '')
			.replace(/"/g, "'")
			.replace(/“/g, "'")
			.replace(/”/g, "'");
		// console.log(_title);
		if (_title == '') return message.warn('想到好的标题再来哟~');
		const htmlContent = editorState.toHTML();
		// console.log(htmlContent.replace(/"/g, "'"));
		if (htmlContent == '<p></p>') return message.warn('我有酒，请写下你的故事~');

		if (postid) {
			await updatePost(_title, htmlContent);
		} else {
			await createPost(_title, htmlContent);
		}
	};

	//创建新的Post
	const createPost = async (_title, htmlContent) => {
		const args = `{
      addPost(title:"${_title}",content:"${htmlContent.replace(/"/g, "'")}"){
        success
        msg 
      }
    }`;

		const [err, res] = await graphql({ type: 'mutation', args });
		if (err) return message.err(err);
		if (!res.data.addPost.success) return message.warn('添加失败');

		message.success('添加成功');
		setTimeout(() => (window.location.href = `/post/${postid}`), 1500);
	};

	//修改Post
	const updatePost = async (_title, htmlContent) => {
		const args = `{
      updatePost(_id:"${postid}",title:"${_title}",content:"${htmlContent.replace(/"/g, "'")}"){
        success
        msg 
      }
    }`;

		const [err, res] = await graphql({ type: 'mutation', args });
		if (err) return message.err(err);
		if (!res.data.updatePost.success) return message.warn('修改失败');

		message.success('修改成功');
		setTimeout(() => (window.location.href = `/post/${postid}`), 1500);
	};

	//tit onchange
	const titOnChange = e => setTitle(e.target.value);

	//上传图片处理
	const uploadHandler = param => {
		if (!param.file) {
			return false;
		}

		uploadImage(param.file)
			.then(res => {
				if (!res.name) return message.warn(res.msg);
				seteditorState(
					ContentUtils.insertMedias(editorState, [
						{
							type: 'IMAGE',
							url: `${config.ossurl}${res.name}`,
						},
					])
				);
			})
			.catch(err => console.log(err));
	};

	const uploadImage = file =>
		new Promise(async (resolve, reject) => {
			// console.log (file);
			let fd = new FormData();
			fd.append('file', file);

			await fetch(config.uploadurl, {
				method: 'POST',
				body: fd,
			})
				.then(res => res.json())
				.then(res => resolve(res))
				.catch(err => reject(err));
		});

	const extendControls = [
		{
			key: 'antd-uploader',
			type: 'component',
			component: (
				<Upload accept="image/*" showUploadList={false} customRequest={uploadHandler}>
					{/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
					<button type="button" className="control-item button upload-button" data-title="插入图片">
						图片
					</button>
				</Upload>
			),
		},
	];

	const controls = [
		// 'undo',
		// 'redo',
		'font-size',
		// 'line-height',
		// 'letter-spacing',
		'text-color',
		'bold',
		'italic',
		'underline',
		// 'strike-through',
		// 'separator',
		// 'superscript',
		// 'subscript',
		// 'remove-styles',
		// 'emoji',
		// 'text-indent',
		// 'text-align',
		// 'headings',
		// 'list-ul',
		// 'list-ol',
		'blockquote',
		'code',
		// 'link',
		'hr',
		// 'media',
		// 'clear',
	];

	return (
		<div className="sendPost">
			<div className="tit">
				<Input placeholder="想个标题吧~" value={title} allowClear onChange={titOnChange} />
			</div>
			<div className="editor">
				<BraftEditor
					controls={controls}
					value={editorState}
					onChange={handleEditorChange}
					extendControls={extendControls}
				/>
			</div>
			<Button type="primary" shape="round" onClick={submitPost}>
				发布
			</Button>
		</div>
	);
};
