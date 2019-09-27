import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// layout
import Layout from '@app/layout/main'

//style
import './style.less';
//common
import { formatDate } from '@common/formatDate';
//actions
import { clearNotification } from '@redux/actions/notification';

export default props => {
	const notification = useSelector(state => state.notification);
	const dispatch = useDispatch();

	let noread = notification.filter(item => item.isread == false);

	useEffect(() => {
		if (noread.length > 0) clearNotification()(dispatch);
	}, []);

	return (
		<Layout>
			<div styleName="notification">
				<h1>动态</h1>
				<ul>
					{notification.map(item => {
						return <SingleItem key={item._id} singleItem={item} />;
					})}
				</ul>
				{noread.length <= 0 ? <span>暂无更多未读消息</span> : ''}
			</div>
		</Layout>
	);
};

const SingleItem = props => {
	const { singleItem } = props;

	switch (singleItem.type) {
		case 'comment':
			return (
				<li styleName="single_item">
					<img src={singleItem.userid.avatar} styleName="avatar" />
					<Link to={`/user/${singleItem.userid._id}`}>{singleItem.userid.username}</Link>
					<span>{formatDate(singleItem.createDate, 1)}</span>
					：评论了你的帖子
					<div styleName="content">{singleItem.commentid.content}</div>
					相关帖子：
					<Link to={`/post/${singleItem.postid._id}`} styleName="post_title">
						{singleItem.postid.title}
					</Link>
				</li>
			);
		case 'like_post':
			return (
				<li styleName="single_item">
					<img src={singleItem.userid.avatar} styleName="avatar" />
					<Link to={`/user/${singleItem.userid._id}`}>{singleItem.userid.username}</Link>
					<span>{formatDate(singleItem.createDate, 1)}</span>
					：喜欢了你的帖子
					<div styleName="content">
						相关帖子：
						<Link to={`/post/${singleItem.postid._id}`} styleName="post_title">
							{singleItem.postid.title}
						</Link>
					</div>
				</li>
			);
		case 'follow':
			return (
				<li styleName="single_item">
					<img src={singleItem.userid.avatar} styleName="avatar" />
					<Link to={`/user/${singleItem.userid._id}`}>{singleItem.userid.username}</Link>
					<span>{formatDate(singleItem.createDate, 1)}</span>
					：关注了你
				</li>
			);
		default:
			return <li styleName="single_item" />;
	}
};
