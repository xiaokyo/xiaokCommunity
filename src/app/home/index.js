import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import {useSelector, useDispatch} from 'react-redux';
import {Skeleton} from 'antd';

//redux
import {load_postlist, load_more_postlist} from '../../redux/actions/postlist';

//style
import './style.less';

export default props => {
  const data = useSelector (state => state.postlist);
  const dispatch = useDispatch ();
  const [loading, setLoading] = useState (false);
  const [loadmore, setLoadmore] = useState (false);

  const handlerScroll = e => {
    const scrollT = document.documentElement.scrollTop;
    const clientH = document.documentElement.clientHeight;
    const scrollH = document.documentElement.scrollHeight;

    if (scrollH - (scrollT + clientH) <= 100) {
      setLoadmore (true);
      
      load_more_postlist () (dispatch);
    }
  };

  useEffect (() => {
    if (data.length <= 0) {
      setLoading (true);
      load_postlist () (dispatch).then (res => setLoading (false));
    }

    document.addEventListener ('scroll', handlerScroll);

    return () => document.removeEventListener ('scroll', handlerScroll);
  }, []);

  return (
    <div styleName="home">
      <MetaTags>
        <title>xiaokyo-首页</title>
        <meta name="description" content="一个简约的交流社区" />
      </MetaTags>

      <div styleName="left">
        <Skeleton active loading={loading}>
          {data.map ((item, index) => <Card key={item.id} {...item} />)}
        </Skeleton>
      </div>

      <div styleName="right">
        <div styleName="adv">广告</div>
      </div>
    </div>
  );
};

const Card = ({id, title, descrption, nickname, commentNum, likeNum}) => {
  return (
    <div styleName="card">
      <div styleName="tit"><Link to={`/post/${id}`}>{title}</Link></div>
      <div styleName="desc">
        {descrption}
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
