import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton } from 'antd';

import doPromise from '@common/doPromise';
import { delHtmlTag } from '@common/delHtmlTag';

//component
import IsMore from '@components/ismore';

//redux
import { load_postlist, load_more_postlist } from '@redux/actions/postlist';

//style
import './style.less';

export default props => {
	// console.log('home render');
	const postlist = useSelector(state => state.postlist);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [loadmore, setLoadmore] = useState('hasmore');
	const [page, setPage] = useState(0);
	// console.log (postlist);

	//loadmore
	const loadMorePost = async () => {
		if (loadmore == 'nomore') return false;
		setLoadmore('loading');
		const [err, res] = await doPromise(load_more_postlist(page + 1)(dispatch));
		if (err) return setLoadmore('nomore');
		if (res.length < 10) return setLoadmore('nomore');
		setPage(page + 1);
		setLoadmore('hasmore');
	};

	//init load
	const initLoad = async () => {
		if (postlist.length <= 0) {
			setLoading(true);
			const [err, res] = await doPromise(load_postlist()(dispatch));
			if (!err) setLoading(false);
			if (res.length < 10) setLoadmore('nomore'); //初始数据小于10条直接loadmore直接为false，不允许触发滚动加载
		}
	};

	useEffect(() => {
		initLoad();
	}, []);

	return (
		<div styleName="home">
			<MetaTags>
				<title>xiaokyo-首页</title>
				<meta name="description" content="一个简约的交流社区" />
			</MetaTags>

			<div styleName="left">
				<Skeleton active loading={loading}>
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
	);
};

//单个帖子
const Card = ({ _id, title, description, user, commentNum = 0, likeNum = 0 }) => {
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
