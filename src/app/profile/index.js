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
	const { id } = props.match.params;
	useEffect(() => {
		loadProfile(id)(dispatch);
	}, [id]);

	return (
		<>
			{!profile.user ? (
				<Loading />
			) : (
				<div styleName="profile">
					<MetaTags>
						<title>{profile.user.username}-个人中心</title>
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

const Post = ({ _id, avatar, title }) => {
	return (
		<div styleName="post">
			<img src={avatar} />
			<div styleName="title">
				<Link to={`/post/${_id}`}>{title}</Link>
			</div>
		</div>
	);
};
