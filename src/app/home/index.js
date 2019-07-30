import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import {useSelector, useDispatch} from 'react-redux';
import {Skeleton} from 'antd';

import doPromise from '@common/doPromise';
import {delHtmlTag} from '@common/delHtmlTag';

//component
import IsMore from '@components/ismore';

//redux
import {load_postlist, load_more_postlist} from '@redux/actions/postlist';

//style
import './style.less';

export default props => {
  console.log ('home render');
  const postlist = useSelector (state => state.postlist);
  const dispatch = useDispatch ();
  const [loading, setLoading] = useState (false);
  const [loadmore, setLoadmore] = useState (true);
  const [refresh, setRefresh] = useState (false);
  const [page, setPage] = useState (0);
  // console.log (postlist);

  //处理滚动
  const handlerScroll = async e => {
    if (!loadmore) return;
    if (refresh) return;
    const scrollT = document.documentElement.scrollTop;
    const clientH = document.documentElement.clientHeight;
    const scrollH = document.documentElement.scrollHeight;

    if (scrollH - (scrollT + clientH) <= 100) {
      console.log (`loadmore:${loadmore}`);
      setRefresh (true);
      const [err, res] = await doPromise (
        load_more_postlist (page + 1) (dispatch)
      );
      if (err) {
        setLoadmore (false);
        setRefresh (false);
        return;
      }
      setRefresh (false);
      setPage (page + 1);
      if (res.length < 10) setLoadmore (false);
    }
  };

  const initLoad = async () => {
    if (postlist.length <= 0) {
      setLoading (true);
      const [err, res] = await doPromise (load_postlist () (dispatch));
      if (!err) setLoading (false);
      if (res.length < 10) setLoadmore (false); //初始数据小于10条直接loadmore直接为false，不允许触发滚动加载
    }
  };

  useEffect (() => {
    initLoad ();
  }, []);

  //监听滚动
  useEffect (
    () => {
      document.addEventListener ('scroll', handlerScroll);
      return () => document.removeEventListener ('scroll', handlerScroll);
    },
    [refresh, loadmore]
  );

  return (
    <div styleName="home">
      <MetaTags>
        <title>xiaokyo-首页</title>
        <meta name="description" content="一个简约的交流社区" />
      </MetaTags>

      <div styleName="left">
        <Skeleton active loading={loading}>
          {postlist.map ((item, index) => <Card key={item._id} {...item} />)}
        </Skeleton>

        <Skeleton active loading={refresh} />

        {!loadmore ? <IsMore /> : ''}
      </div>

      <div styleName="right">
        <div styleName="adv">
          adv
        </div>
      </div>
    </div>
  );
};

const Card = ({_id, title, description, user, commentNum = 0, likeNum = 0}) => {
  return (
    <div styleName="card">
      <div styleName="tit"><Link to={`/post/${_id}`}>{title}</Link></div>
      <div styleName="desc">
        {delHtmlTag (description)}
      </div>
      <div styleName="bottom">
        <div styleName="nickname">
          <Link to="/profile">{user.username}</Link>
        </div>
        <div styleName="comment">
          <i className="iconfont icon-comment" />{commentNum}
        </div>
        <div styleName="liked">
          <i className="iconfont icon-like" />{likeNum}
        </div>
      </div>
    </div>
  );
};
