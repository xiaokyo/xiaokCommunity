import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { Tabs, Button } from 'antd';
const { TabPane } = Tabs;



//style
import './style.less';

//components
import Loading from '@components/loading';
import IsMore from '@components/ismore';

//actions
import { loadProfile, follow, unFollow } from '@redux/actions/profile';

export default props => {
	const profile = useSelector(state => state.profile);
	const userInfo = useSelector(state => state.userInfo);
	const dispatch = useDispatch();
	const [page, setPage] = useState(0);
	const [loadmore, setLoadmore] = useState('hasmore');
	const { id } = props.match.params;

	useEffect(() => {
		setLoadmore('loading');
		loadProfile(id)(dispatch).then(res => {
			setLoadmore('hasmore');
			if (res.posts.length <= 0) setLoadmore('nomore');
		});
	}, [id]);

	//加载更多作者的帖子 10条
	const loadMorePost = async () => {
		setLoadmore('loading');
		let _page = page + 1;
		loadProfile(id, 10, _page)(dispatch).then(res => {
			setLoadmore('hasmore');
			if (res.posts.length <= 0) setLoadmore('nomore');
			setPage(_page);
		});
	};

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

							{userInfo.my && userInfo.my._id != profile.user._id ? (
								<div styleName="operations">
									{profile.isFollow ? (
										<Button
											size="small"
											type="primary"
											onClick={() => unFollow(profile.user._id)(dispatch)}
										>
											取消关注
									</Button>
									) : (
											<Button
												size="small"
												type="primary"
												onClick={() => follow(profile.user._id)(dispatch)}
											>
												关注
									</Button>
										)}
								</div>
							) : (
									''
								)}
						</div>

						<Tabs tabPosition={'top'}>
							<TabPane tab="帖子" key="1">
								{profile.posts.map(item => (
									<Post key={item._id} {...item} avatar={profile.user.avatar} />
								))}
							</TabPane>
						</Tabs>
						<IsMore status={loadmore} funcLoadMore={loadMorePost} />
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
