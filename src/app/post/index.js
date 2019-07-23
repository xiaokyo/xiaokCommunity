import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Input} from 'antd';
import Loading from '../../components/loading';
const {TextArea} = Input;
//style
import './style.less';

//actions
import {getPostById, savePostById} from '../../redux/actions/posts';

export default props => {
  // console.log ('render');
  const postid = props.match.params.id;
  const dispacth = useDispatch ();
  const posts = useSelector (state => state.posts);
  const currentPost = getPostById (postid) (posts);

  //加载redux此id未有的帖子详情
  useEffect (() => {
    if (!currentPost.title) {
      savePostById (postid) (dispacth);
    }
  }, []);

  return (
    <div>
      {!currentPost.title
        ? <Loading />
        : <div styleName="post">
            <h1 styleName="tit">{currentPost.title}</h1>
            <div styleName="user_info">
              <Link to="/user">
                <img src={currentPost.user.avatar} styleName="avatar" />
              </Link>
              <div styleName="con">
                <div styleName="top">
                  <div styleName="nickname">
                    <Link to="/user">{currentPost.user.username}</Link>
                  </div>
                  <Button type="primary" shape="round" size="small">
                    <i className="iconfont icon-add" />关注
                  </Button>
                </div>
                <div styleName="bottom">
                  <span>{currentPost.createDate}</span>
                  <span>阅读 26620</span>
                  <span>喜欢 {currentPost.likeNum}</span>
                  <span>评论 {currentPost.commentNum}</span>
                </div>
              </div>
            </div>

            <div styleName="content">
              {currentPost.content}
            </div>

            <div styleName="operation">
              <Button type="primary" shape="round" size="default">
                <i className="iconfont icon-like" />
                喜欢
              </Button>
            </div>

            <div styleName="comment_input">
              <div styleName="comment_tit">评论一下吧~汪</div>
              <div styleName="comment_con">
                <TextArea rows={4} />
              </div>
              <div styleName="comment_operation">
                <Button type="primary" shape="round" size="large">
                  回复
                </Button>
              </div>
            </div>

            {/* <div styleName="reply_con">
              <div styleName="reply_tit">看看都有谁评论了~汪(10)</div>
              <ul styleName="reply_list">
                <ReplyItem />
              </ul>
            </div> */}

          </div>}

    </div>
  );
};

const ReplyItem = props => {
  return (
    <li>
      <div styleName="user_top">
        <img
          src="//upload.jianshu.io/users/upload_avatars/18601142/9a33fe8d-5405-45cc-85dd-ed9ac4c621de.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/114/h/114/format/webp"
          styleName="avatar"
        />
        <div styleName="con">
          <div styleName="username">高三刘四</div>
          <div styleName="date">2019.07.08 23:46</div>
        </div>
      </div>
      <div styleName="desc">杂念感情总让人心碎，纯洁独一的爱情才是真正的幸福！</div>

      <div styleName="tools">
        <div styleName="favour">
          <i className="iconfont icon-like" />43
        </div>

        <div styleName="reply_btn">
          <i className="iconfont icon-comment" />
          回复
        </div>
      </div>
    </li>
  );
};
