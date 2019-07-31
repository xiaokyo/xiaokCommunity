import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
//style
import './style.less';

//components
import Loading from '@components/loading';

//actions
import { loadProfile } from '@redux/actions/profile';

export default props => {
	const profile = useSelector(state => state.profile);
	const dispatch = useDispatch();

	useEffect(() => {
		const userid = props.match.params.id;
		loadProfile(userid)(dispatch);
	}, []);

	return (
		<>
			{!profile.user ? (
				<Loading />
			) : (
				<div styleName="profile">
					<MetaTags>
						<title>xiaokyo-个人中心</title>
						<meta name="description" content="一个简约的交流社区" />
					</MetaTags>
					<div styleName="user_info">
						<div styleName="avatar">
							<img src={profile.user.avatar} />
						</div>
						<div styleName="username">{profile.user.username}</div>
						<div styleName="bottom_con">
							<div styleName="item">关注 {profile.user.follow}</div>
							<div styleName="item">粉丝 {profile.user.fan}</div>
						</div>
					</div>

					<Tabs tabPosition={'top'}>
						<TabPane tab="帖子" key="1">
							{profile.posts.map(item => (
								<Post key={item._id} {...item} avatar={profile.user.avatar} />
							))}
						</TabPane>
					</Tabs>
				</div>
			)}
		</>
	);
};

const Post = ({
	_id = '5d418be57bb4770858648e78',
	avatar = '//upload.jianshu.io/users/upload_avatars/15662430/96657d09-f4f6-4cc9-9709-5aa2f8deab3c?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240',
	title = '新人报道',
}) => {
	return (
		<div styleName="post">
			<img src={avatar} />
			<div styleName="title">
				<Link to={`/post/${_id}`}>{title}</Link>
			</div>
		</div>
	);
};
