import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import {useSelector, useDispatch} from 'react-redux';
import {Skeleton} from 'antd';

import doPromise from '@common/doPromise';

//redux
import {load_postlist, load_more_postlist} from '@redux/actions/postlist';

//style
import './style.less';

export default props => {
  console.log ('home render');
  const postlist = useSelector (state => state.postlist);
  const dispatch = useDispatch ();
  const [loading, setLoading] = useState (false);
  const [loadmore, setLoadmore] = useState (false);
  // console.log (postlist);

  //处理滚动
  const handlerScroll = async e => {
    if (loadmore) return;

    const scrollT = document.documentElement.scrollTop;
    const clientH = document.documentElement.clientHeight;
    const scrollH = document.documentElement.scrollHeight;

    if (scrollH - (scrollT + clientH) <= 100) {
      setLoadmore (true);
      const [err] = await doPromise (load_more_postlist () (dispatch));
      if (!err) setLoadmore (false);
    }
  };

  const initLoad = async () => {
    if (postlist.length <= 0) {
      setLoading (true);
      // load_postlist () (dispatch).then (res => setLoading (false));
      const [err] = await doPromise (load_postlist () (dispatch));
      if (!err) setLoading (false);
    }
  };

  useEffect (() => {
    // console.log ('startscroll');
    initLoad ();
  }, []);

  //监听滚动
  useEffect (
    () => {
      document.addEventListener ('scroll', handlerScroll);
      return () => document.removeEventListener ('scroll', handlerScroll);
    },
    [loadmore]
  );

  return (
    <div styleName="home">
      <MetaTags>
        <title>xiaokyo-首页</title>
        <meta name="description" content="一个简约的交流社区" />
      </MetaTags>

      <div styleName="left">
        <Skeleton active loading={loading}>
          {postlist.map ((item, index) => <Card key={index} {...item} />)}
        </Skeleton>

        <Skeleton active loading={true} />
      </div>

      <div styleName="right">
        <div styleName="adv">
          adv
        </div>
      </div>
    </div>
  );
};

const Card = ({id, title, content,descrption, nickname, commentNum, likeNum}) => {
  return (
    <div styleName="card">
      <div styleName="tit"><Link to={`/post/${id}`}>{title}</Link></div>
      <div styleName="desc">
        {descrption}{content}
      </div>
      <div styleName="bottom">
        <div styleName="nickname"><Link to="/">{nickname}</Link></div>
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
