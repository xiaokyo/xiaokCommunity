import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { Skeleton, message } from 'antd';

import to from '@common/to';
import { delHtmlTag } from '@common/delHtmlTag';

// layout
import Layout from '@app/layout/main'

//component
import IsMore from '@components/ismore';

import { searchList } from './loaddata';

//style
import './style.less';

export default props => {
	const key = props.match.params.key;
	const [postlist, setPostList] = useState([]);
	const [loadmore, setLoadmore] = useState('hasmore');
	const [page, setPage] = useState(0);
	// console.log(postlist, page);

	//loadmore
	const loadMorePost = async () => {
		if (loadmore == 'nomore') return false;
		setLoadmore('loading');
		const [err, res] = await to(searchList(key, 10, page + 1));
		if (err) return setLoadmore('nomore');
		setPostList([...postlist, ...res]);
		if (res.length < 10) return setLoadmore('nomore');
		setPage(page + 1);
		setLoadmore('hasmore');
	};

	//init load
	const initLoad = async () => {
		setPage(0);
		const [err, res] = await to(searchList(key, 10, 0));
		if (err) return message.warn(err);

		setPostList(res);
		//初始数据小于10条直接loadmore直接为false，不允许触发滚动加载
		if (res.length < 10) {
			setLoadmore('nomore');
		} else {
			setLoadmore('hasmore');
		}
	};

	useEffect(() => {
		initLoad();
	}, [key]);

	return (
		<Layout>
			<div styleName="home">
				<MetaTags>
					<title>搜索-xiaokyo社区</title>
				</MetaTags>

				<div styleName="left">
					<Skeleton active loading={postlist.length <= 0}>
						{postlist.map(item => (
							<Card key={item._id} {...item} />
						))}
					</Skeleton>

					<IsMore status={loadmore} funcLoadMore={loadMorePost} />
				</div>

				<div styleName="right">
					<div styleName="adv">adv</div>
				</div>
			</div>
		</Layout>
	);
};

//单个帖子
const Card = ({ _id, title, description, user, commentNum = 0, likeNum = 0 }) => {
	// console.log('card' + _id);
	return (
		<div styleName="card">
			<div styleName="tit">
				<Link to={`/post/${_id}`}>{title}</Link>
			</div>
			<div styleName="desc">{delHtmlTag(description)}</div>
			<div styleName="bottom">
				<div styleName="nickname">
					<Link to={`/user/${user._id}`}>{user.username}</Link>
				</div>
				<div styleName="comment">
					<i className="iconfont icon-comment" />
					{commentNum}
				</div>
				<div styleName="liked">
					<i className="iconfont icon-like" />
					{likeNum}
				</div>
			</div>
		</div>
	);
};
